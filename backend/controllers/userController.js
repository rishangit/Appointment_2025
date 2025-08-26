const Company = require('../models/Company');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's appointments and stats
    const [appointments, upcomingAppointments, appointmentStats] = await Promise.all([
      Appointment.findByUserId(userId),
      Appointment.getUpcomingAppointments(null, userId),
      Appointment.getStats(null) // Get stats for all appointments (we'll filter by user in frontend)
    ]);

    // Calculate user-specific stats
    const userAppointments = appointments || [];
    const userStats = {
      totalAppointments: userAppointments.length,
      upcomingAppointments: upcomingAppointments.length,
      completedAppointments: userAppointments.filter(a => a.status === 'completed').length,
      cancelledAppointments: userAppointments.filter(a => a.status === 'cancelled').length
    };

    res.json({
      success: true,
      data: {
        stats: userStats,
        appointments: appointments.slice(0, 10), // Recent appointments
        upcomingAppointments: upcomingAppointments.slice(0, 5)
      }
    });
  } catch (error) {
    console.error('User dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getCompanies = async (req, res) => {
  try {
    const userId = req.user.id;
    const companies = await Company.getUserCompanies(userId);

    res.json({
      success: true,
      data: companies
    });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get companies',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.getActiveCompanies();

    res.json({
      success: true,
      data: companies
    });
  } catch (error) {
    console.error('Get all companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get companies',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);

    if (!company || company.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Company not found or not available'
      });
    }

    // Get company services
    const services = await Service.findByCompanyId(id);

    res.json({
      success: true,
      data: {
        company,
        services
      }
    });
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get company',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getServices = async (req, res) => {
  try {
    const { company_id } = req.query;

    if (!company_id) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required'
      });
    }

    // Check if company is active
    const company = await Company.findById(company_id);
    if (!company || company.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Company not found or not available'
      });
    }

    const services = await Service.findByCompanyId(company_id);

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get services',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await Appointment.findByUserId(userId);

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Get my appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointments',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getMyUpcomingAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await Appointment.getUpcomingAppointments(null, userId);

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Get upcoming appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get upcoming appointments',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const searchCompanies = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Get all active companies and filter by search query
    const companies = await Company.getActiveCompanies();
    const filteredCompanies = companies.filter(company => 
      company.name.toLowerCase().includes(query.toLowerCase()) ||
      company.address.toLowerCase().includes(query.toLowerCase()) ||
      (company.contact && company.contact.toLowerCase().includes(query.toLowerCase()))
    );

    res.json({
      success: true,
      data: filteredCompanies
    });
  } catch (error) {
    console.error('Search companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search companies',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getAppointmentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    let appointments = await Appointment.findByUserId(userId);

    // Filter by status if provided
    if (status) {
      appointments = appointments.filter(appointment => appointment.status === status);
    }

    // Sort by date (most recent first)
    appointments.sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Get appointment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointment history',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const createAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { company_id, service_id, appointment_date, appointment_time, notes } = req.body;

    // Validate required fields
    if (!company_id || !service_id || !appointment_date || !appointment_time) {
      return res.status(400).json({
        success: false,
        message: 'Company ID, service ID, appointment date, and appointment time are required'
      });
    }

    // Check if company exists and is active
    const company = await Company.findById(company_id);
    if (!company || company.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Company not found or not available'
      });
    }

    // Check if service exists and belongs to the company
    const service = await Service.findById(service_id);
    if (!service || service.company_id !== company_id) {
      return res.status(400).json({
        success: false,
        message: 'Service not found or does not belong to the selected company'
      });
    }

    // Check if the appointment time is available
    const isAvailable = await Appointment.checkAvailability(company_id, service_id, appointment_date, appointment_time);
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'The selected appointment time is not available'
      });
    }

    // Create the appointment
    const appointmentData = {
      user_id: userId,
      company_id,
      service_id,
      appointment_date,
      appointment_time,
      notes: notes || '',
      status: 'scheduled'
    };

    const appointmentId = await Appointment.create(appointmentData);

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: { id: appointmentId }
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify the appointment belongs to the user
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own appointments'
      });
    }

    // Check if appointment can be cancelled
    if (appointment.status === 'completed' || appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed or already cancelled appointment'
      });
    }

    const result = await Appointment.updateStatus(id, 'cancelled');

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const updateTheme = async (req, res) => {
  try {
    const userId = req.user.id;
    const { theme } = req.body;

    if (!theme) {
      return res.status(400).json({
        success: false,
        message: 'Theme is required'
      });
    }

    // Validate theme value
    const validThemes = ['myInterior', 'modernDark', 'driftwood', 'ravenClaw'];
    if (!validThemes.includes(theme)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid theme value'
      });
    }

    const result = await User.update(userId, { theme });

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Theme updated successfully',
      data: { theme }
    });
  } catch (error) {
    console.error('Update theme error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update theme',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  getDashboard,
  getCompanies,
  getAllCompanies,
  getCompanyById,
  getServices,
  getMyAppointments,
  getMyUpcomingAppointments,
  searchCompanies,
  getAppointmentHistory,
  createAppointment,
  cancelAppointment,
  updateTheme
};

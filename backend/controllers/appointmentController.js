const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const Company = require('../models/Company');

const createAppointment = async (req, res) => {
  try {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { company_id, service_id, appointment_date, appointment_time, notes } = req.body;
    const user_id = req.user.id;

    // Check if service exists and belongs to the company
    const service = await Service.findById(service_id);
    if (!service || service.company_id !== parseInt(company_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service or company'
      });
    }

    // Check if company is active
    const company = await Company.findById(company_id);
    if (!company || company.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Company is not available for appointments'
      });
    }

    // Check availability
    const isAvailable = await Appointment.checkAvailability(company_id, service_id, appointment_date, appointment_time);
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Selected time slot is not available'
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      company_id,
      user_id,
      service_id,
      appointment_date,
      appointment_time,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment
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

const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { appointment_date, appointment_time, notes } = req.body;

    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const result = await Appointment.update(id, { appointment_date, appointment_time, notes });

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment updated successfully'
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
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

const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Appointment.delete(id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete appointment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getAvailableSlots = async (req, res) => {
  try {
    const { company_id, service_id, date } = req.query;

    if (!company_id || !service_id || !date) {
      return res.status(400).json({
        success: false,
        message: 'Company ID, service ID, and date are required'
      });
    }

    // Check if service exists and belongs to the company
    const service = await Service.findById(service_id);
    if (!service || service.company_id !== parseInt(company_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service or company'
      });
    }

    // Generate available time slots (9 AM to 5 PM, 30-minute intervals)
    const availableSlots = [];
    const startHour = 9;
    const endHour = 17;
    const interval = 30; // minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Check if this slot is available
        const isAvailable = await Appointment.checkAvailability(company_id, service_id, date, time);
        
        if (isAvailable) {
          availableSlots.push(time);
        }
      }
    }

    res.json({
      success: true,
      data: {
        date,
        service: {
          id: service.id,
          name: service.name,
          duration: service.duration
        },
        availableSlots
      }
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get available slots',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getUpcomingAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let appointments;
    if (userRole === 'admin') {
      appointments = await Appointment.getUpcomingAppointments();
    } else if (userRole === 'company') {
      const company = await Company.findByUserId(userId);
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company profile not found'
        });
      }
      appointments = await Appointment.getUpcomingAppointments(company.id);
    } else {
      appointments = await Appointment.getUpcomingAppointments(null, userId);
    }

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

// Validation middleware
const validateCreateAppointment = [
  body('company_id').isInt({ min: 1 }).withMessage('Valid company ID is required'),
  body('service_id').isInt({ min: 1 }).withMessage('Valid service ID is required'),
  body('appointment_date').isDate().withMessage('Valid appointment date is required'),
  body('appointment_time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid appointment time is required (HH:MM format)'),
  body('notes').optional().isString().trim().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters')
];

const validateUpdateAppointment = [
  body('appointment_date').isDate().withMessage('Valid appointment date is required'),
  body('appointment_time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid appointment time is required (HH:MM format)'),
  body('notes').optional().isString().trim().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters')
];

module.exports = {
  createAppointment,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  deleteAppointment,
  getAvailableSlots,
  getUpcomingAppointments,
  validateCreateAppointment,
  validateUpdateAppointment
};

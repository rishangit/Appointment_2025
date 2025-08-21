const { body, validationResult } = require('express-validator');
const Company = require('../models/Company');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');
const Subscription = require('../models/Subscription');

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const company = await Company.findByUserId(userId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    // Get company statistics
    const [appointmentStats, serviceStats, upcomingAppointments] = await Promise.all([
      Appointment.getStats(company.id),
      Service.getStatsByCompany(company.id),
      Appointment.getUpcomingAppointments(company.id)
    ]);

    res.json({
      success: true,
      data: {
        company,
        stats: {
          appointments: appointmentStats,
          services: serviceStats
        },
        upcomingAppointments: upcomingAppointments.slice(0, 5)
      }
    });
  } catch (error) {
    console.error('Company dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const company = await Company.findByUserId(userId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('Get company profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get company profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const company = await Company.findByUserId(userId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, address, phone, email } = req.body;
    const result = await Company.update(company.id, { name, address, phone, email });

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      message: 'Company profile updated successfully'
    });
  } catch (error) {
    console.error('Update company profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update company profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getServices = async (req, res) => {
  try {
    const userId = req.user.id;
    const company = await Company.findByUserId(userId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    const services = await Service.findByCompanyId(company.id);

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

const createService = async (req, res) => {
  try {
    const userId = req.user.id;
    const company = await Company.findByUserId(userId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, description, price, duration } = req.body;
    const service = await Service.create({
      company_id: company.id,
      name,
      description,
      price,
      duration
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create service',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const updateService = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const company = await Company.findByUserId(userId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    // Check if service belongs to company
    const service = await Service.findById(id);
    if (!service || service.company_id !== company.id) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, description, price, duration } = req.body;
    const result = await Service.update(id, { name, description, price, duration });

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service updated successfully'
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const deleteService = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const company = await Company.findByUserId(userId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    // Check if service belongs to company
    const service = await Service.findById(id);
    if (!service || service.company_id !== company.id) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const result = await Service.delete(id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const company = await Company.findByUserId(userId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    const appointments = await Appointment.findByCompanyId(company.id);

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointments',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const createAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const company = await Company.findByUserId(userId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { user_id, service_id, appointment_date, appointment_time, notes } = req.body;

    // Check if service belongs to this company
    const service = await Service.findById(service_id);
    if (!service || service.company_id !== company.id) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service selected'
      });
    }

    // Create appointment
    const appointmentData = {
      user_id,
      company_id: company.id,
      service_id,
      appointment_date,
      appointment_time,
      notes: notes || '',
      status: 'scheduled'
    };

    const appointment = await Appointment.create(appointmentData);

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

const updateAppointmentStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;
    const company = await Company.findByUserId(userId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    // Check if appointment belongs to company
    const appointment = await Appointment.findById(id);
    if (!appointment || appointment.company_id !== company.id) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const result = await Appointment.updateStatus(id, status);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment status updated successfully'
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getSubscriptions = async (req, res) => {
  try {
    const userId = req.user.id;
    const company = await Company.findByUserId(userId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    const subscriptions = await Subscription.findByCompanyId(company.id);

    res.json({
      success: true,
      data: subscriptions
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscriptions',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getCompanyUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    const company = await Company.findByUserId(userId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    // Get unique users who have made appointments with this company
    const users = await Appointment.getUsersByCompany(company.id);

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get company users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get company users',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Validation middleware
const validateUpdateProfile = [
  body('name').trim().isLength({ min: 2 }).withMessage('Company name must be at least 2 characters long'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('email').isEmail().normalizeEmail().withMessage('Must be a valid email address')
];

const validateCreateService = [
  body('name').trim().isLength({ min: 2 }).withMessage('Service name must be at least 2 characters long'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('duration').isInt({ min: 15 }).withMessage('Duration must be at least 15 minutes')
];

const validateUpdateService = [
  body('name').trim().isLength({ min: 2 }).withMessage('Service name must be at least 2 characters long'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('duration').isInt({ min: 15 }).withMessage('Duration must be at least 15 minutes')
];

const validateUpdateAppointmentStatus = [
  body('status').isIn(['scheduled', 'confirmed', 'completed', 'cancelled']).withMessage('Invalid status')
];

const validateCreateAppointment = [
  body('user_id').isInt({ min: 1 }).withMessage('User ID is required'),
  body('service_id').isInt({ min: 1 }).withMessage('Service ID is required'),
  body('appointment_date').isISO8601().withMessage('Valid appointment date is required'),
  body('appointment_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid appointment time is required (HH:MM format)'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters')
];

const getBilling = async (req, res) => {
  try {
    const userId = req.user.id;
    const company = await Company.findByUserId(userId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    const { month } = req.query;
    const billingData = await Appointment.getCompanyBilling(company.id, month);

    res.json({
      success: true,
      data: billingData
    });
  } catch (error) {
    console.error('Get billing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get billing data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const validatePayment = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Payment amount must be greater than 0'),
  body('month')
    .optional()
    .isISO8601()
    .withMessage('Invalid month format'),
  body('paymentMethod')
    .isIn(['credit_card', 'bank_transfer'])
    .withMessage('Invalid payment method'),
  body('cardDetails.number')
    .if(body('paymentMethod').equals('credit_card'))
    .isLength({ min: 13, max: 19 })
    .withMessage('Invalid card number'),
  body('cardDetails.holderName')
    .if(body('paymentMethod').equals('credit_card'))
    .trim()
    .isLength({ min: 2 })
    .withMessage('Cardholder name is required'),
  body('cardDetails.expiryDate')
    .if(body('paymentMethod').equals('credit_card'))
    .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)
    .withMessage('Invalid expiry date format (MM/YY)'),
  body('cardDetails.cvv')
    .if(body('paymentMethod').equals('credit_card'))
    .isLength({ min: 3, max: 4 })
    .withMessage('Invalid CVV')
];

const processPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const company = await Company.findByUserId(userId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { amount, month, paymentMethod, cardDetails } = req.body;
    const result = await Appointment.processCommissionPayment(company.id, amount, month, paymentMethod, cardDetails);

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: result
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process payment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  getDashboard,
  getProfile,
  updateProfile,
  getServices,
  createService,
  updateService,
  deleteService,
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
  getCompanyUsers,
  getBilling,
  processPayment,
  getSubscriptions,
  validateUpdateProfile,
  validateCreateService,
  validateUpdateService,
  validateCreateAppointment,
  validateUpdateAppointmentStatus,
  validatePayment
};

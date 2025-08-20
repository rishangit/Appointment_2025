const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Company = require('../models/Company');
const Appointment = require('../models/Appointment');
const Subscription = require('../models/Subscription');
const { SUBSCRIPTION_PLANS } = require('../config/stripe');

const getDashboard = async (req, res) => {
  try {
    // Get all statistics
    const [userStats, companyStats, appointmentStats, subscriptionStats] = await Promise.all([
      User.getStats(),
      Company.getStats(),
      Appointment.getStats(),
      Subscription.getStats()
    ]);

    // Get recent activities
    const [recentCompanies, recentAppointments] = await Promise.all([
      Company.getAll().then(companies => companies.slice(0, 5)),
      Appointment.getAll().then(appointments => appointments.slice(0, 5))
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          users: userStats,
          companies: companyStats,
          appointments: appointmentStats,
          subscriptions: subscriptionStats
        },
        recent: {
          companies: recentCompanies,
          appointments: recentAppointments
        }
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getAllCompanies = async (req, res) => {
  try {
    const { status } = req.query;
    const companies = await Company.getAll(status);

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

const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Get company statistics
    const [appointmentStats, serviceStats] = await Promise.all([
      Appointment.getStats(id),
      require('../models/Service').getStatsByCompany(id)
    ]);

    res.json({
      success: true,
      data: {
        company,
        stats: {
          appointments: appointmentStats,
          services: serviceStats
        }
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

const updateCompanyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const result = await Company.updateStatus(id, status);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      message: 'Company status updated successfully'
    });
  } catch (error) {
    console.error('Update company status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update company status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Company.delete(id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete company',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const users = await User.getAll(role);

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await User.delete(id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const { company_id, start_date, end_date, status } = req.query;
    
    // Get filtered appointments
    const appointments = await Appointment.getFilteredAppointments({
      company_id: company_id ? parseInt(company_id) : null,
      start_date: start_date || null,
      end_date: end_date || null,
      status: status || null
    });

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

const getSubscriptionPlans = async (req, res) => {
  try {
    res.json({
      success: true,
      data: SUBSCRIPTION_PLANS
    });
  } catch (error) {
    console.error('Get subscription plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription plans',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.getAll();

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

const getRevenueStats = async (req, res) => {
  try {
    const [subscriptionStats, revenueByMonth] = await Promise.all([
      Subscription.getStats(),
      Subscription.getRevenueByMonth()
    ]);

    res.json({
      success: true,
      data: {
        stats: subscriptionStats,
        revenueByMonth
      }
    });
  } catch (error) {
    console.error('Get revenue stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get revenue statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getBillingData = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    // Get all appointments with company and service details
    const appointments = await Appointment.getBillingData(start_date, end_date);
    
    // Calculate commission for each appointment (0.5%)
    const commissionRate = 0.005; // 0.5%
    
    // Group by company and calculate totals
    const companyBilling = {};
    let totalCommission = 0;
    let totalRevenue = 0;
    
    appointments.forEach(appointment => {
      const companyId = appointment.company_id;
      const servicePrice = parseFloat(appointment.service_price) || 0;
      const commission = servicePrice * commissionRate;
      
      if (!companyBilling[companyId]) {
        companyBilling[companyId] = {
          company_id: companyId,
          company_name: appointment.company_name,
          total_appointments: 0,
          total_revenue: 0,
          total_commission: 0,
          appointments: []
        };
      }
      
      companyBilling[companyId].total_appointments += 1;
      companyBilling[companyId].total_revenue += servicePrice;
      companyBilling[companyId].total_commission += commission;
      companyBilling[companyId].appointments.push({
        id: appointment.id,
        service_name: appointment.service_name,
        service_price: servicePrice,
        appointment_date: appointment.appointment_date,
        commission: commission
      });
      
      totalRevenue += servicePrice;
      totalCommission += commission;
    });
    
    // Convert to array and sort by total commission
    const billingData = Object.values(companyBilling).sort((a, b) => b.total_commission - a.total_commission);
    
    res.json({
      success: true,
      data: {
        companies: billingData,
        summary: {
          total_companies: billingData.length,
          total_appointments: appointments.length,
          total_revenue: totalRevenue,
          total_commission: totalCommission,
          commission_rate: commissionRate * 100 // Return as percentage
        },
        date_range: {
          start_date: start_date || null,
          end_date: end_date || null
        }
      }
    });
  } catch (error) {
    console.error('Get billing data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get billing data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Validation middleware
const validateUpdateCompanyStatus = [
  body('status').isIn(['pending', 'active', 'suspended']).withMessage('Invalid status')
];

module.exports = {
  getDashboard,
  getAllCompanies,
  getCompanyById,
  updateCompanyStatus,
  deleteCompany,
  getAllUsers,
  deleteUser,
  getAllAppointments,
  getSubscriptionPlans,
  getAllSubscriptions,
  getRevenueStats,
  getBillingData,
  validateUpdateCompanyStatus
};

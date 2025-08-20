const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeAdmin } = require('../config/authMiddleware');

// All routes require admin authentication
router.use(authenticateToken, authorizeAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Company management
router.get('/companies', adminController.getAllCompanies);
router.get('/companies/:id', adminController.getCompanyById);
router.put('/companies/:id/status', adminController.validateUpdateCompanyStatus, adminController.updateCompanyStatus);
router.delete('/companies/:id', adminController.deleteCompany);

// User management
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);

// Appointment management
router.get('/appointments', adminController.getAllAppointments);

// Subscription and billing
router.get('/subscription-plans', adminController.getSubscriptionPlans);
router.get('/subscriptions', adminController.getAllSubscriptions);
router.get('/revenue-stats', adminController.getRevenueStats);
router.get('/billing', adminController.getBillingData);

module.exports = router;

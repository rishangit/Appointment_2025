const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { authenticateToken, authorizeCompany } = require('../config/authMiddleware');

// All routes require company authentication
router.use(authenticateToken, authorizeCompany);

// Dashboard
router.get('/dashboard', companyController.getDashboard);

// Profile management
router.get('/profile', companyController.getProfile);
router.put('/profile', companyController.validateUpdateProfile, companyController.updateProfile);

// Service management
router.get('/services', companyController.getServices);
router.post('/services', companyController.validateCreateService, companyController.createService);
router.put('/services/:id', companyController.validateUpdateService, companyController.updateService);
router.delete('/services/:id', companyController.deleteService);

// Appointment management
router.get('/appointments', companyController.getAppointments);
router.post('/appointments', companyController.validateCreateAppointment, companyController.createAppointment);
router.put('/appointments/:id/status', companyController.validateUpdateAppointmentStatus, companyController.updateAppointmentStatus);

// Company users (users who made appointments)
router.get('/users', companyController.getCompanyUsers);

// Billing management
router.get('/billing', companyController.getBilling);
router.post('/billing/pay', companyController.validatePayment, companyController.processPayment);

// Subscription management
router.get('/subscriptions', companyController.getSubscriptions);

module.exports = router;

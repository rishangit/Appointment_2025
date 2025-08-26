const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeUser } = require('../config/authMiddleware');

// All routes require user authentication
router.use(authenticateToken, authorizeUser);

// Dashboard
router.get('/dashboard', userController.getDashboard);

// Company browsing
router.get('/companies', userController.getCompanies);
router.get('/all-companies', userController.getAllCompanies);
router.get('/companies/search', userController.searchCompanies);
router.get('/companies/:id', userController.getCompanyById);
router.get('/services', userController.getServices);

// Appointment management
router.get('/my-appointments', userController.getMyAppointments);
router.get('/appointments/upcoming', userController.getMyUpcomingAppointments);
router.get('/appointments/history', userController.getAppointmentHistory);
router.post('/appointments', userController.createAppointment);
router.put('/appointments/:id/cancel', userController.cancelAppointment);

// User settings
router.put('/theme', userController.updateTheme);

module.exports = router;

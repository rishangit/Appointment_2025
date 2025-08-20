const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken, authorizeAppointmentOwner } = require('../config/authMiddleware');

// Public routes (for getting available slots)
router.get('/available-slots', appointmentController.getAvailableSlots);

// Protected routes
router.use(authenticateToken);

// Appointment management
router.post('/', appointmentController.validateCreateAppointment, appointmentController.createAppointment);
router.get('/upcoming', appointmentController.getUpcomingAppointments);
router.get('/:id', authorizeAppointmentOwner, appointmentController.getAppointmentById);
router.put('/:id', authorizeAppointmentOwner, appointmentController.validateUpdateAppointment, appointmentController.updateAppointment);
router.put('/:id/cancel', authorizeAppointmentOwner, appointmentController.cancelAppointment);
router.delete('/:id', authorizeAppointmentOwner, appointmentController.deleteAppointment);

module.exports = router;

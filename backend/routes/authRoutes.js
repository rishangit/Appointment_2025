const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../config/authMiddleware');

// Public routes
router.post('/register', authController.validateRegister, authController.register);
router.post('/login', authController.validateLogin, authController.login);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.validateUpdateProfile, authController.updateProfile);

module.exports = router;

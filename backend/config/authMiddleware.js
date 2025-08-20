const jwt = require('jsonwebtoken');
const { getDatabase } = require('./db');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
    req.user = user;
    next();
  });
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
};

const authorizeAdmin = authorizeRole(['admin']);
const authorizeCompany = authorizeRole(['company']);
const authorizeUser = authorizeRole(['user']);
const authorizeCompanyOrAdmin = authorizeRole(['company', 'admin']);

const authorizeCompanyOwner = (req, res, next) => {
  const db = getDatabase();
  const { companyId } = req.params;
  const userId = req.user.id;

  db.get(
    "SELECT id FROM companies WHERE id = ? AND user_id = ?",
    [companyId, userId],
    (err, company) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Database error' 
        });
      }

      if (!company) {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied: Not the company owner' 
        });
      }

      next();
    }
  );
};

const authorizeAppointmentOwner = (req, res, next) => {
  const db = getDatabase();
  const { appointmentId } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  // Admin can access any appointment
  if (userRole === 'admin') {
    return next();
  }

  // Company can access appointments for their company
  if (userRole === 'company') {
    db.get(
      `SELECT a.id FROM appointments a 
       JOIN companies c ON a.company_id = c.id 
       WHERE a.id = ? AND c.user_id = ?`,
      [appointmentId, userId],
      (err, appointment) => {
        if (err) {
          return res.status(500).json({ 
            success: false, 
            message: 'Database error' 
          });
        }

        if (!appointment) {
          return res.status(403).json({ 
            success: false, 
            message: 'Access denied: Appointment not found or not authorized' 
          });
        }

        next();
      }
    );
    return;
  }

  // User can only access their own appointments
  if (userRole === 'user') {
    db.get(
      "SELECT id FROM appointments WHERE id = ? AND user_id = ?",
      [appointmentId, userId],
      (err, appointment) => {
        if (err) {
          return res.status(500).json({ 
            success: false, 
            message: 'Database error' 
          });
        }

        if (!appointment) {
          return res.status(403).json({ 
            success: false, 
            message: 'Access denied: Appointment not found or not authorized' 
          });
        }

        next();
      }
    );
    return;
  }

  res.status(403).json({ 
    success: false, 
    message: 'Insufficient permissions' 
  });
};

module.exports = {
  authenticateToken,
  authorizeRole,
  authorizeAdmin,
  authorizeCompany,
  authorizeUser,
  authorizeCompanyOrAdmin,
  authorizeCompanyOwner,
  authorizeAppointmentOwner
};

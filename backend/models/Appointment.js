const { getDatabase } = require('../config/db');

class Appointment {
  static async create(appointmentData) {
    const db = getDatabase();
    const { company_id, user_id, service_id, appointment_date, appointment_time, notes } = appointmentData;
    
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO appointments (company_id, user_id, service_id, appointment_date, appointment_time, notes) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [company_id, user_id, service_id, appointment_date, appointment_time, notes],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ id: this.lastID, company_id, user_id, service_id, appointment_date, appointment_time, notes });
        }
      );
    });
  }

  static async findById(id) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT a.*, 
                c.name as company_name, c.address as company_address,
                u.name as user_name, u.email as user_email,
                s.name as service_name, s.price as service_price, s.duration as service_duration
         FROM appointments a
         JOIN companies c ON a.company_id = c.id
         JOIN users u ON a.user_id = u.id
         JOIN services s ON a.service_id = s.id
         WHERE a.id = ?`,
        [id],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row);
        }
      );
    });
  }

  static async findByUserId(userId) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT a.*, 
                c.name as company_name, c.address as company_address,
                s.name as service_name, s.price as service_price, s.duration as service_duration
         FROM appointments a
         JOIN companies c ON a.company_id = c.id
         JOIN services s ON a.service_id = s.id
         WHERE a.user_id = ?
         ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
        [userId],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows);
        }
      );
    });
  }

  static async findByCompanyId(companyId) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT a.*, 
                u.name as user_name, u.email as user_email,
                s.name as service_name, s.price as service_price, s.duration as service_duration
         FROM appointments a
         JOIN users u ON a.user_id = u.id
         JOIN services s ON a.service_id = s.id
         WHERE a.company_id = ?
         ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
        [companyId],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows);
        }
      );
    });
  }

  static async update(id, updateData) {
    const db = getDatabase();
    const { appointment_date, appointment_time, notes, status } = updateData;
    
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE appointments 
         SET appointment_date = ?, appointment_time = ?, notes = ?, status = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [appointment_date, appointment_time, notes, status, id],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ changes: this.changes });
        }
      );
    });
  }

  static async updateStatus(id, status) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE appointments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [status, id],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ changes: this.changes });
        }
      );
    });
  }

  static async delete(id) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.run(
        "DELETE FROM appointments WHERE id = ?",
        [id],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ changes: this.changes });
        }
      );
    });
  }

  static async getAll() {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT a.*, 
                c.name as company_name,
                u.name as user_name, u.email as user_email,
                s.name as service_name, s.price as service_price
         FROM appointments a
         JOIN companies c ON a.company_id = c.id
         JOIN users u ON a.user_id = u.id
         JOIN services s ON a.service_id = s.id
         ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows);
        }
      );
    });
  }

  static async getUpcomingAppointments(companyId = null, userId = null) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      let query = `SELECT a.*, 
                          c.name as company_name,
                          u.name as user_name, u.email as user_email,
                          s.name as service_name, s.price as service_price, s.duration as service_duration
                   FROM appointments a
                   JOIN companies c ON a.company_id = c.id
                   JOIN users u ON a.user_id = u.id
                   JOIN services s ON a.service_id = s.id
                   WHERE a.appointment_date >= DATE('now') AND a.status IN ('pending', 'scheduled')`;
      
      let params = [];
      
      if (companyId) {
        query += " AND a.company_id = ?";
        params.push(companyId);
      }
      
      if (userId) {
        query += " AND a.user_id = ?";
        params.push(userId);
      }
      
      query += " ORDER BY a.appointment_date ASC, a.appointment_time ASC";
      
      db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  static async getStats(companyId = null) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      let query = `SELECT 
                      COUNT(*) as total_appointments,
                      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
                      SUM(CASE WHEN status = 'scheduled' THEN 1 ELSE 0 END) as scheduled_count,
                      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_count,
                      SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_count,
                      SUM(CASE WHEN appointment_date >= DATE('now') THEN 1 ELSE 0 END) as upcoming_count
                    FROM appointments`;
      
      let params = [];
      
      if (companyId) {
        query += " WHERE company_id = ?";
        params.push(companyId);
      }
      
      db.get(query, params, (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  }

  static async checkAvailability(companyId, serviceId, date, time) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT COUNT(*) as count 
         FROM appointments 
         WHERE company_id = ? AND service_id = ? AND appointment_date = ? AND appointment_time = ? 
         AND status IN ('pending', 'scheduled')`,
        [companyId, serviceId, date, time],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row.count === 0);
        }
      );
    });
  }

  static async getUsersByCompany(companyId) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT DISTINCT u.id, u.name, u.email, u.created_at,
                COUNT(a.id) as total_appointments,
                MAX(a.appointment_date) as last_appointment_date
         FROM users u
         JOIN appointments a ON u.id = a.user_id
         WHERE a.company_id = ? AND u.role = 'user'
         GROUP BY u.id, u.name, u.email, u.created_at
         ORDER BY last_appointment_date DESC`,
        [companyId],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows);
        }
      );
    });
  }

  static async getBillingData(startDate = null, endDate = null) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      let query = `SELECT a.id, a.company_id, a.appointment_date, a.status,
                          c.name as company_name,
                          s.name as service_name, s.price as service_price
                   FROM appointments a
                   JOIN companies c ON a.company_id = c.id
                   JOIN services s ON a.service_id = s.id
                   WHERE a.status IN ('completed', 'scheduled')`;
      
      let params = [];
      
      if (startDate) {
        query += " AND a.appointment_date >= ?";
        params.push(startDate);
      }
      
      if (endDate) {
        query += " AND a.appointment_date <= ?";
        params.push(endDate);
      }
      
      query += " ORDER BY a.appointment_date DESC, c.name ASC";
      
      db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  static async getFilteredAppointments(filters = {}) {
    const db = getDatabase();
    const { company_id, start_date, end_date, status } = filters;
    
    return new Promise((resolve, reject) => {
      let query = `SELECT a.*, 
                          c.name as company_name, c.address as company_address,
                          u.name as user_name, u.email as user_email,
                          s.name as service_name, s.price as service_price, s.duration as service_duration
                   FROM appointments a
                   JOIN companies c ON a.company_id = c.id
                   JOIN users u ON a.user_id = u.id
                   JOIN services s ON a.service_id = s.id
                   WHERE 1=1`;
      
      let params = [];
      
      if (company_id) {
        query += " AND a.company_id = ?";
        params.push(company_id);
      }
      
      if (start_date) {
        query += " AND a.appointment_date >= ?";
        params.push(start_date);
      }
      
      if (end_date) {
        query += " AND a.appointment_date <= ?";
        params.push(end_date);
      }
      
      if (status) {
        query += " AND a.status = ?";
        params.push(status);
      }
      
      query += " ORDER BY a.appointment_date DESC, a.appointment_time DESC";
      
      db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  static async getCompanyBilling(companyId, month = null) {
    const db = getDatabase();
    
    let query = `
      SELECT 
        a.id,
        a.id as appointment_id,
        c.name as company_name,
        u.name as user_name,
        s.name as service_name,
        s.price as service_price,
        a.appointment_date,
        a.appointment_time,
        ROUND(s.price * 0.005, 2) as commission_amount,
        'pending' as status,
        a.created_at
      FROM appointments a
      JOIN companies c ON a.company_id = c.id
      JOIN users u ON a.user_id = u.id
      JOIN services s ON a.service_id = s.id
      WHERE a.company_id = ?
    `;
    
    const params = [companyId];
    
    if (month) {
      query += ` AND strftime('%Y-%m', a.appointment_date) = ?`;
      params.push(month);
    }
    
    query += ` ORDER BY a.appointment_date DESC, a.appointment_time DESC`;
    
    return new Promise((resolve, reject) => {
      db.all(query, params, async (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        
        // Calculate summary
        const summary = {
          total_appointments: rows.length,
          total_revenue: rows.reduce((sum, row) => sum + row.service_price, 0),
          total_commission: rows.reduce((sum, row) => sum + row.commission_amount, 0),
          pending_commission: rows.reduce((sum, row) => sum + row.commission_amount, 0),
          paid_commission: 0,
          current_month_commission: 0
        };
        
        // Calculate current month commission
        const currentMonth = new Date().toISOString().slice(0, 7);
        const currentMonthRows = rows.filter(row => 
          row.appointment_date.startsWith(currentMonth)
        );
        summary.current_month_commission = currentMonthRows.reduce((sum, row) => sum + row.commission_amount, 0);
        
        resolve({
          billing: rows,
          summary
        });
      });
    });
  }

  static async processCommissionPayment(companyId, amount, month = null, paymentMethod = 'credit_card', cardDetails = null) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      // Simulate payment processing with credit card validation
      if (paymentMethod === 'credit_card' && cardDetails) {
        // Basic credit card validation
        const cardNumber = cardDetails.number.replace(/\s/g, '');
        const expiryDate = cardDetails.expiryDate;
        const cvv = cardDetails.cvv;
        
        // Luhn algorithm for card number validation
        const isValidCard = this.validateCardNumber(cardNumber);
        const isValidExpiry = this.validateExpiryDate(expiryDate);
        const isValidCvv = cvv.length >= 3 && cvv.length <= 4;
        
        if (!isValidCard) {
          reject(new Error('Invalid card number'));
          return;
        }
        
        if (!isValidExpiry) {
          reject(new Error('Card has expired or invalid expiry date'));
          return;
        }
        
        if (!isValidCvv) {
          reject(new Error('Invalid CVV'));
          return;
        }
        
        // Simulate payment gateway processing
        setTimeout(() => {
          // In a real application, this would call a payment gateway API
          // For demo purposes, we'll simulate a successful payment
          const transactionId = 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          
          resolve({
            processed_amount: amount,
            processed_appointments: 0,
            remaining_pending: 0,
            transaction_id: transactionId,
            payment_method: paymentMethod,
            card_last4: cardNumber.slice(-4),
            message: 'Payment processed successfully via credit card'
          });
        }, 2000); // Simulate 2-second processing time
      } else {
        // Fallback for other payment methods
        resolve({
          processed_amount: amount,
          processed_appointments: 0,
          remaining_pending: 0,
          message: 'Payment processed successfully (demo mode)'
        });
      }
    });
  }

  static validateCardNumber(cardNumber) {
    // Luhn algorithm implementation
    let sum = 0;
    let isEven = false;
    
    // Loop through values starting from the rightmost side
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i));
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  }

  static validateExpiryDate(expiryDate) {
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    
    return true;
  }
}

module.exports = Appointment;

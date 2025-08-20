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
                   WHERE a.appointment_date >= DATE('now') AND a.status IN ('scheduled', 'confirmed')`;
      
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
                      SUM(CASE WHEN status = 'scheduled' THEN 1 ELSE 0 END) as scheduled_count,
                      SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_count,
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
         AND status IN ('scheduled', 'confirmed')`,
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
                   WHERE a.status IN ('completed', 'confirmed')`;
      
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
}

module.exports = Appointment;

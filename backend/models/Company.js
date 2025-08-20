const { getDatabase } = require('../config/db');

class Company {
  static async create(companyData) {
    const db = getDatabase();
    const { user_id, name, address, contact, phone, email } = companyData;
    
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO companies (user_id, name, address, contact, phone, email) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [user_id, name, address, contact, phone, email],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ id: this.lastID, user_id, name, address, contact, phone, email });
        }
      );
    });
  }

  static async findById(id) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT c.*, u.name as owner_name, u.email as owner_email 
         FROM companies c 
         JOIN users u ON c.user_id = u.id 
         WHERE c.id = ?`,
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
      db.get(
        "SELECT * FROM companies WHERE user_id = ?",
        [userId],
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

  static async update(id, updateData) {
    const db = getDatabase();
    const { name, address, phone, email } = updateData;
    
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE companies 
         SET name = ?, address = ?, phone = ?, email = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [name, address, phone, email, id],
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
        "UPDATE companies SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
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

  static async updateSubscription(id, subscriptionPlan, stripeCustomerId = null) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      let query = "UPDATE companies SET subscription_plan = ?, updated_at = CURRENT_TIMESTAMP";
      let params = [subscriptionPlan];
      
      if (stripeCustomerId) {
        query += ", stripe_customer_id = ?";
        params.push(stripeCustomerId);
      }
      
      query += " WHERE id = ?";
      params.push(id);
      
      db.run(query, params, function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ changes: this.changes });
      });
    });
  }

  static async delete(id) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.run(
        "DELETE FROM companies WHERE id = ?",
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

  static async getAll(status = null) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      let query = `SELECT c.*, u.name as owner_name, u.email as owner_email 
                   FROM companies c 
                   JOIN users u ON c.user_id = u.id`;
      let params = [];
      
      if (status) {
        query += " WHERE c.status = ?";
        params.push(status);
      }
      
      query += " ORDER BY c.created_at DESC";
      
      db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  static async getStats() {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT 
          COUNT(*) as total_companies,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_companies,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_companies,
          SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspended_companies
        FROM companies`,
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

  static async getActiveCompanies() {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT c.id, c.name, c.address, c.contact, c.phone, c.email 
         FROM companies c 
         WHERE c.status = 'active' 
         ORDER BY c.name`,
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

  static async getUserCompanies(userId) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          c.id, 
          c.name, 
          c.address, 
          c.contact, 
          c.phone, 
          c.email,
          c.status,
          COUNT(a.id) as appointment_count,
          MAX(a.appointment_date) as last_appointment_date,
          SUM(s.price) as total_spent
        FROM companies c
        JOIN appointments a ON c.id = a.company_id
        JOIN services s ON a.service_id = s.id
        WHERE a.user_id = ?
        GROUP BY c.id, c.name, c.address, c.contact, c.phone, c.email, c.status
        ORDER BY last_appointment_date DESC`,
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
}

module.exports = Company;

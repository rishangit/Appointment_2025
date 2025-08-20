const { getDatabase } = require('../config/db');

class Service {
  static async create(serviceData) {
    const db = getDatabase();
    const { company_id, name, description, price, duration } = serviceData;
    
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO services (company_id, name, description, price, duration) 
         VALUES (?, ?, ?, ?, ?)`,
        [company_id, name, description, price, duration],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ id: this.lastID, company_id, name, description, price, duration });
        }
      );
    });
  }

  static async findById(id) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM services WHERE id = ?",
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

  static async findByCompanyId(companyId) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM services WHERE company_id = ? ORDER BY name",
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
    const { name, description, price, duration } = updateData;
    
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE services 
         SET name = ?, description = ?, price = ?, duration = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [name, description, price, duration, id],
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
        "DELETE FROM services WHERE id = ?",
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
        `SELECT s.*, c.name as company_name 
         FROM services s 
         JOIN companies c ON s.company_id = c.id 
         WHERE c.status = 'active' 
         ORDER BY c.name, s.name`,
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

  static async getStatsByCompany(companyId) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT 
          COUNT(*) as total_services,
          AVG(price) as avg_price,
          MIN(price) as min_price,
          MAX(price) as max_price
        FROM services 
        WHERE company_id = ?`,
        [companyId],
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

  static async getServicesWithAppointments(companyId) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT s.*, COUNT(a.id) as appointment_count
         FROM services s
         LEFT JOIN appointments a ON s.id = a.service_id
         WHERE s.company_id = ?
         GROUP BY s.id
         ORDER BY s.name`,
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
}

module.exports = Service;

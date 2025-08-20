const { getDatabase } = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const db = getDatabase();
    const { name, email, password, role } = userData;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, role],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ id: this.lastID, name, email, role });
        }
      );
    });
  }

  static async findByEmail(email) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
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

  static async findById(id) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
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

  static async update(id, updateData) {
    const db = getDatabase();
    const { name, email } = updateData;
    
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE users SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [name, email, id],
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
        "DELETE FROM users WHERE id = ?",
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

  static async getAll(role = null) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      let query = "SELECT id, name, email, role, created_at FROM users";
      let params = [];
      
      if (role) {
        query += " WHERE role = ?";
        params.push(role);
      }
      
      query += " ORDER BY created_at DESC";
      
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
          COUNT(*) as total_users,
          SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_count,
          SUM(CASE WHEN role = 'company' THEN 1 ELSE 0 END) as company_count,
          SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) as user_count
        FROM users`,
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

  static async verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;

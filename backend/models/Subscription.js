const { getDatabase } = require('../config/db');

class Subscription {
  static async create(subscriptionData) {
    const db = getDatabase();
    const { company_id, plan, stripe_subscription_id, start_date, end_date, amount } = subscriptionData;
    
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO subscriptions (company_id, plan, stripe_subscription_id, start_date, end_date, amount) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [company_id, plan, stripe_subscription_id, start_date, end_date, amount],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ id: this.lastID, company_id, plan, stripe_subscription_id, start_date, end_date, amount });
        }
      );
    });
  }

  static async findById(id) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT s.*, c.name as company_name 
         FROM subscriptions s
         JOIN companies c ON s.company_id = c.id
         WHERE s.id = ?`,
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
        "SELECT * FROM subscriptions WHERE company_id = ? ORDER BY start_date DESC",
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

  static async getActiveSubscription(companyId) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM subscriptions 
         WHERE company_id = ? AND payment_status = 'active' 
         AND end_date >= DATE('now')
         ORDER BY start_date DESC LIMIT 1`,
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

  static async update(id, updateData) {
    const db = getDatabase();
    const { plan, start_date, end_date, payment_status, amount } = updateData;
    
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE subscriptions 
         SET plan = ?, start_date = ?, end_date = ?, payment_status = ?, amount = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [plan, start_date, end_date, payment_status, amount, id],
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

  static async updatePaymentStatus(id, paymentStatus) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE subscriptions SET payment_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [paymentStatus, id],
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
        "DELETE FROM subscriptions WHERE id = ?",
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
         FROM subscriptions s
         JOIN companies c ON s.company_id = c.id
         ORDER BY s.start_date DESC`,
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

  static async getStats() {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT 
          COUNT(*) as total_subscriptions,
          SUM(CASE WHEN payment_status = 'active' THEN 1 ELSE 0 END) as active_subscriptions,
          SUM(CASE WHEN payment_status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_subscriptions,
          SUM(CASE WHEN payment_status = 'past_due' THEN 1 ELSE 0 END) as past_due_subscriptions,
          SUM(amount) as total_revenue
        FROM subscriptions`,
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

  static async getRevenueByMonth() {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          strftime('%Y-%m', start_date) as month,
          COUNT(*) as subscription_count,
          SUM(amount) as revenue
        FROM subscriptions
        WHERE payment_status = 'active'
        GROUP BY strftime('%Y-%m', start_date)
        ORDER BY month DESC
        LIMIT 12`,
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

  static async getExpiringSubscriptions(days = 30) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT s.*, c.name as company_name, c.email as company_email
         FROM subscriptions s
         JOIN companies c ON s.company_id = c.id
         WHERE s.payment_status = 'active' 
         AND s.end_date BETWEEN DATE('now') AND DATE('now', '+' || ? || ' days')
         ORDER BY s.end_date ASC`,
        [days],
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

module.exports = Subscription;

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database/appointments.db');

let db;

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        reject(err);
        return;
      }
      console.log('📦 Connected to SQLite database');
      
      // Enable foreign keys
      db.run('PRAGMA foreign_keys = ON');
      
      // Create tables
      createTables()
        .then(() => seedInitialData())
        .then(() => {
          console.log('✅ Database initialized successfully');
          resolve();
        })
        .catch(reject);
    });
  });
};

const createTables = () => {
  return new Promise((resolve, reject) => {
    const tables = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT CHECK(role IN ('admin', 'company', 'user')) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Companies table
      `CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE,
        name TEXT NOT NULL,
        address TEXT,
        contact TEXT,
        phone TEXT,
        email TEXT,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'active', 'suspended')),
        subscription_plan TEXT DEFAULT 'basic',
        stripe_customer_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )`,
      
      // Services table
      `CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        duration INTEGER NOT NULL, -- in minutes
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
      )`,
      
      // Appointments table
      `CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        service_id INTEGER NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        notes TEXT,
        status TEXT DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE CASCADE
      )`,
      
      // Subscriptions table
      `CREATE TABLE IF NOT EXISTS subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_id INTEGER NOT NULL,
        plan TEXT NOT NULL,
        stripe_subscription_id TEXT,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'active', 'cancelled', 'past_due')),
        amount DECIMAL(10,2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
      )`
    ];

    let completed = 0;
    tables.forEach((table, index) => {
      db.run(table, (err) => {
        if (err) {
          console.error(`Error creating table ${index + 1}:`, err.message);
          reject(err);
          return;
        }
        completed++;
        if (completed === tables.length) {
          resolve();
        }
      });
    });
  });
};

const seedInitialData = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if admin already exists
      const adminExists = await new Promise((resolve, reject) => {
        db.get("SELECT id FROM users WHERE role = 'admin' LIMIT 1", (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      if (!adminExists) {
        // Create default admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await new Promise((resolve, reject) => {
          db.run(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            ['Super Admin', 'admin@appointments.com', hashedPassword, 'admin'],
            (err) => {
              if (err) {
                console.error('Error creating admin user:', err.message);
                reject(err);
              } else {
                console.log('👤 Default admin user created: admin@appointments.com / admin123');
                resolve();
              }
            }
          );
        });
      }

      // Check if sample data already exists
      const sampleDataExists = await new Promise((resolve, reject) => {
        db.get("SELECT id FROM users WHERE email = 'john.doe@example.com' LIMIT 1", (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      if (!sampleDataExists) {
        console.log('🌱 Creating sample data...');
        
        // Create sample users
        const sampleUsers = [
          { name: 'John Doe', email: 'john.doe@example.com', password: 'user123', role: 'user' },
          { name: 'Jane Smith', email: 'jane.smith@example.com', password: 'user123', role: 'user' },
          { name: 'Mike Johnson', email: 'mike.johnson@example.com', password: 'user123', role: 'user' }
        ];

        for (const user of sampleUsers) {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          await new Promise((resolve, reject) => {
            db.run(
              "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
              [user.name, user.email, hashedPassword, user.role],
              function(err) {
                if (err) {
                  console.error(`Error creating user ${user.email}:`, err.message);
                  reject(err);
                } else {
                  console.log(`👤 Sample user created: ${user.email} / ${user.password}`);
                  resolve(this.lastID);
                }
              }
            );
          });
        }

        // Create sample companies
        const sampleCompanies = [
          {
            name: 'Beauty Salon Pro',
            address: '123 Main Street, Downtown, NY 10001',
            contact: 'Sarah Wilson',
            phone: '+1-555-0101',
            email: 'info@beautysalonpro.com',
            user_email: 'sarah.wilson@beautysalonpro.com',
            user_password: 'company123'
          },
          {
            name: 'Tech Solutions Inc',
            address: '456 Business Ave, Tech District, CA 90210',
            contact: 'David Chen',
            phone: '+1-555-0202',
            email: 'contact@techsolutions.com',
            user_email: 'david.chen@techsolutions.com',
            user_password: 'company123'
          },
          {
            name: 'Health & Wellness Center',
            address: '789 Wellness Blvd, Health District, TX 75001',
            contact: 'Dr. Emily Rodriguez',
            phone: '+1-555-0303',
            email: 'appointments@healthwellness.com',
            user_email: 'emily.rodriguez@healthwellness.com',
            user_password: 'company123'
          }
        ];

        for (const company of sampleCompanies) {
          // Create company user
          const hashedPassword = await bcrypt.hash(company.user_password, 10);
          const userId = await new Promise((resolve, reject) => {
            db.run(
              "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
              [company.contact, company.user_email, hashedPassword, 'company'],
              function(err) {
                if (err) {
                  console.error(`Error creating company user ${company.user_email}:`, err.message);
                  reject(err);
                } else {
                  console.log(`🏢 Company user created: ${company.user_email} / ${company.user_password}`);
                  resolve(this.lastID);
                }
              }
            );
          });

          // Create company profile
          await new Promise((resolve, reject) => {
            db.run(
              "INSERT INTO companies (user_id, name, address, contact, phone, email, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
              [userId, company.name, company.address, company.contact, company.phone, company.email, 'active'],
              function(err) {
                if (err) {
                  console.error(`Error creating company ${company.name}:`, err.message);
                  reject(err);
                } else {
                  console.log(`🏢 Company profile created: ${company.name}`);
                  resolve(this.lastID);
                }
              }
            );
          });
        }

        // Create sample services for companies
        const sampleServices = [
          // Beauty Salon Pro services
          { company_name: 'Beauty Salon Pro', name: 'Haircut & Styling', description: 'Professional haircut and styling service', price: 45.00, duration: 60 },
          { company_name: 'Beauty Salon Pro', name: 'Manicure & Pedicure', description: 'Complete nail care service', price: 35.00, duration: 45 },
          { company_name: 'Beauty Salon Pro', name: 'Facial Treatment', description: 'Rejuvenating facial treatment', price: 65.00, duration: 90 },
          
          // Tech Solutions Inc services
          { company_name: 'Tech Solutions Inc', name: 'Website Development', description: 'Custom website development service', price: 1500.00, duration: 480 },
          { company_name: 'Tech Solutions Inc', name: 'IT Consultation', description: 'Professional IT consulting', price: 100.00, duration: 60 },
          { company_name: 'Tech Solutions Inc', name: 'System Maintenance', description: 'Regular system maintenance and updates', price: 200.00, duration: 120 },
          
          // Health & Wellness Center services
          { company_name: 'Health & Wellness Center', name: 'General Checkup', description: 'Comprehensive health checkup', price: 120.00, duration: 30 },
          { company_name: 'Health & Wellness Center', name: 'Massage Therapy', description: 'Relaxing massage therapy session', price: 80.00, duration: 60 },
          { company_name: 'Health & Wellness Center', name: 'Nutrition Consultation', description: 'Personalized nutrition advice', price: 75.00, duration: 45 }
        ];

        for (const service of sampleServices) {
          // Get company ID
          const companyId = await new Promise((resolve, reject) => {
            db.get("SELECT id FROM companies WHERE name = ?", [service.company_name], (err, row) => {
              if (err) reject(err);
              else resolve(row ? row.id : null);
            });
          });

          if (companyId) {
            await new Promise((resolve, reject) => {
              db.run(
                "INSERT INTO services (company_id, name, description, price, duration) VALUES (?, ?, ?, ?, ?)",
                [companyId, service.name, service.description, service.price, service.duration],
                function(err) {
                  if (err) {
                    console.error(`Error creating service ${service.name}:`, err.message);
                    reject(err);
                  } else {
                    console.log(`🔧 Service created: ${service.name} for ${service.company_name}`);
                    resolve();
                  }
                }
              );
            });
          }
        }

        // Create sample appointments
        const sampleAppointments = [
          {
            user_email: 'john.doe@example.com',
            company_name: 'Beauty Salon Pro',
            service_name: 'Haircut & Styling',
            date: '2024-01-15',
            time: '14:00',
            status: 'confirmed'
          },
          {
            user_email: 'jane.smith@example.com',
            company_name: 'Health & Wellness Center',
            service_name: 'General Checkup',
            date: '2024-01-16',
            time: '10:30',
            status: 'scheduled'
          },
          {
            user_email: 'mike.johnson@example.com',
            company_name: 'Tech Solutions Inc',
            service_name: 'IT Consultation',
            date: '2024-01-17',
            time: '15:00',
            status: 'scheduled'
          }
        ];

        for (const appointment of sampleAppointments) {
          // Get user ID
          const userId = await new Promise((resolve, reject) => {
            db.get("SELECT id FROM users WHERE email = ?", [appointment.user_email], (err, row) => {
              if (err) reject(err);
              else resolve(row ? row.id : null);
            });
          });

          // Get company ID
          const companyId = await new Promise((resolve, reject) => {
            db.get("SELECT id FROM companies WHERE name = ?", [appointment.company_name], (err, row) => {
              if (err) reject(err);
              else resolve(row ? row.id : null);
            });
          });

          // Get service ID
          const serviceId = await new Promise((resolve, reject) => {
            db.get("SELECT id FROM services WHERE name = ? AND company_id = ?", [appointment.service_name, companyId], (err, row) => {
              if (err) reject(err);
              else resolve(row ? row.id : null);
            });
          });

          if (userId && companyId && serviceId) {
            await new Promise((resolve, reject) => {
              db.run(
                "INSERT INTO appointments (company_id, user_id, service_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?, ?)",
                [companyId, userId, serviceId, appointment.date, appointment.time, appointment.status],
                function(err) {
                  if (err) {
                    console.error(`Error creating appointment:`, err.message);
                    reject(err);
                  } else {
                    console.log(`📅 Appointment created: ${appointment.user_email} at ${appointment.company_name}`);
                    resolve();
                  }
                }
              );
            });
          }
        }

        console.log('✅ Sample data created successfully!');
      } else {
        console.log('📊 Sample data already exists, skipping...');
      }

      resolve();
    } catch (error) {
      console.error('Error seeding initial data:', error);
      reject(error);
    }
  });
};

const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
};

module.exports = {
  initializeDatabase,
  getDatabase
};

const { getDatabase, initializeDatabase } = require('../config/db');

const updateAppointmentStatuses = async () => {
  // Initialize database first
  await initializeDatabase();
  const db = getDatabase();
  
  console.log('🔄 Starting appointment status migration...');
  
  return new Promise((resolve, reject) => {
    // First, update the table schema to allow the new status values
    db.run(`
      CREATE TABLE IF NOT EXISTS appointments_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        service_id INTEGER NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        notes TEXT,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'scheduled', 'completed', 'cancelled')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE CASCADE
      )
    `, (err) => {
      if (err) {
        console.error('❌ Error creating new appointments table:', err.message);
        reject(err);
        return;
      }
      
      console.log('✅ New appointments table schema created');
      
      // Copy data with status mapping
      db.run(`
        INSERT INTO appointments_new 
        SELECT 
          id,
          company_id,
          user_id,
          service_id,
          appointment_date,
          appointment_time,
          notes,
          CASE 
            WHEN status = 'scheduled' THEN 'scheduled'
            WHEN status = 'confirmed' THEN 'scheduled'
            WHEN status = 'completed' THEN 'completed'
            WHEN status = 'cancelled' THEN 'cancelled'
            ELSE 'pending'
          END as status,
          created_at,
          updated_at
        FROM appointments
      `, (err) => {
        if (err) {
          console.error('❌ Error copying appointment data:', err.message);
          reject(err);
          return;
        }
        
        console.log('✅ Appointment data copied with new status mapping');
        
        // Drop the old table
        db.run('DROP TABLE appointments', (err) => {
          if (err) {
            console.error('❌ Error dropping old appointments table:', err.message);
            reject(err);
            return;
          }
          
          console.log('✅ Old appointments table dropped');
          
          // Rename new table to appointments
          db.run('ALTER TABLE appointments_new RENAME TO appointments', (err) => {
            if (err) {
              console.error('❌ Error renaming appointments table:', err.message);
              reject(err);
              return;
            }
            
            console.log('✅ Appointments table renamed successfully');
            
            // Update any existing appointments to have 'pending' status if they don't have a valid status
            db.run(`
              UPDATE appointments 
              SET status = 'pending' 
              WHERE status NOT IN ('pending', 'scheduled', 'completed', 'cancelled')
            `, (err) => {
              if (err) {
                console.error('❌ Error updating invalid statuses:', err.message);
                reject(err);
                return;
              }
              
              console.log('✅ Invalid statuses updated to pending');
              
              // Show migration summary
              db.all('SELECT status, COUNT(*) as count FROM appointments GROUP BY status', (err, rows) => {
                if (err) {
                  console.error('❌ Error getting migration summary:', err.message);
                  reject(err);
                  return;
                }
                
                console.log('\n📊 Migration Summary:');
                rows.forEach(row => {
                  console.log(`   ${row.status}: ${row.count} appointments`);
                });
                
                console.log('\n✅ Appointment status migration completed successfully!');
                console.log('\n📋 New Status Workflow:');
                console.log('   PENDING → SCHEDULED → COMPLETED/CANCELLED');
                console.log('\n   • PENDING: New appointments created by users');
                console.log('   • SCHEDULED: Appointments accepted by companies');
                console.log('   • COMPLETED: Finished appointments');
                console.log('   • CANCELLED: Cancelled appointments');
                
                resolve();
              });
            });
          });
        });
      });
    });
  });
};

// Run the migration if this script is executed directly
if (require.main === module) {
  updateAppointmentStatuses()
    .then(() => {
      console.log('\n🎉 Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Migration failed:', error.message);
      process.exit(1);
    });
}

module.exports = { updateAppointmentStatuses };

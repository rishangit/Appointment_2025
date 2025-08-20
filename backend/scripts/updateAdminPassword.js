const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, '../../database/appointments.db');

// Function to update admin password
const updateAdminPassword = async (newPassword) => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        reject(err);
        return;
      }

      // Hash the new password
      bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err.message);
          reject(err);
          return;
        }

        // Update the admin password
        db.run(
          "UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE email = 'admin@appointments.com'",
          [hashedPassword],
          function(err) {
            if (err) {
              console.error('Error updating admin password:', err.message);
              reject(err);
            } else {
              if (this.changes > 0) {
                console.log('✅ Admin password updated successfully!');
                console.log(`📧 Email: admin@appointments.com`);
                console.log(`🔑 New Password: ${newPassword}`);
              } else {
                console.log('❌ Admin user not found');
              }
              db.close();
              resolve();
            }
          }
        );
      });
    });
  });
};

// Get new password from command line argument
const newPassword = process.argv[2];

if (!newPassword) {
  console.log('❌ Please provide a new password as an argument');
  console.log('Usage: node updateAdminPassword.js <new_password>');
  console.log('Example: node updateAdminPassword.js myNewPassword123');
  process.exit(1);
}

// Update the password
updateAdminPassword(newPassword)
  .then(() => {
    console.log('🎉 Password update completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error updating password:', error.message);
    process.exit(1);
  });

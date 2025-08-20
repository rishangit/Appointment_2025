const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, '..', '..', 'database', 'appointments.db');

// Get command line arguments
const args = process.argv.slice(2);
const email = args[0];
const newRole = args[1];

// Valid roles
const validRoles = ['admin', 'company', 'user'];

if (!email || !newRole) {
  console.error('Usage: node changeUserRole.js <email> <role>');
  console.error('Valid roles:', validRoles.join(', '));
  process.exit(1);
}

if (!validRoles.includes(newRole)) {
  console.error('Invalid role. Valid roles are:', validRoles.join(', '));
  process.exit(1);
}

// Connect to database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to the SQLite database.');
});

// Update user role
const updateUserRole = () => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE users SET role = ? WHERE email = ?';
    
    db.run(sql, [newRole, email], function(err) {
      if (err) {
        reject(err);
        return;
      }
      
      if (this.changes === 0) {
        reject(new Error(`No user found with email: ${email}`));
        return;
      }
      
      resolve(this.changes);
    });
  });
};

// Main execution
async function main() {
  try {
    console.log(`Updating role for ${email} to ${newRole}...`);
    
    const changes = await updateUserRole();
    
    console.log(`✅ Successfully updated ${changes} user(s)`);
    console.log(`User ${email} now has role: ${newRole}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed.');
      }
    });
  }
}

main();

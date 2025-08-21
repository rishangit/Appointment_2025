const { updateAppointmentStatuses } = require('./updateAppointmentStatuses');

console.log('🚀 Starting appointment status migration...\n');

updateAppointmentStatuses()
  .then(() => {
    console.log('\n🎉 Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error.message);
    process.exit(1);
  });

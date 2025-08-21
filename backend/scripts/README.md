# Database Migration Scripts

## Appointment Status Migration

This migration updates the appointment status workflow to match the new business logic.

### New Status Workflow

**Before:**
- `scheduled` → `confirmed` → `completed`/`cancelled`

**After:**
- `pending` → `scheduled` → `completed`/`cancelled`

### Status Mapping

| Old Status | New Status | Description |
|------------|------------|-------------|
| `scheduled` | `scheduled` | Appointments accepted by companies |
| `confirmed` | `scheduled` | Merged into scheduled (company acceptance) |
| `completed` | `completed` | Finished appointments |
| `cancelled` | `cancelled` | Cancelled appointments |
| `*` | `pending` | New appointments created by users |

### Running the Migration

1. **Backup your database** (recommended):
   ```bash
   cp database/appointments.db database/appointments_backup.db
   ```

2. **Run the migration**:
   ```bash
   cd backend
   node scripts/runMigration.js
   ```

3. **Verify the migration**:
   ```bash
   sqlite3 database/appointments.db "SELECT status, COUNT(*) as count FROM appointments GROUP BY status;"
   ```

### What the Migration Does

1. ✅ Creates new appointments table with updated schema
2. ✅ Copies existing data with status mapping
3. ✅ Drops old table and renames new table
4. ✅ Updates any invalid statuses to 'pending'
5. ✅ Provides migration summary

### Expected Output

```
🔄 Starting appointment status migration...
✅ New appointments table schema created
✅ Appointment data copied with new status mapping
✅ Old appointments table dropped
✅ Appointments table renamed successfully
✅ Invalid statuses updated to pending

📊 Migration Summary:
   pending: 5 appointments
   scheduled: 12 appointments
   completed: 8 appointments
   cancelled: 2 appointments

✅ Appointment status migration completed successfully!

📋 New Status Workflow:
   PENDING → SCHEDULED → COMPLETED/CANCELLED

   • PENDING: New appointments created by users
   • SCHEDULED: Appointments accepted by companies
   • COMPLETED: Finished appointments
   • CANCELLED: Cancelled appointments

🎉 Migration completed successfully!
```

### Rollback (if needed)

If you need to rollback the migration:

1. Restore from backup:
   ```bash
   cp database/appointments_backup.db database/appointments.db
   ```

2. Update the frontend to use old status values
3. Update backend models to use old status logic

### Frontend Updates Required

After running this migration, update your frontend components to:

1. Use the new `AppointmentStatus` enum
2. Handle `pending` status for new appointments
3. Update status change logic (pending → scheduled)
4. Remove references to `confirmed` status

### Backend Updates Required

The following files have been updated:

- ✅ `backend/config/db.js` - Updated schema
- ✅ `backend/models/Appointment.js` - Updated queries
- ✅ `frontend/src/types/index.ts` - Updated enum

### Testing

After migration, test the following workflows:

1. **User creates appointment** → Status should be `pending`
2. **Company accepts appointment** → Status should change to `scheduled`
3. **Company completes appointment** → Status should change to `completed`
4. **Either party cancels** → Status should change to `cancelled`

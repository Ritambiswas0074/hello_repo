# Schema Updates Summary

## Changes Made

### 1. Enhanced Schedule Table - Collision Detection

**Updated Unique Constraint:**
```prisma
@@unique([locationId, date, startTime, endTime])
```

This prevents:
- Double booking at the same location, date, and time
- Database-level collision protection
- Time slot conflicts

### 2. Admin Master Table (Virtual)

The admin endpoint `/api/admin/bookings` provides a master view with:

**Fields Included:**
- User Information: Name, Email, Phone
- Location Details: Name, City, Address
- Event Information: Date, Start Time, End Time
- Media Information: Filename, Type
- Plan Information: Name, Price
- Booking Status: DRAFT, PENDING_PAYMENT, PAYMENT_APPROVED, ACTIVE, COMPLETED, CANCELLED
- Payment Status: PENDING, PROCESSING, SUCCEEDED, FAILED, REFUNDED
- Payment Details: Amount, Confirmation Status, Rejection Reason, Stripe Payment ID, Paid At

### 3. Collision Detection Logic

**Schedule Creation:**
- Checks for existing bookings on the same date and location
- Verifies time slot availability
- Returns 409 Conflict with details if collision detected

**Booking Creation:**
- Double-checks for conflicts
- Verifies schedule availability
- Prevents booking if conflict exists
- Returns detailed error with conflict information

### 4. WhatsApp Fallback

Added to all booking flow pages:
- Locations page
- Schedule page
- Upload page
- Plan page
- Checkout page

Users can get help at any step if the process seems overwhelming.

## Migration Steps

1. **Backup Database** (Recommended)
   ```bash
   pg_dump <your_database_url> > backup.sql
   ```

2. **Apply Schema Changes**
   ```bash
   cd backend
   npx prisma db push
   ```

   Or create a migration:
   ```bash
   npx prisma migrate dev --name add_collision_detection_and_admin
   ```

3. **Verify Changes**
   ```bash
   npx prisma studio
   ```
   Check that the unique constraint is applied to Schedule table.

## Testing Collision Detection

1. Create a booking for Location A on Date X
2. Try to create another booking for Location A on Date X
3. Should receive 409 Conflict error
4. Error includes details about existing booking

## Admin Access

To grant admin access to a user:

```typescript
// Using Prisma
await prisma.user.update({
  where: { email: 'admin@example.com' },
  data: { role: 'ADMIN' },
});
```

Or via SQL:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

## API Endpoints Added

- `GET /api/admin/bookings` - Get all bookings (admin only)
- `GET /api/admin/stats` - Get booking statistics (admin only)

Both require ADMIN role and authentication token.


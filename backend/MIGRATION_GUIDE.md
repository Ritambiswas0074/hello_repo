# Database Migration Guide

## Schema Updates

### 1. Schedule Table - Enhanced Collision Detection

The Schedule table now has improved unique constraints to prevent double booking:

```prisma
@@unique([locationId, date, startTime, endTime])
```

This ensures that:
- Same location + same date + same time slot = unique booking
- Prevents double booking at the same location, date, and time

### 2. Admin Master Table

A new admin endpoint `/api/admin/bookings` provides a master view of all bookings with:
- User information (name, email, phone)
- Location details
- Event date and time
- Payment status (confirmed/rejected)
- Booking status

## Migration Steps

### Step 1: Update Prisma Schema

The schema has been updated. Run:

```bash
cd backend
npx prisma db push
```

Or create a migration:

```bash
npx prisma migrate dev --name add_collision_detection
```

### Step 2: Verify Unique Constraint

The unique constraint on `[locationId, date, startTime, endTime]` will prevent:
- Double booking at the same location, date, and time
- Database-level collision prevention

### Step 3: Test Collision Detection

1. Try to create two bookings for the same location, date, and time
2. The second booking should fail with a 409 Conflict error
3. The error will include details about the existing booking

## Admin Endpoints

### Get All Bookings (Master Table)

```bash
GET /api/admin/bookings
Authorization: Bearer <admin_token>
```

Query Parameters:
- `status` - Filter by booking status
- `locationId` - Filter by location
- `startDate` - Filter bookings from this date
- `endDate` - Filter bookings until this date

Response includes:
- All booking details
- User information
- Payment status (confirmed/rejected)
- Summary statistics

### Get Booking Statistics

```bash
GET /api/admin/stats
Authorization: Bearer <admin_token>
```

Returns:
- Total bookings
- Pending payments
- Approved payments
- Active bookings
- Total revenue

## Collision Detection Logic

### In Schedule Creation

1. Checks if date is already booked for the location
2. Checks if time slot overlaps with existing bookings
3. Returns 409 Conflict if collision detected

### In Booking Creation

1. Checks for existing bookings on the same date and location
2. Verifies schedule availability
3. Prevents booking if conflict exists
4. Returns detailed error with conflict information

## WhatsApp Fallback

Users can now contact support via WhatsApp if they find the booking process overwhelming:

1. Click "Need Help? Contact via WhatsApp" button
2. WhatsApp link is generated with booking details
3. Opens WhatsApp with pre-filled message
4. Support team can assist manually

## Notes

- All admin endpoints require ADMIN role
- Collision detection works at both schedule and booking levels
- Unique constraints provide database-level protection
- WhatsApp fallback helps users who need assistance


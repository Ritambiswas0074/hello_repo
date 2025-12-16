# Start Time Only Booking Guide

## Overview

The booking system now uses **only start time** instead of a time range. The end time is automatically calculated as **start time + 1 hour**.

## Changes Made

### 1. Database Schema
- **Unique constraint** changed from `[locationId, date, startTime, endTime]` to `[locationId, date, startTime]`
- `endTime` is still stored in the database but is **calculated automatically** from `startTime + 1 hour`
- `endTime` field remains optional in the schema for backward compatibility

### 2. Booking Duration
- **Fixed duration**: 1 hour (60 minutes) for all bookings
- Defined in `backend/src/utils/schedule.utils.ts` as `BOOKING_DURATION_MINUTES = 60`

### 3. API Changes

#### Schedule Creation (`POST /api/schedule`)
**Before:**
```json
{
  "locationId": "loc-1",
  "date": "2024-12-25T00:00:00Z",
  "startTime": "2024-12-25T15:00:00Z",
  "endTime": "2024-12-25T16:00:00Z"
}
```

**After:**
```json
{
  "locationId": "loc-1",
  "date": "2024-12-25T00:00:00Z",
  "startTime": "2024-12-25T15:00:00Z"
}
```

**Response:**
```json
{
  "schedule": {
    "id": "schedule-123",
    "date": "2024-12-25T00:00:00Z",
    "startTime": "2024-12-25T15:00:00Z",
    "endTime": "2024-12-25T16:00:00Z"  // Calculated automatically
  },
  "duration": "1 hour",
  "endTime": "2024-12-25T16:00:00Z"
}
```

#### Availability Check (`GET /api/schedule/availability`)
**Before:**
```
GET /api/schedule/availability?locationId=loc-1&date=2024-12-25&startTime=15:00&endTime=16:00
```

**After:**
```
GET /api/schedule/availability?locationId=loc-1&date=2024-12-25&startTime=15:00
```

### 4. Frontend Changes

#### Schedule Page (`src/pages/Schedule.jsx`)
- **Removed**: End time input field
- **Kept**: Start time input field only
- **Added**: Note showing "Duration: 1 hour (automatically calculated)"
- **Updated**: Description to clarify booking duration

### 5. Collision Detection

The 15-minute gap rule still applies:
- If User A books **3:00 PM** (ends at **4:00 PM**)
- User B cannot book **3:01 PM - 4:15 PM** ❌
- User B can book **4:15 PM** (ends at **5:15 PM**) ✅

The system calculates:
- End time = Start time + 1 hour
- Next available = Previous end time + 15 minutes

### 6. Utility Functions

New/Updated functions in `backend/src/utils/schedule.utils.ts`:

```typescript
// Calculate end time from start time
calculateEndTime(startTime: Date): Date

// Check availability (now only needs startTime)
checkTimeSlotAvailability(
  existingSchedules: Array<{ startTime: Date | null; endTime?: Date | null }>,
  newStartTime: Date
): { available: boolean; conflict?: { startTime: Date; endTime: Date } }

// Get booking duration
getBookingDuration(): number // Returns 60 (minutes)
```

### 7. Admin View

The admin master table (`/api/admin/bookings`) still displays:
- `eventStartTime` - The start time
- `eventEndTime` - Calculated end time (startTime + 1 hour)
- `eventTimeSlot` - "03:00 PM - 04:00 PM" (formatted)

If `endTime` is not stored in the database, it's calculated on-the-fly for display.

## Migration Notes

1. **Database Migration**: Run `npx prisma db push --accept-data-loss` to update the unique constraint
2. **Existing Data**: Existing schedules with `endTime` will continue to work
3. **New Bookings**: Only require `startTime`; `endTime` is calculated automatically

## Testing

### Test Start Time Only Booking:

```bash
# Create schedule with only start time
curl -X POST "http://localhost:5000/api/schedule" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "locationId": "loc-1",
    "date": "2024-12-25T00:00:00Z",
    "startTime": "2024-12-25T15:00:00Z"
  }'

# Response will include calculated endTime
# {
#   "schedule": {
#     "startTime": "2024-12-25T15:00:00Z",
#     "endTime": "2024-12-25T16:00:00Z"  // Auto-calculated
#   },
#   "duration": "1 hour"
# }
```

### Test Collision Detection:

```bash
# Book 3:00 PM (ends at 4:00 PM)
curl -X POST "http://localhost:5000/api/schedule" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "locationId": "loc-1",
    "date": "2024-12-25T00:00:00Z",
    "startTime": "2024-12-25T15:00:00Z"
  }'

# Try to book 3:30 PM (should fail - conflicts with 3:00-4:00 PM + 15-min gap)
curl -X POST "http://localhost:5000/api/schedule" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "locationId": "loc-1",
    "date": "2024-12-25T00:00:00Z",
    "startTime": "2024-12-25T15:30:00Z"
  }'
# Expected: 409 Conflict - Next available: 4:15 PM
```

## Benefits

1. **Simpler UX**: Users only need to select start time
2. **Consistent Duration**: All bookings are exactly 1 hour
3. **Easier Scheduling**: No need to calculate or validate end time
4. **Clearer Rules**: Fixed duration makes collision detection more predictable

## Future Enhancements

- Make booking duration configurable per plan
- Allow different durations for different locations
- Add duration selector in the UI (if needed)


# Time Slot Booking & 15-Minute Gap Guide

## Overview

The system now requires both **date and time** for bookings and enforces a **15-minute gap** between bookings to prevent conflicts.

## How It Works

### 1. Time Slot Requirements

- **Start Time** and **End Time** are **required** for all bookings
- Times are stored in the database along with the date
- Format: ISO 8601 datetime strings

### 2. 15-Minute Gap Rule

**Example:**
- User A books: **3:00 PM - 3:30 PM**
- User B cannot book: **3:01 PM - 3:15 PM** ❌
- User B cannot book: **3:15 PM - 3:45 PM** ❌ (overlaps with gap)
- User B can book: **3:45 PM - 4:15 PM** ✅ (15 minutes after User A's end time)

**Calculation:**
- Gap = 15 minutes
- Next available time = Previous booking end time + 15 minutes

### 3. Collision Detection

The system checks for collisions at multiple levels:

1. **Schedule Creation** - Checks before creating schedule
2. **Booking Creation** - Double-checks before creating booking
3. **Database Constraint** - Unique constraint on `[locationId, date, startTime, endTime]`

### 4. Error Responses

When a collision is detected, the API returns:

```json
{
  "error": "Time slot conflicts with existing booking. 15-minute gap required.",
  "conflict": {
    "existingStart": "2024-12-25T15:00:00.000Z",
    "existingEnd": "2024-12-25T15:30:00.000Z",
    "existingStartFormatted": "03:00 PM",
    "existingEndFormatted": "03:30 PM",
    "requestedStart": "2024-12-25T15:01:00.000Z",
    "requestedEnd": "2024-12-25T15:15:00.000Z",
    "nextAvailableTime": "2024-12-25T15:45:00.000Z",
    "formattedNextAvailable": "03:45 PM"
  },
  "message": "This time slot (03:01 PM - 03:15 PM) conflicts with an existing booking (03:00 PM - 03:30 PM). Next available time: 03:45 PM"
}
```

## Admin Master Table

The admin endpoint `/api/admin/bookings` includes comprehensive time information:

### Time Fields in Response:

- `eventDate` - ISO date string
- `eventDateFormatted` - "Wednesday, December 25, 2024"
- `eventStartTime` - ISO datetime string
- `eventEndTime` - ISO datetime string
- `eventStartTimeFormatted` - "03:00 PM"
- `eventEndTimeFormatted` - "04:00 PM"
- `eventTimeSlot` - "03:00 PM - 04:00 PM"
- `eventDateTime` - "Wednesday, December 25, 2024 at 03:00 PM - 04:00 PM"

### Example Admin Response:

```json
{
  "bookings": [
    {
      "id": "booking-123",
      "userName": "John Doe",
      "userEmail": "john@example.com",
      "locationName": "Times Square Billboard",
      "eventDate": "2024-12-25T00:00:00.000Z",
      "eventDateFormatted": "Wednesday, December 25, 2024",
      "eventStartTime": "2024-12-25T15:00:00.000Z",
      "eventEndTime": "2024-12-25T16:00:00.000Z",
      "eventStartTimeFormatted": "03:00 PM",
      "eventEndTimeFormatted": "04:00 PM",
      "eventTimeSlot": "03:00 PM - 04:00 PM",
      "eventDateTime": "Wednesday, December 25, 2024 at 03:00 PM - 04:00 PM",
      "paymentStatus": "SUCCEEDED",
      "paymentConfirmed": true
    }
  ]
}
```

## Frontend Flow

1. **User selects date** from calendar
2. **User selects start time** (time input)
3. **User selects end time** (time input, must be after start time)
4. **System validates** time slot availability
5. **If conflict detected**, shows next available time
6. **On confirmation**, stores date + times in database

## Database Storage

Times are stored in the `Schedule` table:
- `date` - Date of the event
- `startTime` - Start datetime (required)
- `endTime` - End datetime (required)

When booking is confirmed (payment approved), the schedule times are preserved and linked to the booking.

## Testing

### Test Collision Detection:

```bash
# Book 3:00 PM - 3:30 PM
curl -X POST "http://localhost:5000/api/schedule" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "locationId": "loc-1",
    "date": "2024-12-25T00:00:00Z",
    "startTime": "2024-12-25T15:00:00Z",
    "endTime": "2024-12-25T15:30:00Z"
  }'

# Try to book 3:15 PM - 3:45 PM (should fail - violates 15-min gap)
curl -X POST "http://localhost:5000/api/schedule" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "locationId": "loc-1",
    "date": "2024-12-25T00:00:00Z",
    "startTime": "2024-12-25T15:15:00Z",
    "endTime": "2024-12-25T15:45:00Z"
  }'
# Expected: 409 Conflict with next available time (3:45 PM)
```

## Notes

- All times are stored in UTC and converted to local time for display
- The 15-minute gap is enforced at both schedule and booking creation
- Admin can see all time information in the master table
- Times are preserved when booking status changes (DRAFT → PAYMENT_APPROVED → ACTIVE)


# Admin Guide - Master Booking Table

## Overview

The admin master table provides a comprehensive view of all bookings in the system, including user information, location details, event dates, and payment status.

## Access

Admin endpoints require:
1. Valid JWT authentication token
2. User role set to `ADMIN`

## Endpoints

### 1. Get All Bookings (Master Table)

**Endpoint:** `GET /api/admin/bookings`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `status` - Filter by booking status (DRAFT, PENDING_PAYMENT, PAYMENT_APPROVED, ACTIVE, COMPLETED, CANCELLED)
- `locationId` - Filter by location ID
- `startDate` - Filter bookings from this date (ISO format)
- `endDate` - Filter bookings until this date (ISO format)

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/admin/bookings?status=ACTIVE" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Response:**
```json
{
  "bookings": [
    {
      "id": "booking-id",
      "userName": "John Doe",
      "userEmail": "john@example.com",
      "userPhone": "+1234567890",
      "locationName": "Times Square Billboard",
      "locationCity": "New York",
      "locationAddress": "Times Square, New York, NY 10036",
      "eventDate": "2024-12-25T00:00:00.000Z",
      "eventDateFormatted": "Wednesday, December 25, 2024",
      "eventStartTime": "2024-12-25T15:00:00.000Z",
      "eventEndTime": "2024-12-25T16:00:00.000Z",
      "eventStartTimeFormatted": "03:00 PM",
      "eventEndTimeFormatted": "04:00 PM",
      "eventTimeSlot": "03:00 PM - 04:00 PM",
      "eventDateTime": "Wednesday, December 25, 2024 at 03:00 PM - 04:00 PM",
      "mediaFilename": "birthday-video.mp4",
      "mediaType": "VIDEO",
      "planName": "Premium",
      "planPrice": 249.99,
      "bookingStatus": "PAYMENT_APPROVED",
      "paymentStatus": "SUCCEEDED",
      "paymentAmount": 249.99,
      "paymentConfirmed": true,
      "paymentRejected": false,
      "paymentFailureReason": null,
      "stripePaymentId": "pi_xxx",
      "paidAt": "2024-12-09T10:30:00.000Z",
      "createdAt": "2024-12-09T10:00:00.000Z",
      "updatedAt": "2024-12-09T10:30:00.000Z"
    }
  ],
  "total": 1,
  "summary": {
    "total": 1,
    "pendingPayment": 0,
    "paymentApproved": 1,
    "paymentRejected": 0,
    "active": 1,
    "completed": 0
  }
}
```

### 2. Get Booking Statistics

**Endpoint:** `GET /api/admin/stats`

**Response:**
```json
{
  "totalBookings": 150,
  "pendingPayments": 25,
  "approvedPayments": 100,
  "activeBookings": 75,
  "totalRevenue": 24999.50
}
```

## Collision Detection

### How It Works

1. **Schedule Level:**
   - Unique constraint on `[locationId, date, startTime, endTime]`
   - Prevents double booking at database level
   - Returns 409 Conflict if collision detected

2. **Booking Level:**
   - Checks for existing bookings on same date and location
   - Verifies schedule availability
   - Returns detailed conflict information

### Error Response (Collision)

```json
{
  "error": "Date and location are already booked",
  "conflict": {
    "bookingId": "existing-booking-id",
    "bookedBy": "John Doe",
    "date": "2024-12-25T00:00:00.000Z"
  }
}
```

## Creating Admin User

To create an admin user, update the user role in the database:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

Or use Prisma:

```typescript
await prisma.user.update({
  where: { email: 'admin@example.com' },
  data: { role: 'ADMIN' },
});
```

## WhatsApp Fallback

Users can contact support via WhatsApp at any step of the booking process:
- Location selection
- Date scheduling
- Media upload
- Plan selection
- Payment/Checkout

The WhatsApp link includes booking details for context.

## Notes

- All dates are in ISO 8601 format
- Payment amounts are in USD
- Booking statuses follow the BookingStatus enum
- Payment statuses follow the PaymentStatus enum


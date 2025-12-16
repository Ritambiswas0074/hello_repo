# FeatureMe Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh-token"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

### Locations

#### Get All Locations
```http
GET /api/locations?city=New York&isActive=true
```

#### Get Location by ID
```http
GET /api/locations/:id
```

### Schedule

#### Check Availability
```http
GET /api/schedule/availability?locationId=loc-1&date=2024-12-25
```

#### Create Schedule
```http
POST /api/schedule
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "locationId": "loc-1",
  "date": "2024-12-25T00:00:00Z",
  "startTime": "2024-12-25T09:00:00Z",
  "endTime": "2024-12-25T17:00:00Z"
}
```

#### Get User Schedules
```http
GET /api/schedule/user
Authorization: Bearer <access_token>
```

### Upload

#### Upload Media
```http
POST /api/upload
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

file: <file>
```

#### Get User Media
```http
GET /api/upload/user?type=image
Authorization: Bearer <access_token>
```

#### Delete Media
```http
DELETE /api/upload/:id
Authorization: Bearer <access_token>
```

### Templates

#### Get All Templates
```http
GET /api/templates?isActive=true
```

#### Get Template by ID
```http
GET /api/templates/:id
```

### Plans

#### Get All Plans
```http
GET /api/plans?isActive=true
```

#### Get Plan by ID
```http
GET /api/plans/:id
```

### Bookings

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "locationId": "loc-1",
  "scheduleId": "sched-1",
  "mediaId": "media-1",
  "templateId": "tpl-1",
  "planId": "plan-1",
  "notes": "Optional notes"
}
```

#### Get User Bookings
```http
GET /api/bookings/user?status=PENDING_PAYMENT
Authorization: Bearer <access_token>
```

#### Get Booking by ID
```http
GET /api/bookings/:id
Authorization: Bearer <access_token>
```

#### Update Booking Status
```http
PATCH /api/bookings/:id/status
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "ACTIVE"
}
```

Valid statuses: `DRAFT`, `PENDING_PAYMENT`, `PAYMENT_APPROVED`, `ACTIVE`, `COMPLETED`, `CANCELLED`

### Payments

#### Create Payment Intent
```http
POST /api/payments/create-intent
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "bookingId": "booking-id"
}
```

Response:
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentId": "payment-id"
}
```

#### Get Payment Status
```http
GET /api/payments/:id
Authorization: Bearer <access_token>
```

#### Webhook (Stripe)
```http
POST /api/payments/webhook
Content-Type: application/json
Stripe-Signature: <signature>

<stripe event>
```

### WhatsApp

#### Get WhatsApp Contact Link
```http
GET /api/whatsapp/contact?message=Hello
```

Response:
```json
{
  "whatsappLink": "https://wa.me/1234567890?text=Hello",
  "phoneNumber": "+1234567890"
}
```

### User Dashboard

#### Get Dashboard Data
```http
GET /api/user/dashboard
Authorization: Bearer <access_token>
```

Response includes:
- Latest bookings
- Latest media uploads
- Latest schedules
- Statistics (total bookings, media, active bookings, pending payments)

### Admin Endpoints

#### Get All User Activity (Comprehensive)
```http
GET /api/user-activity
```

**Description:** Returns comprehensive user activity data including all users with their bookings, uploaded media (images and videos), schedules, payment information, and location selections.

**Response:**
```json
{
  "success": true,
  "totalUsers": 10,
  "summary": {
    "totalUsers": 10,
    "totalBookings": 25,
    "totalMediaUploads": 50,
    "totalImages": 35,
    "totalVideos": 15,
    "totalSuccessfulPayments": 20,
    "totalRejectedPayments": 5,
    "totalAmountPaid": 5000.00
  },
  "users": [
    {
      "userId": "user-id",
      "userName": "John Doe",
      "userFirstName": "John",
      "userLastName": "Doe",
      "userEmail": "john@example.com",
      "userPhone": "+1234567890",
      "userRole": "USER",
      "userCreatedAt": "2024-01-01T00:00:00Z",
      "userUpdatedAt": "2024-01-01T00:00:00Z",
      "totalBookings": 3,
      "bookings": [
        {
          "bookingId": "booking-id",
          "bookingStatus": "ACTIVE",
          "bookingCreatedAt": "2024-01-15T00:00:00Z",
          "bookingUpdatedAt": "2024-01-15T00:00:00Z",
          "bookingNotes": "Optional notes",
          "location": {
            "id": "location-id",
            "name": "Times Square",
            "city": "New York",
            "address": "123 Main St",
            "latitude": 40.7580,
            "longitude": -73.9855
          },
          "schedule": {
            "id": "schedule-id",
            "date": "2024-12-25T00:00:00Z",
            "dateFormatted": "Wednesday, December 25, 2024",
            "startTime": "2024-12-25T09:00:00Z",
            "endTime": "2024-12-25T10:00:00Z",
            "startTimeFormatted": "09:00 AM",
            "endTimeFormatted": "10:00 AM",
            "timeSlot": "09:00 AM - 10:00 AM",
            "eventDateTime": "Wednesday, December 25, 2024 at 09:00 AM - 10:00 AM"
          },
          "media": {
            "id": "media-id",
            "filename": "image.jpg",
            "type": "IMAGE",
            "url": "https://cloudinary.com/image.jpg",
            "thumbnailUrl": "https://cloudinary.com/thumb.jpg",
            "size": 1024000,
            "width": 1920,
            "height": 1080,
            "duration": null,
            "description": "Media description",
            "uploadedAt": "2024-01-10T00:00:00Z"
          },
          "template": {
            "id": "template-id",
            "name": "Template Name",
            "description": "Template description",
            "previewUrl": "https://example.com/preview.jpg"
          },
          "plan": {
            "id": "plan-id",
            "name": "Premium Plan",
            "price": 299.99,
            "duration": 30,
            "features": ["Feature 1", "Feature 2"]
          },
          "payment": {
            "id": "payment-id",
            "amount": 299.99,
            "currency": "usd",
            "status": "SUCCEEDED",
            "paymentSuccessful": true,
            "paymentRejected": false,
            "paymentPending": false,
            "failureReason": null,
            "stripePaymentId": "pi_xxx",
            "paidAt": "2024-01-15T00:00:00Z",
            "createdAt": "2024-01-15T00:00:00Z"
          }
        }
      ],
      "totalMediaUploads": 10,
      "totalImages": 7,
      "totalVideos": 3,
      "uploadedImages": [
        {
          "id": "media-id",
          "filename": "image.jpg",
          "type": "IMAGE",
          "url": "https://cloudinary.com/image.jpg",
          "thumbnailUrl": "https://cloudinary.com/thumb.jpg",
          "size": 1024000,
          "width": 1920,
          "height": 1080,
          "description": "Image description",
          "template": {
            "id": "template-id",
            "name": "Template Name",
            "description": "Template description"
          },
          "uploadedAt": "2024-01-10T00:00:00Z"
        }
      ],
      "uploadedVideos": [
        {
          "id": "media-id",
          "filename": "video.mp4",
          "type": "VIDEO",
          "url": "https://cloudinary.com/video.mp4",
          "thumbnailUrl": "https://cloudinary.com/thumb.jpg",
          "size": 52428800,
          "width": 1920,
          "height": 1080,
          "duration": 120,
          "description": "Video description",
          "template": {
            "id": "template-id",
            "name": "Template Name",
            "description": "Template description"
          },
          "uploadedAt": "2024-01-10T00:00:00Z"
        }
      ],
      "totalSchedules": 5,
      "schedules": [
        {
          "id": "schedule-id",
          "date": "2024-12-25T00:00:00Z",
          "startTime": "2024-12-25T09:00:00Z",
          "endTime": "2024-12-25T10:00:00Z",
          "isAvailable": false,
          "location": {
            "id": "location-id",
            "name": "Times Square",
            "city": "New York"
          },
          "createdAt": "2024-01-10T00:00:00Z"
        }
      ],
      "paymentSummary": {
        "totalPayments": 3,
        "successfulPayments": 2,
        "rejectedPayments": 1,
        "pendingPayments": 0,
        "totalAmountPaid": 599.98
      }
    }
  ]
}
```

**Note:** This endpoint does not require authentication and is publicly accessible.

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message"
}
```

Common status codes:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Environment Variables

See `.env.example` for all required environment variables.

## Booking Status Flow

1. `DRAFT` - Booking created but not submitted
2. `PENDING_PAYMENT` - Payment intent created
3. `PAYMENT_APPROVED` - Payment successful
4. `ACTIVE` - Booking is live on billboard
5. `COMPLETED` - Booking period ended
6. `CANCELLED` - Booking cancelled


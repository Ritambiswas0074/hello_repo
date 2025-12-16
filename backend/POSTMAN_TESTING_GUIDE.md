# Postman Testing Guide for FeatureMe Backend API

## Prerequisites

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```
   Server should start on `http://localhost:5000`

2. **Database Setup:**
   - Make sure your database is accessible
   - Run migrations: `npm run prisma:migrate`
   - (Optional) Seed data: `npm run prisma:seed`

## Base URL
```
http://localhost:5000/api
```

## Testing Flow

### Step 1: Health Check
**GET** `http://localhost:5000/health`
- Should return: `{ "status": "ok", "timestamp": "..." }`

### Step 2: Register a User
**POST** `http://localhost:5000/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "test@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Expected Response:**
```json
{
  "user": {
    "id": "...",
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**Save the `accessToken` for subsequent requests!**

### Step 3: Login (Alternative)
**POST** `http://localhost:5000/api/auth/login`

**Body (JSON):**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

### Step 4: Get Current User
**GET** `http://localhost:5000/api/auth/me`

**Headers:**
```
Authorization: Bearer <accessToken>
```

### Step 5: Get Locations
**GET** `http://localhost:5000/api/locations`

**Query Parameters (optional):**
- `city`: Filter by city
- `isActive`: `true` or `false`

**Example:** `http://localhost:5000/api/locations?isActive=true`

### Step 6: Get Templates
**GET** `http://localhost:5000/api/templates`

**Query Parameters (optional):**
- `isActive`: `true` or `false`

### Step 7: Get Plans
**GET** `http://localhost:5000/api/plans`

**Query Parameters (optional):**
- `isActive`: `true` or `false`

### Step 8: Check Schedule Availability
**GET** `http://localhost:5000/api/schedule/availability`

**Query Parameters:**
- `locationId`: Location ID (from Step 5)
- `date`: Date in ISO format (e.g., `2024-12-25T00:00:00Z`)

**Example:** `http://localhost:5000/api/schedule/availability?locationId=loc-1&date=2024-12-25T00:00:00Z`

### Step 9: Create Schedule
**POST** `http://localhost:5000/api/schedule`

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "locationId": "loc-1",
  "date": "2024-12-25T00:00:00Z",
  "startTime": "2024-12-25T09:00:00Z",
  "endTime": "2024-12-25T17:00:00Z"
}
```

### Step 10: Upload Media
**POST** `http://localhost:5000/api/upload`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Body (form-data):**
- Key: `file`
- Type: File
- Select an image or video file

**Expected Response:**
```json
{
  "media": {
    "id": "...",
    "url": "https://res.cloudinary.com/...",
    "type": "IMAGE" or "VIDEO",
    "cloudinaryId": "..."
  }
}
```

**Save the `media.id` for booking!**

### Step 11: Get User Media Gallery
**GET** `http://localhost:5000/api/upload/user`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters (optional):**
- `type`: `image` or `video`

### Step 12: Create Booking
**POST** `http://localhost:5000/api/bookings`

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "locationId": "loc-1",
  "scheduleId": "<schedule-id-from-step-9>",
  "mediaId": "<media-id-from-step-10>",
  "templateId": "tpl-1",
  "planId": "plan-1",
  "notes": "Optional notes"
}
```

**Expected Response:**
```json
{
  "booking": {
    "id": "...",
    "status": "DRAFT",
    "location": {...},
    "schedule": {...},
    "media": {...},
    "template": {...},
    "plan": {...}
  }
}
```

**Save the `booking.id` for payment!**

### Step 13: Create Payment Intent
**POST** `http://localhost:5000/api/payments/create-intent`

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "bookingId": "<booking-id-from-step-12>"
}
```

**Expected Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentId": "..."
}
```

**Note:** This requires Stripe to be configured. For testing without Stripe, you can skip this step.

### Step 14: Get User Bookings
**GET** `http://localhost:5000/api/bookings/user`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters (optional):**
- `status`: `DRAFT`, `PENDING_PAYMENT`, `PAYMENT_APPROVED`, `ACTIVE`, `COMPLETED`, `CANCELLED`

### Step 15: Get User Dashboard
**GET** `http://localhost:5000/api/user/dashboard`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Expected Response:**
```json
{
  "bookings": [...],
  "media": [...],
  "schedules": [...],
  "stats": {
    "totalBookings": 5,
    "totalMedia": 10,
    "activeBookings": 2,
    "pendingPayments": 1
  }
}
```

### Step 16: Get WhatsApp Contact Link
**GET** `http://localhost:5000/api/whatsapp/contact`

**Query Parameters (optional):**
- `message`: Custom message

**Example:** `http://localhost:5000/api/whatsapp/contact?message=Hello`

### Step 17: Update Booking Status (Admin/Owner)
**PATCH** `http://localhost:5000/api/bookings/:id/status`

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "status": "ACTIVE"
}
```

### Step 18: Delete Media
**DELETE** `http://localhost:5000/api/upload/:id`

**Headers:**
```
Authorization: Bearer <accessToken>
```

## Postman Environment Variables

Create a Postman environment with these variables:

1. `base_url`: `http://localhost:5000`
2. `access_token`: (Set after login/register)
3. `user_id`: (Set after login/register)
4. `booking_id`: (Set after creating booking)
5. `media_id`: (Set after uploading media)
6. `schedule_id`: (Set after creating schedule)
7. `location_id`: `loc-1` (from seed data)
8. `template_id`: `tpl-1` (from seed data)
9. `plan_id`: `plan-1` (from seed data)

## Common Issues

1. **401 Unauthorized**: Make sure you're including the `Authorization: Bearer <token>` header
2. **404 Not Found**: Check that the server is running on port 5000
3. **500 Internal Server Error**: Check server logs for details
4. **Database Connection Error**: Ensure database is accessible and migrations are run

## Testing Tips

1. Use Postman's **Tests** tab to automatically save tokens:
   ```javascript
   if (pm.response.code === 200) {
       var jsonData = pm.response.json();
       pm.environment.set("access_token", jsonData.accessToken);
   }
   ```

2. Create a **Collection** with all requests organized by folder:
   - Authentication
   - Locations
   - Schedule
   - Upload
   - Templates
   - Plans
   - Bookings
   - Payments
   - Dashboard

3. Use **Pre-request Scripts** to automatically add the Authorization header:
   ```javascript
   pm.request.headers.add({
       key: 'Authorization',
       value: 'Bearer ' + pm.environment.get('access_token')
   });
   ```

## Quick Test Sequence

1. Register → Get Token
2. Get Locations → Save location ID
3. Get Templates → Save template ID
4. Get Plans → Save plan ID
5. Upload Media → Save media ID
6. Check Availability → Create Schedule → Save schedule ID
7. Create Booking → Save booking ID
8. Get Dashboard → Verify all data

Happy Testing! 🚀


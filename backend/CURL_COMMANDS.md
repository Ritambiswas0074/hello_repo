# cURL Commands for FeatureMe API Testing

## 1. Health Check

```bash
curl -X GET "http://localhost:5000/health"
```

## 2. Authentication

### Register User
```bash
curl -X POST "http://localhost:5000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  }'
```

### Login
```bash
curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Save the accessToken from response!**

### Get Current User
```bash
curl -X GET "http://localhost:5000/api/auth/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Refresh Token
```bash
curl -X POST "http://localhost:5000/api/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## 3. Locations

### Get All Locations
```bash
curl -X GET "http://localhost:5000/api/locations"
```

### Get All Active Locations
```bash
curl -X GET "http://localhost:5000/api/locations?isActive=true"
```

### Get Locations by City
```bash
curl -X GET "http://localhost:5000/api/locations?city=New York"
```

### Get Location by ID
```bash
curl -X GET "http://localhost:5000/api/locations/loc-1"
```

## 4. Templates

### Get All Templates
```bash
curl -X GET "http://localhost:5000/api/templates"
```

### Get All Active Templates
```bash
curl -X GET "http://localhost:5000/api/templates?isActive=true"
```

### Get Template by ID
```bash
curl -X GET "http://localhost:5000/api/templates/tpl-1"
```

## 5. Plans

### Get All Plans
```bash
curl -X GET "http://localhost:5000/api/plans"
```

### Get All Active Plans
```bash
curl -X GET "http://localhost:5000/api/plans?isActive=true"
```

### Get Plan by ID
```bash
curl -X GET "http://localhost:5000/api/plans/plan-1"
```

## 6. Schedule

### Check Availability
```bash
curl -X GET "http://localhost:5000/api/schedule/availability?locationId=loc-1&date=2024-12-25T00:00:00Z"
```

### Create Schedule
```bash
curl -X POST "http://localhost:5000/api/schedule" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "locationId": "loc-1",
    "date": "2024-12-25T00:00:00Z",
    "startTime": "2024-12-25T09:00:00Z",
    "endTime": "2024-12-25T17:00:00Z"
  }'
```

### Get User Schedules
```bash
curl -X GET "http://localhost:5000/api/schedule/user" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 7. Upload

### Upload Media (Image/Video)
```bash
curl -X POST "http://localhost:5000/api/upload" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@/path/to/your/image.jpg"
```

**For video:**
```bash
curl -X POST "http://localhost:5000/api/upload" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@/path/to/your/video.mp4"
```

### Get User Media Gallery
```bash
curl -X GET "http://localhost:5000/api/upload/user" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get User Images Only
```bash
curl -X GET "http://localhost:5000/api/upload/user?type=image" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get User Videos Only
```bash
curl -X GET "http://localhost:5000/api/upload/user?type=video" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Delete Media
```bash
curl -X DELETE "http://localhost:5000/api/upload/MEDIA_ID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 8. Bookings

### Create Booking
```bash
curl -X POST "http://localhost:5000/api/bookings" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "locationId": "loc-1",
    "scheduleId": "SCHEDULE_ID",
    "mediaId": "MEDIA_ID",
    "templateId": "tpl-1",
    "planId": "plan-1",
    "notes": "Optional notes for this booking"
  }'
```

### Get User Bookings
```bash
curl -X GET "http://localhost:5000/api/bookings/user" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get User Bookings by Status
```bash
curl -X GET "http://localhost:5000/api/bookings/user?status=PENDING_PAYMENT" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Available statuses:** `DRAFT`, `PENDING_PAYMENT`, `PAYMENT_APPROVED`, `ACTIVE`, `COMPLETED`, `CANCELLED`

### Get Booking by ID
```bash
curl -X GET "http://localhost:5000/api/bookings/BOOKING_ID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update Booking Status
```bash
curl -X PATCH "http://localhost:5000/api/bookings/BOOKING_ID/status" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "ACTIVE"
  }'
```

## 9. Payments

### Create Payment Intent
```bash
curl -X POST "http://localhost:5000/api/payments/create-intent" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "BOOKING_ID"
  }'
```

### Get Payment Status
```bash
curl -X GET "http://localhost:5000/api/payments/PAYMENT_ID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Stripe Webhook (for testing)
```bash
curl -X POST "http://localhost:5000/api/payments/webhook" \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: YOUR_WEBHOOK_SIGNATURE" \
  -d '{
    "type": "payment_intent.succeeded",
    "data": {
      "object": {
        "id": "pi_xxx",
        "metadata": {
          "bookingId": "BOOKING_ID"
        }
      }
    }
  }'
```

## 10. Dashboard

### Get User Dashboard
```bash
curl -X GET "http://localhost:5000/api/user/dashboard" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 11. WhatsApp

### Get WhatsApp Contact Link
```bash
curl -X GET "http://localhost:5000/api/whatsapp/contact"
```

### Get WhatsApp Contact with Custom Message
```bash
curl -X GET "http://localhost:5000/api/whatsapp/contact?message=Hello%20I%20need%20help"
```

## Complete Testing Flow Example

```bash
# 1. Register
curl -X POST "http://localhost:5000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"John","lastName":"Doe"}'

# 2. Login (if user exists)
curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 3. Get locations
curl -X GET "http://localhost:5000/api/locations"

# 4. Get templates
curl -X GET "http://localhost:5000/api/templates"

# 5. Get plans
curl -X GET "http://localhost:5000/api/plans"

# 6. Check availability
curl -X GET "http://localhost:5000/api/schedule/availability?locationId=loc-1&date=2024-12-25T00:00:00Z"

# 7. Create schedule (replace YOUR_ACCESS_TOKEN)
curl -X POST "http://localhost:5000/api/schedule" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"locationId":"loc-1","date":"2024-12-25T00:00:00Z"}'

# 8. Upload media (replace YOUR_ACCESS_TOKEN and file path)
curl -X POST "http://localhost:5000/api/upload" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@./test-image.jpg"

# 9. Get user media
curl -X GET "http://localhost:5000/api/upload/user" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 10. Create booking (replace IDs and YOUR_ACCESS_TOKEN)
curl -X POST "http://localhost:5000/api/bookings" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "locationId": "loc-1",
    "scheduleId": "SCHEDULE_ID",
    "mediaId": "MEDIA_ID",
    "templateId": "tpl-1",
    "planId": "plan-1"
  }'

# 11. Get user bookings
curl -X GET "http://localhost:5000/api/bookings/user" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 12. Get dashboard
curl -X GET "http://localhost:5000/api/user/dashboard" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 13. Create payment intent (replace BOOKING_ID and YOUR_ACCESS_TOKEN)
curl -X POST "http://localhost:5000/api/payments/create-intent" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"bookingId":"BOOKING_ID"}'

# 14. Get WhatsApp contact
curl -X GET "http://localhost:5000/api/whatsapp/contact"
```

## Quick Reference: Replace These Values

- `YOUR_ACCESS_TOKEN` - Get from register/login response
- `YOUR_REFRESH_TOKEN` - Get from register/login response
- `MEDIA_ID` - Get from upload response
- `SCHEDULE_ID` - Get from create schedule response
- `BOOKING_ID` - Get from create booking response
- `PAYMENT_ID` - Get from create payment intent response
- `loc-1`, `tpl-1`, `plan-1` - From seed data (if database is seeded)

## Testing Tips

1. **Pretty print JSON responses:**
   ```bash
   curl ... | jq .
   ```

2. **Save responses to file:**
   ```bash
   curl ... > response.json
   ```

3. **View response headers:**
   ```bash
   curl -i ...
   ```

4. **Verbose output (debugging):**
   ```bash
   curl -v ...
   ```

5. **Save token to variable (bash):**
   ```bash
   TOKEN=$(curl -s -X POST "http://localhost:5000/api/auth/login" \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}' | jq -r '.accessToken')
   
   curl -X GET "http://localhost:5000/api/auth/me" \
     -H "Authorization: Bearer $TOKEN"
   ```

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message here"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

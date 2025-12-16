# User Activity Endpoint Documentation

## Endpoint
```
GET /api/user-activity
```

## Authentication
**No authentication required** - This is a public endpoint.

## Description
This endpoint returns comprehensive user activity data for all users in the system. It includes:
- User information (name, email, phone number)
- All bookings with location, date, and time details
- Payment status (successful, rejected, pending)
- All uploaded images and videos
- Template information for each upload
- Schedule information
- Payment summaries

## Response Structure

### Summary
- `totalUsers`: Total number of users in the system
- `totalBookings`: Total number of bookings across all users
- `totalMediaUploads`: Total media files uploaded
- `totalImages`: Total image uploads
- `totalVideos`: Total video uploads
- `totalSuccessfulPayments`: Number of successful payments
- `totalRejectedPayments`: Number of rejected/failed payments
- `totalAmountPaid`: Total amount paid across all successful payments

### User Data
For each user, the response includes:

1. **User Information**
   - User ID, name, email, phone
   - User role and account creation dates

2. **Bookings**
   - All bookings with complete details:
     - Location (name, city, address, coordinates)
     - Schedule (date, start time, end time, formatted display)
     - Media (filename, type, URL, dimensions, duration)
     - Template (name, description, preview)
     - Plan (name, price, duration, features)
     - Payment (status, amount, success/rejection status, failure reason)

3. **Media Uploads**
   - **Images**: All uploaded images with template information
   - **Videos**: All uploaded videos with template information
   - Includes metadata: size, dimensions, duration (for videos), upload date

4. **Schedules**
   - All schedules created by the user
   - Location information for each schedule
   - Availability status

5. **Payment Summary**
   - Total payments, successful payments, rejected payments
   - Total amount paid

## Example Usage

### cURL
```bash
curl -X GET http://localhost:5000/api/user-activity
```

### JavaScript/Fetch
```javascript
const response = await fetch('http://localhost:5000/api/user-activity', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

## Error Responses

### 500 Internal Server Error
```json
{
  "error": "Error message"
}
```

## Use Cases

1. **Admin Dashboard**: Display comprehensive user activity overview
2. **Reporting**: Generate reports on user engagement, bookings, and payments
3. **Analytics**: Analyze user behavior, popular locations, payment success rates
4. **Support**: Quickly access all user information for customer support
5. **Audit**: Track all user activities for compliance and auditing purposes

## Notes

- This endpoint returns a large amount of data. Consider implementing pagination for production use if the user base grows significantly.
- All dates and times are returned in ISO 8601 format.
- Payment statuses: `SUCCEEDED` (successful), `FAILED` (rejected), `PENDING` or `PROCESSING` (pending)
- Media types: `IMAGE` or `VIDEO`
- The endpoint includes all media uploads, not just those associated with bookings.


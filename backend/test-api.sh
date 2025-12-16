#!/bin/bash

BASE_URL="http://localhost:5000"

echo "=== 1. Health Check ==="
curl -X GET "$BASE_URL/health"
echo -e "\n"

echo "=== 2. Register User ==="
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }')

echo "$REGISTER_RESPONSE"
ACCESS_TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
echo -e "\nAccess Token: $ACCESS_TOKEN\n"

if [ -z "$ACCESS_TOKEN" ]; then
  echo "Failed to get access token. Trying login..."
  LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com",
      "password": "password123"
    }')
  echo "$LOGIN_RESPONSE"
  ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
fi

if [ -z "$ACCESS_TOKEN" ]; then
  echo "ERROR: Could not get access token. Exiting."
  exit 1
fi

echo "=== 3. Get Current User ==="
curl -X GET "$BASE_URL/api/auth/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
echo -e "\n"

echo "=== 4. Get Locations ==="
curl -X GET "$BASE_URL/api/locations?isActive=true"
echo -e "\n"

echo "=== 5. Get Templates ==="
curl -X GET "$BASE_URL/api/templates?isActive=true"
echo -e "\n"

echo "=== 6. Get Plans ==="
curl -X GET "$BASE_URL/api/plans?isActive=true"
echo -e "\n"

echo "=== 7. Check Availability ==="
curl -X GET "$BASE_URL/api/schedule/availability?locationId=loc-1&date=2024-12-25T00:00:00Z"
echo -e "\n"

echo "=== 8. Create Schedule ==="
SCHEDULE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/schedule" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "locationId": "loc-1",
    "date": "2024-12-25T00:00:00Z"
  }')
echo "$SCHEDULE_RESPONSE"
echo -e "\n"

echo "=== 9. Get User Schedules ==="
curl -X GET "$BASE_URL/api/schedule/user" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
echo -e "\n"

echo "=== 10. Get User Media ==="
curl -X GET "$BASE_URL/api/upload/user" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
echo -e "\n"

echo "=== 11. Get Dashboard ==="
curl -X GET "$BASE_URL/api/user/dashboard" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
echo -e "\n"

echo "=== 12. Get WhatsApp Contact ==="
curl -X GET "$BASE_URL/api/whatsapp/contact"
echo -e "\n"

echo "=== Testing Complete ==="
echo "Access Token: $ACCESS_TOKEN"
echo "Save this token for manual testing!"


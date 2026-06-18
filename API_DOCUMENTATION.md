# FoodShare API Documentation

## Base URL
```
http://localhost:3000/api
```

---

## Authentication APIs

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "Ali Ahmed",
  "email": "ali@gmail.com",
  "phone": "03218636935",
  "address": "123 Main St, Karachi",
  "role": "donor",
  "password": "SecurePass123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Ali Ahmed",
    "email": "ali@gmail.com",
    "role": "donor"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Registration failed",
  "errors": {
    "email": "Email already exists"
  }
}
```

---

### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "ali@gmail.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Ali Ahmed",
    "email": "ali@gmail.com",
    "role": "donor"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

## Donation APIs

### GET /donations
Get all donations with filters and pagination.

**Query Parameters:**
- `userId` (optional) - Filter by donor ID
- `status` (optional) - Filter by status: `available`, `reserved`, `picked_up`
- `limit` (optional, default: 20) - Items per page
- `page` (optional, default: 1) - Page number

**Example:**
```
GET /donations?status=available&limit=10&page=1
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Fresh Vegetables",
      "description": "Organic vegetables",
      "quantity": 5,
      "unit": "kg",
      "status": "available",
      "donorId": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Ali Ahmed",
        "email": "ali@gmail.com"
      },
      "createdAt": "2024-05-12T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

---

### POST /donations
Create a new donation.

**Request Body:**
```json
{
  "donorId": "507f1f77bcf86cd799439011",
  "title": "Fresh Vegetables",
  "description": "Organic vegetables from my garden",
  "quantity": 5,
  "unit": "kg",
  "expiryDate": "2024-05-20T00:00:00Z",
  "pickupLocation": "123 Main St, Karachi"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Donation created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Fresh Vegetables",
    "quantity": 5,
    "status": "available",
    "donorId": "507f1f77bcf86cd799439011"
  }
}
```

---

### PUT /donations/:id
Update an existing donation.

**URL Parameters:**
- `id` - Donation ID

**Request Body:**
```json
{
  "title": "Fresh Organic Vegetables",
  "quantity": 3,
  "status": "available"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Donation updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Fresh Organic Vegetables",
    "quantity": 3
  }
}
```

---

### DELETE /donations/:id
Delete a donation.

**URL Parameters:**
- `id` - Donation ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Donation deleted successfully"
}
```

---

## Reservation APIs

### GET /reservations
Get all reservations with filters and pagination.

**Query Parameters:**
- `userId` (optional) - Filter by receiver ID
- `status` (optional) - Filter by status: `pending`, `confirmed`, `completed`
- `limit` (optional, default: 20) - Items per page
- `page` (optional, default: 1) - Page number

**Example:**
```
GET /reservations?status=pending&limit=10
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "donationId": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Fresh Vegetables",
        "quantity": 5
      },
      "receiverId": {
        "_id": "507f1f77bcf86cd799439014",
        "name": "Sara Khan"
      },
      "donorId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Ali Ahmed"
      },
      "status": "pending",
      "pickupDate": "2024-05-15T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 12,
    "page": 1,
    "limit": 10,
    "pages": 2
  }
}
```

---

### POST /reservations
Create a new reservation.

**Request Body:**
```json
{
  "donationId": "507f1f77bcf86cd799439011",
  "receiverId": "507f1f77bcf86cd799439014",
  "quantity": 2,
  "pickupDate": "2024-05-15T00:00:00Z"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Reservation created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "donationId": "507f1f77bcf86cd799439011",
    "receiverId": "507f1f77bcf86cd799439014",
    "status": "pending"
  }
}
```

---

## Admin APIs

### GET /users
Get all users with filters and pagination. (Admin only)

**Query Parameters:**
- `role` (optional) - Filter by role: `donor`, `receiver`, `moderator`, `admin`
- `isActive` (optional) - Filter by active status: `true`, `false`
- `search` (optional) - Search by name or email
- `limit` (optional, default: 50) - Items per page
- `page` (optional, default: 1) - Page number

**Example:**
```
GET /users?role=donor&search=ali&limit=20
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Ali Ahmed",
      "email": "ali@gmail.com",
      "role": "donor",
      "verified": true,
      "isActive": true,
      "totalDonations": 12,
      "rating": 4.8
    }
  ],
  "pagination": {
    "total": 245,
    "page": 1,
    "limit": 20,
    "pages": 13
  }
}
```

---

### PUT /users/verify
Verify a user account. (Admin only)

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User verified successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Ali Ahmed",
    "email": "ali@gmail.com",
    "verified": true
  }
}
```

---

### DELETE /users
Delete a user account. (Admin only)

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Error Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Response Format

All API responses follow this format:

```json
{
  "success": true/false,
  "message": "Description of response",
  "data": {}  // Optional
}
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ali Ahmed",
    "email": "ali@gmail.com",
    "password": "SecurePass123",
    "role": "donor"
  }'
```

### Get Donations
```bash
curl -X GET "http://localhost:3000/api/donations?status=available&limit=10"
```

### Create Donation
```bash
curl -X POST http://localhost:3000/api/donations \
  -H "Content-Type: application/json" \
  -d '{
    "donorId": "507f1f77bcf86cd799439011",
    "title": "Fresh Vegetables",
    "quantity": 5,
    "unit": "kg"
  }'
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Passwords are never returned in responses
- User IDs and all resource IDs are MongoDB ObjectIds
- Authentication tokens should be passed in the Authorization header for protected routes (to be implemented)
- Pagination starts from page 1

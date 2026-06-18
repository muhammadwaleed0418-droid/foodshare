/**
 * Quick Reference Guide for Food Share Database Design
 */

# Database Schema Quick Reference

## Collections Overview

```
┌─────────────────────────────────────────────────────────────────┐
│ USER (Users & Authentication)                                   │
├─────────────────────────────────────────────────────────────────┤
│ • name, email (unique), password (hashed)                        │
│ • role: donor | receiver | admin | moderator                    │
│ • contact: phone, address                                        │
│ • verification status, profile image, bio                        │
│ • metrics: rating, totalDonations, totalReservations             │
│ • timestamps: createdAt, updatedAt, lastLogin                   │
│ ✓ Indexes: email, verified, role, isActive, createdAt           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ DONATION (Food Listings)                                        │
├─────────────────────────────────────────────────────────────────┤
│ • title, description, foodType[], quantity, unit                │
│ • location: street, city, state, zipCode, coordinates           │
│ • availability: availableFrom, availableUntil                   │
│ • status: available | reserved | picked_up | expired...         │
│ • donorId (ref to User)                                          │
│ • metadata: images[], allergens[], expiryDate                   │
│ ✓ Indexes: donorId, status, foodType, availableUntil, createdAt │
│ ✓ Geospatial: coordinates (2dsphere)                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ RESERVATION (Booking Requests)                                  │
├─────────────────────────────────────────────────────────────────┤
│ • donationId (ref), receiverId (ref)                            │
│ • status: pending | confirmed | picked_up | cancelled...        │
│ • reservation time: reservedAt, pickupDate, pickupTime          │
│ • notes, cancelReason                                            │
│ • completion: completedAt, rating, feedback                     │
│ ✓ Indexes: donationId, receiverId, status, createdAt            │
│ ✓ Unique constraint: ONE active reservation per donation         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ MESSAGE (Direct Messaging)                                       │
├─────────────────────────────────────────────────────────────────┤
│ • senderId, receiverId (refs to User)                           │
│ • content (1-2000 chars), attachments[]                          │
│ • read status: isRead, readAt                                    │
│ • context: relatedDonationId, relatedReservationId              │
│ ✓ Indexes: senderId, receiverId, isRead, createdAt              │
│ ✓ Compound: sender+receiver (conversations)                      │
│ ✓ TTL: Auto-delete after 365 days                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ CONVERSATION (Message Threading)                                │
├─────────────────────────────────────────────────────────────────┤
│ • participants: [userId1, userId2] (exactly 2)                  │
│ • lastMessage, lastMessageAt                                     │
│ • unreadCount: { userId: count }                                │
│ ✓ Indexes: participants (unique), lastMessageAt                 │
│ ✓ Relationships: Has many Messages                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ AUDIT LOG (Security & Compliance)                               │
├─────────────────────────────────────────────────────────────────┤
│ • action: create | update | delete | login...                  │
│ • userId (ref), targetId, targetType                            │
│ • changes: { before, after }                                     │
│ • request info: ipAddress, userAgent                            │
│ • status: success | failure, errorMessage                       │
│ ✓ Indexes: userId, targetId, action, status, timestamp          │
│ ✓ TTL: Auto-delete after 365 days                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Common Queries

### User Queries
```javascript
// Find by email
User.findOne({ email: 'user@example.com' })

// Active users
User.find({ isActive: true }).limit(10)

// Verified users only
User.find({ verified: true })

// Get user with stats
User.findById(userId).select('name email rating totalDonations')
```

### Donation Queries
```javascript
// Available donations
Donation.find({ status: 'available' }).sort({ createdAt: -1 })

// Donations by type
Donation.find({ foodType: { $in: ['vegetables', 'fruits'] } })

// Donations by donor
Donation.find({ donorId: userId })

// Expiring soon (next 24 hours)
Donation.find({
  availableUntil: {
    $gte: new Date(),
    $lte: new Date(Date.now() + 24 * 60 * 60 * 1000)
  }
})

// Near location (requires geospatial index)
Donation.find({
  'pickupLocation.coordinates': {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      $maxDistance: 5000 // 5km
    }
  }
})
```

### Reservation Queries
```javascript
// User's pending reservations
Reservation.find({
  receiverId: userId,
  status: 'pending'
})

// Active reservations for donation
Reservation.findOne({
  donationId: donationId,
  status: { $in: ['pending', 'confirmed'] }
})

// Completed reservations
Reservation.find({
  receiverId: userId,
  status: 'completed'
})
```

### Message Queries
```javascript
// Unread messages for user
Message.find({
  receiverId: userId,
  isRead: false
})

// Conversation between two users
Message.find({
  $or: [
    { senderId: user1Id, receiverId: user2Id },
    { senderId: user2Id, receiverId: user1Id }
  ]
}).sort({ createdAt: -1 })

// Messages related to donation
Message.find({ relatedDonationId: donationId })
```

### Audit Queries
```javascript
// Recent actions by user
AuditLog.find({ userId: userId }).sort({ timestamp: -1 }).limit(20)

// All failures
AuditLog.find({ status: 'failure' })

// Changes to specific resource
AuditLog.find({ targetId: resourceId, targetType: 'donation' })

// Login attempts in last 24 hours
AuditLog.find({
  action: 'login',
  timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
})
```

---

## API Endpoint Patterns

```
GET    /api/donations              - List all donations (paginated)
GET    /api/donations/[id]         - Get single donation
POST   /api/donations              - Create donation
PUT    /api/donations/[id]         - Update donation
DELETE /api/donations/[id]         - Delete donation

GET    /api/reservations           - List user's reservations
GET    /api/reservations/[id]      - Get reservation details
POST   /api/reservations           - Create reservation
PUT    /api/reservations/[id]      - Update reservation
DELETE /api/reservations/[id]      - Cancel reservation

GET    /api/messages               - Get conversations
GET    /api/messages/[conversationId] - Get messages in conversation
POST   /api/messages               - Send message
PUT    /api/messages/[id]/read     - Mark as read

GET    /api/users/[id]             - Get user profile
PUT    /api/users/[id]             - Update profile
GET    /api/users/[id]/donations   - Get user's donations
GET    /api/users/[id]/reservations - Get user's reservations

GET    /api/audit-logs             - Get audit logs (admin only)
```

---

## Field Validation Rules

### User
- **name**: 2-100 characters
- **email**: Valid email format, unique
- **password**: Min 6 chars, 1 uppercase, 1 number (hashed)
- **phone**: Valid phone format (min 10 digits)
- **address**: Min 10 characters
- **rating**: 0-5 (average of reservation ratings)

### Donation
- **title**: 3-100 characters
- **description**: 10-1000 characters
- **quantity**: > 0
- **availableUntil**: Must be after availableFrom
- **images**: Max 5 files
- **status**: Can only transition certain ways
  - AVAILABLE → RESERVED → PICKED_UP → COMPLETED
  - AVAILABLE → EXPIRED
  - Any → CANCELLED

### Reservation
- **status**: Can only progress forward
  - PENDING → CONFIRMED → PICKED_UP → COMPLETED
  - Any → CANCELLED or EXPIRED
- **pickupDate**: Must be in future if provided
- **pickupTime**: Format HH:MM (24-hour)
- **rating**: 1-5 (only when completed)

### Message
- **content**: 1-2000 characters
- **attachments**: Max 5 files

---

## Performance Tips

### Indexing
```javascript
// Always index frequently queried fields
db.donations.createIndex({ status: 1 })
db.donations.createIndex({ donorId: 1 })
db.reservations.createIndex({ receiverId: 1, status: 1 })
db.messages.createIndex({ receiverId: 1, isRead: 1 })
```

### Query Optimization
```javascript
// ❌ Avoid
Donation.find({}).select('*')  // Get all fields

// ✅ Better
Donation.find({}).select('title quantity foodType').limit(20)

// ❌ Avoid
for (let donation of donations) {
  let donor = await User.findById(donation.donorId)
}

// ✅ Better
Donation.find({}).populate('donorId')
```

### Pagination
```javascript
const page = req.query.page || 1
const limit = req.query.limit || 10
const skip = (page - 1) * limit

const donations = await Donation.find({})
  .skip(skip)
  .limit(limit)
```

---

## Data Integrity Constraints

| Constraint | Collection | Behavior |
|-----------|-----------|----------|
| Unique email | User | Cannot have duplicate emails |
| Unique participants | Conversation | Only one conversation per pair |
| One active reservation | Donation | Max 1 pending/confirmed per donation |
| Foreign keys | All | Auto-populated via `.populate()` |
| Status validation | Donation, Reservation | Only valid statuses allowed |
| Date validation | Multiple | Dates must pass custom validators |

---

## Error Codes Reference

```
200 - OK (Success)
201 - Created (Resource created)
400 - Bad Request (Validation failed)
401 - Unauthorized (Not authenticated)
403 - Forbidden (No permission)
404 - Not Found (Resource not found)
409 - Conflict (E.g., duplicate reservation)
422 - Unprocessable Entity (Validation error)
500 - Internal Server Error
```

---

## Backup & Recovery

```bash
# Daily backup
mongodump --uri=$MONGODB_URI --out=./backups/daily-$(date +%Y%m%d)

# Restore
mongorestore --uri=$MONGODB_URI ./backups/daily-20240510

# Archive old data
db.messages.deleteMany({
  createdAt: { $lt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
})
```

---

## Environment Variables

```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/foodshare

# Authentication
JWT_SECRET=your_32_character_secret_key_here
JWT_EXPIRY=7d

# API
NEXT_PUBLIC_API_URL=http://localhost:3000

# File Storage (optional)
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_S3_BUCKET=foodshare-uploads

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

---

## Testing Checklist

- [ ] User registration & login
- [ ] Create donation (as donor)
- [ ] List available donations
- [ ] Geospatial query (nearby donations)
- [ ] Create reservation (as receiver)
- [ ] Update reservation status
- [ ] Message donor/receiver
- [ ] Mark messages as read
- [ ] View conversation history
- [ ] Audit log tracking
- [ ] Data validation errors
- [ ] Permission checks (403)
- [ ] Pagination
- [ ] Soft delete (cancellation)

---

**Created:** May 10, 2026  
**Version:** 1.0.0  
**Status:** Complete & Ready for Implementation

# Food Share Application - Database Design

## Overview
This document outlines the complete database schema design for the Food Share application, a platform that connects food donors with recipients in need.

---

## Database Models

### 1. **User Model**

**Purpose:** Stores user account information and profile data.

**Fields:**
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `_id` | ObjectId | Auto | Primary Key | MongoDB auto-generated ID |
| `name` | String | Yes | 2-100 chars | User's full name |
| `email` | String | Yes | Unique, Email format | User's email address |
| `password` | String | Yes | Min 6 chars | Hashed password (not returned) |
| `role` | Enum | Yes | donor, receiver, admin, moderator | User's role in the system |
| `phone` | String | Yes | Valid format | Contact phone number |
| `address` | String | Yes | Min 10 chars | Physical address |
| `verified` | Boolean | No | Default: false | Email verification status |
| `profileImage` | String | No | URL | User's profile picture |
| `bio` | String | No | Max 500 chars | User biography |
| `rating` | Number | No | 0-5 | Average user rating |
| `totalDonations` | Number | No | Default: 0 | Count of donations made |
| `totalReservations` | Number | No | Default: 0 | Count of reservations made |
| `isActive` | Boolean | No | Default: true | Account active status |
| `lastLogin` | Date | No | | Last login timestamp |
| `createdAt` | Date | Auto | | Record creation timestamp |
| `updatedAt` | Date | Auto | | Last update timestamp |

**Indexes:**
- `email` (unique)
- `verified` (for quick filtering)
- `role` (for admin queries)
- `isActive` (for active users)
- `createdAt` (descending, for recent users)

**Relationships:**
- Has many Donations (as donor)
- Has many Reservations (as receiver)
- Has many Messages (as sender/receiver)
- Has many AuditLogs (as actor)

---

### 2. **Donation Model**

**Purpose:** Stores food donation listings with details, location, and availability.

**Fields:**
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `_id` | ObjectId | Auto | Primary Key | MongoDB auto-generated ID |
| `title` | String | Yes | 3-100 chars | Donation title |
| `description` | String | Yes | 10-1000 chars | Detailed description of food |
| `foodType` | Array[Enum] | Yes | vegetables, fruits, grains, dairy, meat, bakery, cooked, packaged, other | Category of food |
| `quantity` | Number | Yes | > 0 | Amount of food |
| `unit` | Enum | Yes | kg, pieces, liters, boxes, plates | Unit of measurement |
| `pickupLocation` | Object | Yes | | Pickup location details |
| └─ `street` | String | Yes | | Street address |
| └─ `city` | String | Yes | | City name |
| └─ `state` | String | Yes | | State/Province |
| └─ `zipCode` | String | Yes | Valid format | Postal code |
| └─ `coordinates` | Object | No | | GPS coordinates |
| └─ `├─ latitude` | Number | No | | Latitude |
| └─ `└─ longitude` | Number | No | | Longitude |
| `availableFrom` | Date | Yes | Default: now | When food is available |
| `availableUntil` | Date | Yes | > availableFrom | When availability ends |
| `status` | Enum | Yes | available, reserved, picked_up, expired, cancelled, completed | Current status |
| `donorId` | ObjectId | Yes | Ref: User | Reference to donor user |
| `images` | Array[String] | No | Max 5 | Food images URLs |
| `allergens` | Array[String] | No | | Allergen information |
| `expiryDate` | Date | No | | Food expiry date if applicable |
| `createdAt` | Date | Auto | | Record creation timestamp |
| `updatedAt` | Date | Auto | | Last update timestamp |

**Indexes:**
- `donorId` (to find user's donations)
- `status` (to find available donations)
- `foodType` (to filter by food type)
- `availableUntil` (to find expiring donations)
- `createdAt` (descending, for recent donations)
- `pickupLocation.coordinates` (2dsphere, for geospatial queries)
- Compound: `status + createdAt` (recent available)
- Compound: `donorId + status` (donor's active donations)

**Relationships:**
- Belongs to User (donor)
- Has many Reservations
- Has many Messages (related)

---

### 3. **Reservation Model**

**Purpose:** Stores food reservation/request records.

**Fields:**
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `_id` | ObjectId | Auto | Primary Key | MongoDB auto-generated ID |
| `donationId` | ObjectId | Yes | Ref: Donation | Reference to donation |
| `receiverId` | ObjectId | Yes | Ref: User | Reference to receiver user |
| `status` | Enum | Yes | pending, confirmed, picked_up, cancelled, completed, expired | Reservation status |
| `reservedAt` | Date | Yes | Default: now | When reservation was made |
| `pickupDate` | Date | No | > now | Scheduled pickup date |
| `pickupTime` | String | No | HH:MM format | Pickup time |
| `notes` | String | No | Max 500 chars | Special instructions |
| `cancelReason` | String | No | Max 300 chars | Reason for cancellation |
| `cancelledAt` | Date | No | | Cancellation timestamp |
| `completedAt` | Date | No | | Completion timestamp |
| `rating` | Number | No | 1-5 | Receiver's rating of donation |
| `feedback` | String | No | Max 500 chars | Receiver's feedback |
| `createdAt` | Date | Auto | | Record creation timestamp |
| `updatedAt` | Date | Auto | | Last update timestamp |

**Indexes:**
- `donationId` (to find reservations for a donation)
- `receiverId` (to find user's reservations)
- `status` (to find active reservations)
- `createdAt` (descending, for recent reservations)
- Compound: `receiverId + status`
- Compound: `donationId + status` (with unique partial index for active)
- Partial unique index on (donationId, status) where status is pending/confirmed

**Constraints:**
- Only one active (pending/confirmed) reservation per donation
- `pickupDate` must be in the future

**Relationships:**
- Belongs to Donation
- Belongs to User (receiver)
- Has many Messages (related)

---

### 4. **Message Model**

**Purpose:** Stores direct messages between users for communication.

**Fields:**
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `_id` | ObjectId | Auto | Primary Key | MongoDB auto-generated ID |
| `senderId` | ObjectId | Yes | Ref: User | Reference to sender |
| `receiverId` | ObjectId | Yes | Ref: User | Reference to receiver |
| `content` | String | Yes | 1-2000 chars | Message content |
| `isRead` | Boolean | No | Default: false | Read status |
| `readAt` | Date | No | | When message was read |
| `relatedDonationId` | ObjectId | No | Ref: Donation | Related donation (if any) |
| `relatedReservationId` | ObjectId | No | Ref: Reservation | Related reservation (if any) |
| `attachments` | Array[String] | No | Max 5 | File URLs |
| `createdAt` | Date | Auto | | Record creation timestamp |
| `updatedAt` | Date | Auto | | Last update timestamp |

**Indexes:**
- `senderId` (to find sent messages)
- `receiverId` (to find received messages)
- `isRead` (to find unread messages)
- `createdAt` (descending, for message history)
- Compound: `senderId + receiverId` (conversation view)
- Compound: `receiverId + isRead` (unread messages)
- Compound: `senderId + receiverId + createdAt` (full conversation)
- TTL: 365 days (auto-delete old messages)

**Relationships:**
- Belongs to User (sender)
- Belongs to User (receiver)
- Related to Donation (optional)
- Related to Reservation (optional)
- Part of Conversation

---

### 5. **Conversation Model** (Optional but Recommended)

**Purpose:** Groups messages between two users for easier conversation management.

**Fields:**
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `_id` | ObjectId | Auto | Primary Key | MongoDB auto-generated ID |
| `participants` | Array[ObjectId] | Yes | 2 users, Ref: User | Conversation participants |
| `lastMessage` | String | No | Max 2000 chars | Last message preview |
| `lastMessageAt` | Date | No | | Timestamp of last message |
| `unreadCount` | Object | No | | Unread count per user |
| └─ `{userId: count}` | | | | Unread messages per participant |
| `createdAt` | Date | Auto | | Record creation timestamp |
| `updatedAt` | Date | Auto | | Last update timestamp |

**Indexes:**
- `participants` (unique, to prevent duplicates)
- `lastMessageAt` (descending, for recent conversations)
- Compound: `participants + lastMessageAt`

**Relationships:**
- Has many Messages
- Belongs to 2 Users

---

### 6. **Audit Log Model**

**Purpose:** Tracks all significant actions for security and compliance.

**Fields:**
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `_id` | ObjectId | Auto | Primary Key | MongoDB auto-generated ID |
| `action` | Enum | Yes | create, update, delete, login, logout, verify, reserve, cancel, approve, reject, report | Action type |
| `userId` | ObjectId | Yes | Ref: User | User performing action |
| `targetId` | String | Yes | | ID of affected resource |
| `targetType` | Enum | Yes | user, donation, reservation, message | Type of affected resource |
| `changes` | Object | No | | Before/after change details |
| └─ `before` | Mixed | No | | Previous state |
| └─ `after` | Mixed | No | | New state |
| `ipAddress` | String | No | Valid IP format | Request IP address |
| `userAgent` | String | No | Max 500 chars | Browser/client info |
| `status` | Enum | Yes | success, failure | Action result status |
| `errorMessage` | String | No | Max 1000 chars | Error details if failed |
| `timestamp` | Date | Yes | Default: now | Action timestamp |

**Indexes:**
- `userId` (to find user's actions)
- `targetId` (to find actions on resource)
- `action` (to find specific action types)
- `status` (to find failed actions)
- `timestamp` (descending, for recent logs)
- Compound: `userId + timestamp`
- Compound: `targetId + targetType`
- Compound: `action + status + timestamp`
- TTL: 365 days (auto-delete old logs)

**Relationships:**
- Belongs to User (actor)

---

## Data Relationships Diagram

```
User (1) ──→ (∞) Donation
  ├─ (1) ──→ (∞) Reservation (as receiver)
  ├─ (1) ──→ (∞) Message (as sender)
  ├─ (1) ──→ (∞) Message (as receiver)
  ├─ (2) ──→ (1) Conversation
  └─ (1) ──→ (∞) AuditLog

Donation (1) ──→ (∞) Reservation
  ├─ (1) ──→ (∞) Message (related)
  └─ (1) ←─ (∞) User (donor)

Reservation (1) ──→ (1) Donation
  ├─ (1) ──→ (1) User (receiver)
  └─ (∞) ←─ (1) Message (related)

Message (∞) ──→ (1) Conversation
```

---

## Key Design Decisions

### 1. **Denormalization for Performance**
- `lastMessage` and `lastMessageAt` in Conversation to avoid expensive lookups
- `totalDonations` and `totalReservations` in User for quick stats
- `unreadCount` in Conversation for efficient unread tracking

### 2. **Indexing Strategy**
- **Single field indexes**: Frequently filtered fields
- **Compound indexes**: Common multi-field queries
- **Partial indexes**: For specific subsets (e.g., active reservations only)
- **Geospatial indexes**: For location-based queries
- **TTL indexes**: For automatic data cleanup

### 3. **Data Integrity**
- Foreign key relationships via ObjectId references
- Validation rules at schema level
- Unique constraints on email and conversation pairs
- Partial unique indexes for business logic (one active reservation per donation)

### 4. **Security**
- Password field marked as `select: false` to prevent accidental exposure
- Audit logs for compliance and security
- IP address and user agent tracking
- Encrypted passwords in application layer

### 5. **Scalability**
- TTL indexes for automatic cleanup
- Denormalization to reduce join operations
- Appropriate indexes on all queried fields
- Message and audit log archival strategy

---

## Collection Statistics (Estimated)

| Collection | Size (per doc) | Indexes | Comments |
|------------|---|---------|----------|
| User | ~500 bytes | 5 | Core application data |
| Donation | ~1.5 KB | 7 | Heavy query load |
| Reservation | ~800 bytes | 6 | Business critical |
| Message | ~1 KB | 8 | Highest volume, TTL enabled |
| Conversation | ~500 bytes | 3 | Supporting messages |
| AuditLog | ~800 bytes | 7 | Compliance, TTL enabled |

---

## Query Patterns

### User Queries
- Find verified users
- Get user's donations/reservations
- Recent user registration
- Active users for admin

### Donation Queries
- Available donations (status = AVAILABLE)
- Recent donations
- Donations by type
- Donations near location (geospatial)
- User's active donations

### Reservation Queries
- User's pending reservations
- Donation's reservations
- Completed reservations for review
- Expired reservations

### Message Queries
- Conversation between two users
- Unread messages
- Messages for a donation/reservation
- Message history

### Audit Queries
- User action history
- Failed login attempts
- Changes to specific resource
- Actions in time range

---

## Environment Setup

Required environment variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/foodshare
NODE_ENV=development|production
```

---

## Migration & Deployment

### Initial Setup
1. Install MongoDB (local or Atlas)
2. Run `npm install mongoose`
3. Execute connection test in `src/lib/database.ts`
4. Create indexes (auto-created on first connection)

### Backup Strategy
- Daily backups of critical collections (User, Donation, Reservation)
- Weekly full database backups
- Monthly archive to cloud storage

---

## Future Enhancements

1. **Ratings & Reviews**: Separate collection for detailed reviews
2. **Notifications**: Collection for push/email notifications
3. **Reports/Complaints**: Moderation and dispute handling
4. **Analytics**: Aggregation pipeline for insights
5. **Geolocation Cache**: Pre-computed location indexes
6. **Document Versioning**: Full history of donation/reservation changes

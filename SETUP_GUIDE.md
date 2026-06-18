/**
 * Setup and Configuration Guide for Food Share Database
 */

# Database Setup & Configuration

## 1. Install Required Dependencies

```bash
# Core database
npm install mongoose

# For validation
npm install zod

# Optional: For async operations
npm install dotenv

# Optional: For password hashing
npm install bcryptjs
npm install @types/bcryptjs -D
```

## 2. Environment Configuration

Create a `.env.local` file in your project root:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/foodshare

# For local development
# MONGODB_URI=mongodb://localhost:27017/foodshare

# Application
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000

# JWT (if using JWT auth)
JWT_SECRET=your_jwt_secret_key_here_minimum_32_characters
JWT_EXPIRY=7d

# File Upload (if using file storage)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=your_bucket_name
```

## 3. MongoDB Setup

### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Start MongoDB service
mongod

# Verify connection
mongosh
```

### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env.local`

## 4. Database Initialization

Create `src/lib/seed.ts`:

```typescript
import mongoose from 'mongoose';
import connectDB from './database';
import { User } from '@/models';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    
    // Create sample users
    const hashedPassword = await bcrypt.hash('Password123', 10);
    
    const sampleUsers = [
      {
        name: 'John Donor',
        email: 'donor@example.com',
        password: hashedPassword,
        role: 'donor',
        phone: '555-0001',
        address: '123 Main St, City, State 12345',
        verified: true,
      },
      {
        name: 'Jane Receiver',
        email: 'receiver@example.com',
        password: hashedPassword,
        role: 'receiver',
        phone: '555-0002',
        address: '456 Oak Ave, City, State 12345',
        verified: true,
      },
    ];
    
    await User.insertMany(sampleUsers);
    console.log('✅ Database seeded successfully');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
```

Run seeding:
```bash
npx ts-node src/lib/seed.ts
```

## 5. Connection Test

Create `src/lib/test-connection.ts`:

```typescript
import connectDB from './database';

async function testConnection() {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error);
    process.exit(1);
  }
}

testConnection();
```

Test:
```bash
npx ts-node src/lib/test-connection.ts
```

## 6. Backup & Recovery

### Backup with mongodump
```bash
# Full backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/foodshare" --out=./backup

# Backup specific collection
mongodump --uri="mongodb+srv://..." --collection=donations --out=./backup
```

### Restore with mongorestore
```bash
# Full restore
mongorestore --uri="mongodb+srv://..." ./backup

# Specific collection
mongorestore --uri="mongodb+srv://..." --nsInclude="foodshare.donations" ./backup
```

## 7. Monitoring & Maintenance

### Check Database Stats
```bash
db.stats()
db.collection.stats()
```

### Index Management
```bash
# List all indexes
db.collection.getIndexes()

# Rebuild indexes
db.collection.reIndex()

# Drop specific index
db.collection.dropIndex("indexName")
```

### Performance Monitoring
```bash
# Slow query log (in MongoDB)
db.setProfilingLevel(1, { slowms: 100 })

# View profile data
db.system.profile.find().sort({ ts: -1 }).limit(10).pretty()
```

## 8. Security Best Practices

1. **Never commit `.env.local`**
   - Add to `.gitignore`:
     ```
     .env.local
     .env.*.local
     ```

2. **Use IP Whitelisting** (MongoDB Atlas)
   - Restrict access to your IP or server IPs only

3. **Enable Authentication**
   - Create database user with strong password
   - Use principle of least privilege

4. **Encrypt Passwords**
   ```typescript
   import bcrypt from 'bcryptjs';
   
   // Hash password before saving
   const hashedPassword = await bcrypt.hash(password, 10);
   
   // Verify password
   const isValid = await bcrypt.compare(password, hashedPassword);
   ```

5. **Validate All Input**
   - Use Zod schemas (already provided)
   - Sanitize user inputs

6. **Rate Limiting**
   ```typescript
   // Use next-rate-limit or similar
   npm install next-rate-limit
   ```

## 9. Development Workflow

### Start Development Server
```bash
npm run dev
```

### API Testing with cURL
```bash
# Get all donations
curl http://localhost:3000/api/donations

# Create donation
curl -X POST http://localhost:3000/api/donations \
  -H "Content-Type: application/json" \
  -d '{"title":"Food","description":"...","foodType":["vegetables"],...}'

# Get donation by ID
curl http://localhost:3000/api/donations/[id]

# Update donation
curl -X PUT http://localhost:3000/api/donations/[id] \
  -H "Content-Type: application/json" \
  -d '{...}'

# Delete donation
curl -X DELETE http://localhost:3000/api/donations/[id]
```

### Using MongoDB Shell
```bash
# Connect
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/foodshare"

# Show databases
show databases

# Use database
use foodshare

# Show collections
show collections

# Find documents
db.users.find()
db.donations.find().pretty()

# Count documents
db.donations.countDocuments()

# Find with filter
db.donations.find({ status: "AVAILABLE" })

# Update document
db.donations.updateOne({ _id: ObjectId("...") }, { $set: { status: "RESERVED" } })

# Delete document
db.donations.deleteOne({ _id: ObjectId("...") })
```

## 10. Troubleshooting

### Connection Issues
- Check MONGODB_URI is correct
- Verify MongoDB is running
- Check IP whitelisting (for Atlas)
- Look at logs: `tail -f ~/.mongodb/mongod.log`

### Query Performance
- Use `explain()` to analyze queries
- Create indexes on frequently queried fields
- Monitor slow query log
- Use `.limit()` and pagination

### Storage Issues
- Monitor storage quota (Atlas)
- Implement TTL indexes for auto-cleanup
- Archive old data regularly
- Delete test data

### Authentication Issues
- Verify credentials
- Check user permissions
- Ensure user exists in database
- Verify role-based access control

## 11. Production Deployment

### Before Going Live
- [ ] Use MongoDB Atlas with production cluster
- [ ] Enable IP whitelisting to production servers only
- [ ] Use strong passwords (30+ characters)
- [ ] Enable backup and recovery plan
- [ ] Set up monitoring and alerts
- [ ] Test disaster recovery procedures
- [ ] Use environment variables for all secrets
- [ ] Enable SSL/TLS encryption
- [ ] Set up database read replicas for performance
- [ ] Implement comprehensive logging

### Deployment Checklist
```bash
# 1. Run tests
npm test

# 2. Build application
npm run build

# 3. Verify environment variables
echo $MONGODB_URI

# 4. Run database migrations
# npx prisma migrate deploy (if using Prisma)

# 5. Seed production data if needed
npm run seed:production

# 6. Start application
npm start

# 7. Monitor logs
pm2 logs
```

---

**For questions or issues, refer to:**
- MongoDB Docs: https://docs.mongodb.com
- Mongoose Docs: https://mongoosejs.com
- Next.js Docs: https://nextjs.org/docs

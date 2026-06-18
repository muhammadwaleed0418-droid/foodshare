# Authentication System Setup Guide

## Overview

This document provides step-by-step instructions for setting up the complete production-level authentication system in the Food Share application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Database Setup](#database-setup)
4. [Installing Dependencies](#installing-dependencies)
5. [Configuration](#configuration)
6. [Testing the Authentication Flow](#testing-the-authentication-flow)
7. [Deployment Considerations](#deployment-considerations)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18.0 or higher)
- **npm** or **yarn** package manager
- **MongoDB Atlas** account with a database created
- **Next.js** project set up and running
- Understanding of TypeScript, React, and Next.js App Router

---

## Environment Variables

### Step 1: Create `.env.local` file

Copy the `.env.example` file and create a `.env.local` file in the root of your project:

```bash
cp .env.example .env.local
```

### Step 2: Update MongoDB URI

In `.env.local`, update the `MONGODB_URI` with your MongoDB Atlas connection string:

```
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/foodshare?retryWrites=true&w=majority
```

**Note:** Replace `your_username`, `your_password`, and `cluster` with your actual MongoDB credentials.

### Step 3: Generate NEXTAUTH_SECRET

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

Copy the output and set it in `.env.local`:

```
NEXTAUTH_SECRET=your_generated_secret_here
```

### Step 4: Set NEXTAUTH_URL

For development:
```
NEXTAUTH_URL=http://localhost:3000
```

For production:
```
NEXTAUTH_URL=https://yourdomain.com
```

---

## Database Setup

### Step 1: Connect to MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in to your account
3. Navigate to your cluster
4. Click "Connect"
5. Choose "Connect with MongoDB Compass" or "Connect your application"
6. Copy your connection string

### Step 2: Verify User Model

The User model is already defined in `src/models/User.ts` with all required fields:
- `name` - User's full name
- `email` - Unique email address
- `password` - Hashed password
- `role` - User role (donor, receiver, moderator, admin)
- `phone` - Phone number
- `address` - User address
- `verified` - Email verification status
- `isActive` - Account status
- Timestamps and additional fields

---

## Installing Dependencies

All required dependencies should already be installed. To verify:

```bash
npm list next-auth react-hook-form zod bcryptjs mongoose
```

If any are missing, install them:

```bash
npm install next-auth@beta react-hook-form @hookform/resolvers zod bcryptjs mongoose jose
```

---

## Configuration

### Step 1: NextAuth Configuration

The NextAuth configuration is located at `src/lib/nextauth.config.ts`. It includes:

- **Credentials Provider:** Email/password authentication
- **JWT Strategy:** Secure token-based sessions
- **Session Callbacks:** User role and ID stored in JWT and session
- **Database Connection:** MongoDB integration
- **Password Hashing:** bcryptjs with 12 salt rounds

### Step 2: Middleware Protection

The middleware (`middleware.ts`) protects routes:

- **Protected Routes:** `/dashboard`, `/profile`, `/settings`, `/donations`, `/reservations`
- **Role-Based Access:** Users can only access their role-specific dashboards
- **Authentication Redirects:** Unauthenticated users redirected to login
- **Authorization Checks:** Unauthorized access redirected to access-denied page

### Step 3: Authentication Actions

Server actions in `src/actions/auth.ts` handle:

- **User Registration:** Validation, password hashing, duplicate email prevention
- **User Login:** Credentials verification, JWT token generation
- **Logout:** Session termination
- **Password Change:** Current password verification, new password hashing

---

## Testing the Authentication Flow

### Step 1: Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Step 2: Test Registration

1. Navigate to `http://localhost:3000/auth/register`
2. Fill in the registration form:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Phone: `+1 (555) 123-4567`
   - Address: `123 Main St, Anytown, State 12345`
   - Password: `TestPassword123!@`
   - Confirm Password: `TestPassword123!@`
   - Role: `Donor`
3. Click "Create Account"
4. You should see a success message

### Step 3: Test Login

1. Navigate to `http://localhost:3000/auth/login`
2. Enter your credentials:
   - Email: `test@example.com`
   - Password: `TestPassword123!@`
3. Click "Login"
4. You should be redirected to `/dashboard/donor`

### Step 4: Test Role-Based Access

Try accessing different dashboards:
- Donor: `/dashboard/donor` ✓ (allowed)
- Receiver: `/dashboard/receiver` ✗ (redirects to access-denied)
- Moderator: `/dashboard/moderator` ✗ (redirects to access-denied)
- Admin: `/dashboard/admin` ✗ (redirects to access-denied)

### Step 5: Test Logout

1. Click the "Logout" button on any dashboard
2. You should be logged out and unable to access protected routes

### Step 6: Test Protected Routes

1. Log out
2. Try to access `/dashboard` directly
3. You should be redirected to `/auth/login`

---

## Password Requirements

Passwords must meet the following criteria:

- ✓ Minimum 8 characters
- ✓ Maximum 128 characters
- ✓ At least one uppercase letter (A-Z)
- ✓ At least one lowercase letter (a-z)
- ✓ At least one number (0-9)
- ✓ At least one special character (!@#$%^&*)

Example valid password: `SecurePass123!@`

---

## Authentication Flow Diagram

```
User Registration (Register Page)
    ↓
Form Validation (Zod Schema)
    ↓
Check Email Uniqueness (MongoDB)
    ↓
Hash Password (bcryptjs - 12 rounds)
    ↓
Save User to Database
    ↓
Redirect to Login
    ↓
User Login (Login Page)
    ↓
Form Validation (Zod Schema)
    ↓
Find User in Database
    ↓
Compare Password with Hash
    ↓
Generate JWT Token (NextAuth)
    ↓
Store Session
    ↓
Redirect to Role-Based Dashboard
    ↓
Access Protected Routes
    ↓
Middleware Verifies JWT Token
    ↓
Role Check & Authorization
    ↓
Grant/Deny Access
```

---

## Security Features Implemented

### 1. Password Security
- bcryptjs hashing with 12 salt rounds
- Password strength validation
- Passwords never stored in plaintext
- `select: false` on password field to prevent accidental exposure

### 2. Session Management
- JWT-based sessions
- 30-day token expiration
- Secure cookies (httpOnly, secure in production)
- Session update on user activity

### 3. Route Protection
- Middleware-based authentication checks
- Role-based access control (RBAC)
- Unauthorized user redirection
- Protected API routes

### 4. Input Validation
- Frontend validation with react-hook-form
- Backend validation with Zod schemas
- Email format validation
- Phone number validation
- Address validation

### 5. CSRF Protection
- NextAuth handles CSRF tokens automatically
- Secure session cookies
- POST-based credential submission

### 6. User Data Protection
- User role stored in JWT and session
- User ID included in token
- Last login timestamp tracked
- Account status checks (isActive field)

---

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  name: String,           // 2-100 characters
  email: String,          // unique, indexed, lowercase
  password: String,       // bcrypt hash, select: false
  role: String,           // enum: donor|receiver|moderator|admin
  phone: String,          // 10+ digits
  address: String,        // 10-500 characters
  verified: Boolean,      // default: false
  isActive: Boolean,      // default: true, indexed
  profileImage: String,   // optional
  bio: String,            // optional, max 500 chars
  rating: Number,         // 0-5, default: 0
  totalDonations: Number, // default: 0
  totalReservations: Number, // default: 0
  lastLogin: Date,        // optional
  createdAt: Date,        // auto-generated
  updatedAt: Date         // auto-generated
}
```

---

## API Routes

### Authentication Routes

- `POST /api/auth/signin` - Login (handled by NextAuth)
- `POST /api/auth/callback/credentials` - Credentials callback
- `POST /api/auth/signout` - Logout
- `GET /api/auth/session` - Get current session

### User Server Actions

- `registerUser(data)` - Create new user account
- `loginUser(data)` - Authenticate user
- `logoutUser()` - End user session
- `changePassword(data)` - Update user password
- `getUserProfile(userId)` - Fetch user profile

---

## Component Structure

```
src/
├── components/
│   ├── RegisterForm.tsx          # Registration form UI
│   └── LoginForm.tsx              # Login form UI
├── actions/
│   └── auth.ts                    # Server actions for auth
├── lib/
│   ├── auth.ts                    # Auth utilities
│   ├── auth.server.ts             # Server-side auth helpers
│   ├── nextauth.config.ts         # NextAuth configuration
│   ├── database.ts                # MongoDB connection
│   └── validations.ts             # Zod schemas
├── models/
│   └── User.ts                    # Mongoose User model
└── types/
    └── index.ts                   # TypeScript types

app/
├── auth/
│   ├── login/page.tsx             # Login page
│   ├── register/page.tsx          # Registration page
│   └── error/page.tsx             # Auth error page
├── dashboard/
│   ├── donor/page.tsx             # Donor dashboard
│   ├── receiver/page.tsx          # Receiver dashboard
│   ├── moderator/page.tsx         # Moderator dashboard
│   └── admin/page.tsx             # Admin dashboard
├── access-denied/page.tsx         # Access denied page
└── api/
    └── auth/
        └── [...nextauth]/route.ts # NextAuth handler

middleware.ts                      # Route protection
```

---

## Deployment Considerations

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Generate a strong `NEXTAUTH_SECRET` (32+ characters)
- [ ] Use HTTPS for `NEXTAUTH_URL`
- [ ] Set secure cookies in NextAuth config
- [ ] Enable MongoDB Atlas IP whitelisting
- [ ] Set up proper error logging
- [ ] Implement email verification (optional)
- [ ] Add rate limiting to prevent brute force attacks
- [ ] Enable CORS if needed
- [ ] Set up monitoring and alerts
- [ ] Use environment-specific variables
- [ ] Enable MongoDB backup and recovery

### Vercel Deployment

```bash
# Push your code to GitHub
git push origin main

# Import project in Vercel
# Set environment variables in Vercel dashboard:
# - MONGODB_URI
# - NEXTAUTH_SECRET
# - NEXTAUTH_URL (set to your Vercel domain)

# Deploy
npm run build
npm start
```

### Self-Hosted Deployment

```bash
# Build for production
npm run build

# Start server
npm start

# Or use PM2 for process management
pm2 start npm --name "foodshare" -- start
```

---

## Troubleshooting

### Issue: "MongooseError: Cannot connect to MongoDB"

**Solution:**
1. Check your `MONGODB_URI` is correct
2. Whitelist your IP in MongoDB Atlas
3. Ensure MongoDB credentials are URL-encoded
4. Check network connectivity

### Issue: "NEXTAUTH_SECRET is missing"

**Solution:**
```bash
# Generate a new secret
openssl rand -base64 32

# Add to .env.local
NEXTAUTH_SECRET=your_generated_secret
```

### Issue: "Invalid email or password" error after registration

**Solution:**
1. Verify the user was created in MongoDB
2. Check password hash is stored correctly
3. Ensure bcryptjs is installed and working
4. Check password meets all requirements

### Issue: "Access Denied" on dashboard

**Solution:**
1. Verify your user role in the database
2. Check middleware is configured correctly
3. Ensure session includes user role
4. Clear browser cookies and login again

### Issue: Cannot access protected routes after login

**Solution:**
1. Check `NEXTAUTH_URL` matches your application URL
2. Verify JWT token is valid
3. Check session callback in NextAuth config
4. Look at browser console for errors
5. Check Network tab for authentication cookies

### Issue: Form validation not working

**Solution:**
1. Verify `@hookform/resolvers` is installed
2. Check Zod schema syntax
3. Ensure form uses `zodResolver` from react-hook-form
4. Check browser console for errors

### Issue: Password hashing fails

**Solution:**
```bash
# Reinstall bcryptjs
npm uninstall bcryptjs
npm install bcryptjs @types/bcryptjs
```

---

## Next Steps

### Recommended Enhancements

1. **Email Verification**
   - Send verification email after registration
   - Verify email before account activation

2. **Password Recovery**
   - Implement "Forgot Password" flow
   - Send password reset email

3. **Social Login**
   - Add Google OAuth provider
   - Add GitHub OAuth provider

4. **Two-Factor Authentication (2FA)**
   - Implement TOTP-based 2FA
   - Send SMS verification codes

5. **Audit Logging**
   - Log all authentication events
   - Track user activity and changes

6. **Rate Limiting**
   - Implement login attempt throttling
   - Prevent brute force attacks

7. **Profile Management**
   - User profile editing page
   - Profile picture upload
   - User settings page

---

## Support and Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Zod Documentation](https://zod.dev/)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [bcryptjs Documentation](https://github.com/dcodeIO/bcrypt.js)
- [Next.js Documentation](https://nextjs.org/docs)

---

## Version History

| Date       | Version | Changes                                          |
|------------|---------|--------------------------------------------------|
| 2024-05-11 | 1.0.0   | Initial authentication system implementation     |

---

**Last Updated:** May 11, 2024

**Maintained By:** Development Team

**Status:** ✅ Production Ready

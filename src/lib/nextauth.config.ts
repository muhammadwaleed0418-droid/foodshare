/**
 * NextAuth Configuration
 * Handles JWT sessions, credentials provider, and callbacks
 * SIMPLIFIED: No error pages, all redirects go to home or dashboard
 */

import { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { userLoginSchema } from '@/src/lib/validations';
import connectDB from '@/src/lib/database';
import User from '@/src/models/User';
import { comparePasswords } from '@/src/lib/auth';

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        try {
          console.log('🔐 [AUTHORIZE] Starting authorization process');
          
          // Validate input
          if (!credentials?.email || !credentials?.password) {
            console.error('🔐 [AUTHORIZE] Missing email or password');
            return null;
          }
          
          console.log('🔐 [AUTHORIZE] Email provided:', credentials.email);

          // Validate with schema
          let validatedData;
          try {
            validatedData = userLoginSchema.parse({
              email: credentials.email,
              password: credentials.password,
            });
            console.log('🔐 [AUTHORIZE] Schema validation passed');
          } catch (validationError) {
            console.error('🔐 [AUTHORIZE] Schema validation failed:', validationError);
            return null;
          }

          // Connect to database
          console.log('🔐 [AUTHORIZE] Connecting to database...');
          await connectDB();
          console.log('🔐 [AUTHORIZE] Database connected');

          // Find user with password field selected
          console.log('🔐 [AUTHORIZE] Searching for user:', validatedData.email.toLowerCase());
          const user = await User.findOne({
            email: validatedData.email.toLowerCase(),
          }).select('+password');

          if (!user) {
            console.error('🔐 [AUTHORIZE] User not found:', validatedData.email.toLowerCase());
            return null;
          }
          
          console.log('🔐 [AUTHORIZE] User found:', { 
            id: user._id, 
            name: user.name, 
            role: user.role,
            isActive: user.isActive,
            hasPassword: !!user.password 
          });

          if (!user.isActive) {
            console.error('🔐 [AUTHORIZE] Account is deactivated');
            return null;
          }

          // Compare passwords
          console.log('🔐 [AUTHORIZE] Comparing passwords...');
          const isPasswordValid = await comparePasswords(
            validatedData.password,
            user.password
          );
          
          console.log('🔐 [AUTHORIZE] Password comparison result:', isPasswordValid);

          if (!isPasswordValid) {
            console.error('🔐 [AUTHORIZE] Password mismatch');
            return null;
          }

          // Update last login
          console.log('🔐 [AUTHORIZE] Updating last login...');
          user.lastLogin = new Date();
          await user.save();
          console.log('🔐 [AUTHORIZE] Last login updated');

          // Return user object for JWT token
          const returnUser = {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.profileImage,
          };
          console.log('🔐 [AUTHORIZE] ✅ Authorization successful:', returnUser);
          return returnUser;
        } catch (error) {
          console.error('🔐 [AUTHORIZE] ❌ Authorization error:', error);
          if (error instanceof Error) {
            console.error('🔐 [AUTHORIZE] Error message:', error.message);
          }
          console.error('🔐 [AUTHORIZE] Unknown error type:', typeof error);
          return null;
        }
      },
    }),
  ],

  // IMPORTANT: Redirect errors to home page, not error page
  pages: {
    signIn: '/auth/login',
    error: '/', // Redirect ANY errors to home page
  },

  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      console.log('🔐 [JWT CALLBACK] Processing JWT token');
      if (user) {
        console.log('🔐 [JWT CALLBACK] User data received:', { id: user.id, role: (user as any).role });
        token.id = user.id;
        token.role = (user as any).role;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        console.log('🔐 [JWT CALLBACK] Token updated with user data:', token);
      }

      // Allow updates to JWT during session
      if (trigger === 'update' && session) {
        console.log('🔐 [JWT CALLBACK] Session update triggered');
        token.name = session.name || token.name;
        token.picture = session.picture || token.picture;
      }

      console.log('🔐 [JWT CALLBACK] ✅ JWT token ready:', token);
      return token;
    },

    async session({ session, token }) {
      console.log('🔐 [SESSION CALLBACK] Processing session');
      if (session.user) {
        console.log('🔐 [SESSION CALLBACK] Token data:', { id: token.id, role: token.role });
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
        if (token.email) session.user.email = token.email;
        if (token.name) session.user.name = token.name;
        session.user.image = token.picture as string;
        console.log('🔐 [SESSION CALLBACK] ✅ Session updated:', session.user);
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      console.log('🔐 [REDIRECT CALLBACK] Redirect called:', { url, baseUrl });
      
      // Always redirect to home page or dashboard after login
      if (!url || url.startsWith('/')) {
        // For home page as fallback
        return `${baseUrl}${url === '/auth/login' ? '/' : url || '/'}`;
      }
      
      // Default: always go home
      return `${baseUrl}/`;
    },

    async signIn({ user, account, profile, email, credentials }) {
      console.log('🔐 [SIGNIN CALLBACK] Sign in callback:', { user: user?.email, hasUser: !!user });
      
      // Return true to allow signin only if user exists
      return !!user;
    },
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`🔐 [EVENT] User signed in: ${user?.email} (new: ${isNewUser})`);
    },
    async signOut({ token }) {
      console.log(`🔐 [EVENT] User signed out`);
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,

  trustHost: true,
};

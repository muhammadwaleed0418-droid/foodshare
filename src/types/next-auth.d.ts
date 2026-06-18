/**
 * NextAuth Type Definitions Extension
 * Extend NextAuth types to include our custom properties
 */

import type { DefaultSession } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user?: {
      id?: string;
      email?: string;
      name?: string;
      role?: string;
      image?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    profileImage?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    email?: string;
  }
}

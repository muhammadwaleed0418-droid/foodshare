import NextAuth from 'next-auth';
import { authConfig } from '@/src/lib/nextauth.config';

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

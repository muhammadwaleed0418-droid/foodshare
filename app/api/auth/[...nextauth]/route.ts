// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/src/lib/next-auth';  // ← path sahi hai?
export const { GET, POST } = handlers;
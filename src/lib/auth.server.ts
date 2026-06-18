/**
 * Server-side Authentication Functions
 * Used in Server Components and API routes
 */

/**
 * Get current user (server-side)
 * Note: To use this, you need to import getServerSession from next-auth
 * Example: const session = await getServerSession(authConfig);
 */
export async function getCurrentUser() {
  // In production, use getServerSession from next-auth
  // const session = await getServerSession(authConfig);
  // return session?.user || null;
  return null;
}

/**
 * Check if user has specific role
 */
export async function hasRole(requiredRole: string | string[]) {
  const user = await getCurrentUser();
  const userRole = (user as any)?.role;

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole as string);
  }

  return userRole === requiredRole;
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

/**
 * Require specific role - throws error if user doesn't have role
 */
export async function requireRole(requiredRole: string | string[]) {
  const user = await requireAuth();
  const userRole = (user as any)?.role;
  const hasRequiredRole = Array.isArray(requiredRole)
    ? requiredRole.includes(userRole as string)
    : userRole === requiredRole;

  if (!hasRequiredRole) {
    throw new Error('Forbidden');
  }
  return user;
}

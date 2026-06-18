/**
 * Authentication Utilities
 * Password hashing, token generation, and security helpers
 */

import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
}

/**
 * Compare a plain password with a hashed password
 */
export async function comparePasswords(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    if (!plainPassword || !hashedPassword) {
      console.error('🔐 [COMPARE_PASSWORDS] Missing plainPassword or hashedPassword');
      console.error('🔐 [COMPARE_PASSWORDS] plainPassword:', plainPassword ? 'provided' : 'missing');
      console.error('🔐 [COMPARE_PASSWORDS] hashedPassword:', hashedPassword ? `provided (length: ${hashedPassword.length})` : 'missing');
      throw new Error('Invalid password data for comparison');
    }
    
    console.log('🔐 [COMPARE_PASSWORDS] Comparing passwords...');
    console.log('🔐 [COMPARE_PASSWORDS] hashedPassword length:', hashedPassword.length);
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('🔐 [COMPARE_PASSWORDS] ✅ Comparison complete:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('🔐 [COMPARE_PASSWORDS] ❌ Error comparing passwords:', error);
    if (error instanceof Error) {
      console.error('🔐 [COMPARE_PASSWORDS] Error message:', error.message);
    }
    throw new Error('Failed to compare passwords');
  }
}

/**
 * Generate a secure random token
 */
export function generateRandomToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash a token for storage in database
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, 1000);
}

/**
 * Check if token is expired
 */
export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

/**
 * Generate JWT token (note: actual JWT signing is done in NextAuth config)
 */
export function generateTokenExpiry(hoursFromNow: number = 24): Date {
  return new Date(Date.now() + hoursFromNow * 60 * 60 * 1000);
}

/**
 * Rate limiting helper - check if user exceeds attempts
 */
const attempts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean {
  const now = Date.now();
  const record = attempts.get(identifier);

  if (!record) {
    attempts.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (now > record.resetTime) {
    attempts.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxAttempts) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * Clear rate limit for identifier
 */
export function clearRateLimit(identifier: string): void {
  attempts.delete(identifier);
}

/**
 * Reset rate limit map periodically (call in background)
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, value] of attempts.entries()) {
    if (now > value.resetTime) {
      attempts.delete(key);
    }
  }
}

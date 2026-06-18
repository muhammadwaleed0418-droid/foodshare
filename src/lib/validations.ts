/**
 * Validation Schemas using Zod
 * For input validation in API routes and server actions
 * 
 * Install: npm install zod
 */

import { z } from 'zod';
import { UserRole } from '../types';

// Password validation schema with security requirements
const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(128, 'Password cannot exceed 128 characters');

// Email validation
const emailSchema = z
  .string()
  .email('Please provide a valid email address')
  .max(255, 'Email cannot exceed 255 characters');

// Phone validation
const phoneSchema = z
  .string()
  .default('')
  .catch('')
  .transform(val => val?.trim() || '');

// Address validation  
const addressSchema = z
  .string()
  .default('')
  .catch('')
  .transform(val => val?.trim() || '');

// User Registration Validation Schema
export const userRegistrationSchema = z.preprocess(
  (data: any) => ({
    ...data,
    address: data?.address || '',
    phone: data?.phone || '',
  }),
  z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm password is required'),
    phone: phoneSchema,
    address: z.string().default('').catch(''),
    role: z.enum(['donor', 'receiver', 'admin', 'moderator'] as const, {
      errorMap: () => ({ message: 'Please select a valid role' }),
    }).default('donor'),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the terms and conditions',
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
);

export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;

// User Update Validation Schema
export const userUpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'Name can only contain letters, spaces, hyphens, and apostrophes'
    )
    .optional(),
  phone: phoneSchema.optional(),
  address: addressSchema.optional(),
  bio: z
    .string()
    .max(500, 'Bio cannot exceed 500 characters')
    .optional(),
  profileImage: z.string().url().optional(),
});

export type UserUpdateInput = z.infer<typeof userUpdateSchema>;

// User Login Validation Schema
export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type UserLoginInput = z.infer<typeof userLoginSchema>;

// Change Password Validation Schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// Donation Validation Schemas
export const donationCreateSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description cannot exceed 1000 characters'),
  foodType: z
    .array(
      z.enum([
        'vegetables',
        'fruits',
        'grains',
        'dairy',
        'meat',
        'bakery',
        'cooked',
        'packaged',
        'other',
      ])
    )
    .min(1, 'Select at least one food type'),
  quantity: z.number().positive('Quantity must be greater than 0'),
  unit: z.enum(['kg', 'pieces', 'liters', 'boxes', 'plates']),
  pickupLocation: z.object({
    street: z.string().min(5, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z
      .string()
      .regex(/^[0-9\-]{3,}$/, 'Invalid zip code format'),
    coordinates: z
      .object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
      })
      .optional(),
  }),
  availableFrom: z.coerce.date().default(() => new Date()),
  availableUntil: z.coerce.date(),
  allergens: z.array(z.string()).optional(),
  expiryDate: z.coerce.date().optional(),
  images: z
    .array(z.string().url())
    .max(5, 'Cannot upload more than 5 images')
    .optional(),
});

export const donationUpdateSchema = donationCreateSchema.partial();

// Reservation Validation Schemas
export const reservationCreateSchema = z.object({
  donationId: z.string().min(1, 'Donation ID is required'),
  pickupDate: z.coerce.date().optional(),
  pickupTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')
    .optional(),
  notes: z.string().max(500).optional(),
});

export const reservationUpdateSchema = z.object({
  status: z.enum([
    'pending',
    'confirmed',
    'picked_up',
    'cancelled',
    'completed',
    'expired',
  ]),
  pickupDate: z.coerce.date().optional(),
  pickupTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional(),
  notes: z.string().max(500).optional(),
  cancelReason: z.string().max(300).optional(),
  rating: z.number().min(1).max(5).optional(),
  feedback: z.string().max(500).optional(),
});

// Message Validation Schemas
export const messageCreateSchema = z.object({
  receiverId: z.string().min(1, 'Receiver ID is required'),
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message cannot exceed 2000 characters'),
  relatedDonationId: z.string().optional(),
  relatedReservationId: z.string().optional(),
  attachments: z.array(z.string().url()).max(5).optional(),
});

export const messageMarkAsReadSchema = z.object({
  messageIds: z.array(z.string().min(1)),
});

// Query Filter Schemas
export const donationFilterSchema = z.object({
  status: z.enum([
    'available',
    'reserved',
    'picked_up',
    'expired',
    'cancelled',
    'completed',
  ]).optional(),
  foodType: z.array(z.string()).optional(),
  city: z.string().optional(),
  sortBy: z.enum(['newest', 'oldest', 'expiringsoon']).optional(),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(10),
});

export const reservationFilterSchema = z.object({
  status: z.enum([
    'pending',
    'confirmed',
    'picked_up',
    'cancelled',
    'completed',
    'expired',
  ]).optional(),
  sortBy: z.enum(['newest', 'oldest']).optional(),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(10),
});

// Type exports for TypeScript
export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
export type DonationCreate = z.infer<typeof donationCreateSchema>;
export type DonationUpdate = z.infer<typeof donationUpdateSchema>;
export type ReservationCreate = z.infer<typeof reservationCreateSchema>;
export type ReservationUpdate = z.infer<typeof reservationUpdateSchema>;
export type MessageCreate = z.infer<typeof messageCreateSchema>;
export type DonationFilter = z.infer<typeof donationFilterSchema>;
export type ReservationFilter = z.infer<typeof reservationFilterSchema>;

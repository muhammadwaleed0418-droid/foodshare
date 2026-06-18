/**
 * Authentication Server Actions
 * Handle registration, login, logout, and password changes
 */

'use server';

import connectDB from '@/src/lib/database';
import User from '@/src/models/User';
import {
  userRegistrationSchema,
  userLoginSchema,
  changePasswordSchema,
  type UserRegistrationInput,
  type UserLoginInput,
  type ChangePasswordInput,
} from '@/src/lib/validations';
import { hashPassword, comparePasswords, validatePassword } from '@/src/lib/auth';

/**
 * Register a new user
 */
export async function registerUser(data: UserRegistrationInput) {
  try {
    console.log('=== REGISTRATION START ===');
    console.log('Raw input data:', JSON.stringify(data, null, 2));
    console.log('Input keys:', Object.keys(data));

    // Validate input
    const validatedData = userRegistrationSchema.parse(data);
    console.log('Validated data:', JSON.stringify(validatedData, null, 2));

    // Connect to database
    console.log('Attempting database connection...');
    await connectDB();
    console.log('Database connected successfully');

    // Check if user already exists
    const existingUser = await User.findOne({
      email: validatedData.email.toLowerCase(),
    });

    if (existingUser) {
      return {
        success: false,
        error: 'Email already registered. Please use a different email or login.',
      };
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create new user
    const newUser = new User({
      name: validatedData.name.trim(),
      email: validatedData.email.toLowerCase(),
      password: hashedPassword,
      role: validatedData.role,
      phone: validatedData.phone || '',
      address: validatedData.address || '',
      isActive: true,
      verified: false,
    });

    const savedUser = await newUser.save();

    return {
      success: true,
      message: 'Registration successful! Please log in with your credentials.',
      userId: savedUser._id.toString(),
    };
  } catch (error: any) {
    console.error('=== REGISTRATION ERROR ===');
    console.error('Full error:', error);
    console.error('Error name:', error?.name);
    console.error('Error message:', error?.message);
    console.error('Error code:', error?.code);

    // Check for MongoDB connection errors
    if (error?.message?.includes('SSL') || error?.message?.includes('ENOTFOUND') || error?.message?.includes('UNABLE_TO_VERIFY_LEAF_SIGNATURE')) {
      return {
        success: false,
        error: 'Database connection error. Please check MongoDB Atlas status or try again.',
      };
    }

    // Check for Zod validation errors (must be FIRST)
    if (error?.name === 'ZodError' && error?.issues) {
      console.error('Zod validation errors:', error.issues);
      const errorDetails = error.issues
        .map((issue: any) => `${issue.path.join('.')}: ${issue.message}`)
        .join(' | ');
      return {
        success: false,
        error: errorDetails || 'Validation failed',
      };
    }

    // Check for Mongoose validation errors
    if (error?.errors) {
      console.error('Mongoose validation errors:', error.errors);
      const errorDetails = Object.keys(error.errors)
        .map((key: string) => error.errors[key].message)
        .join(' | ');
      return {
        success: false,
        error: errorDetails || 'Validation failed',
      };
    }

    // Check for MongoDB duplicate key error
    if (error?.code === 11000) {
      return {
        success: false,
        error: 'Email already registered. Please use a different email.',
      };
    }

    // Generic error
    if (error instanceof Error) {
      console.error('Generic error:', error.message);
      return {
        success: false,
        error: error.message || 'Registration failed. Please try again.',
      };
    }

    console.error('Unknown error type');
    return {
      success: false,
      error: 'An unexpected error occurred during registration.',
    };
  }
}

/**
 * Login user
 */
export async function loginUser(data: UserLoginInput) {
  try {
    // Validate input
    const validatedData = userLoginSchema.parse(data);

    // Connect to database
    await connectDB();

    // Find user
    const user = await User.findOne({
      email: validatedData.email.toLowerCase(),
    }).select('+password');

    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password.',
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        error: 'Your account has been deactivated. Please contact support.',
      };
    }

    // Compare password
    const isPasswordValid = await comparePasswords(
      validatedData.password,
      user.password
    );

    if (!isPasswordValid) {
      return {
        success: false,
        error: 'Invalid email or password.',
      };
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Return dashboard URL based on role
    const dashboardUrls: Record<string, string> = {
      donor: '/dashboard/donor',
      receiver: '/dashboard/receiver',
      moderator: '/dashboard/moderator',
      admin: '/dashboard/admin',
    };

    return {
      success: true,
      message: 'Login successful!',
      redirect: dashboardUrls[user.role] || '/dashboard',
      credentials: {
        email: validatedData.email,
        password: validatedData.password,
      },
    };
  } catch (error) {
    console.error('Login error:', error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Login failed. Please try again.',
      };
    }

    return {
      success: false,
      error: 'An unexpected error occurred during login.',
    };
  }
}

/**
 * Logout user (client-side action)
 */
export async function logoutUser() {
  try {
    return {
      success: true,
      message: 'Logged out successfully.',
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: 'An error occurred during logout.',
    };
  }
}

/**
 * Change user password
 */
export async function changePassword(userId: string, data: ChangePasswordInput) {
  try {
    // Validate input
    const validatedData = changePasswordSchema.parse(data);

    // Validate password strength
    const passwordValidation = validatePassword(validatedData.newPassword);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        error: passwordValidation.errors.join('. '),
      };
    }

    // Connect to database
    await connectDB();

    // Find user
    const user = await User.findById(userId).select('+password');

    if (!user) {
      return {
        success: false,
        error: 'User not found.',
      };
    }

    // Verify current password
    const isPasswordValid = await comparePasswords(
      validatedData.currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return {
        success: false,
        error: 'Current password is incorrect.',
      };
    }

    // Hash new password
    const hashedPassword = await hashPassword(validatedData.newPassword);

    // Update password
    user.password = hashedPassword;
    await user.save();

    return {
      success: true,
      message: 'Password changed successfully.',
    };
  } catch (error) {
    console.error('Change password error:', error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Failed to change password.',
      };
    }

    return {
      success: false,
      error: 'An unexpected error occurred.',
    };
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string) {
  try {
    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      return {
        success: false,
        error: 'User not found.',
      };
    }

    return {
      success: true,
      data: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        profileImage: user.profileImage,
        bio: user.bio,
        verified: user.verified,
        rating: user.rating,
        totalDonations: user.totalDonations,
        totalReservations: user.totalReservations,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  } catch (error) {
    console.error('Get profile error:', error);
    return {
      success: false,
      error: 'Failed to fetch user profile.',
    };
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  data: Partial<UserRegistrationInput>
) {
  try {
    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      return {
        success: false,
        error: 'User not found.',
      };
    }

    // Update fields
    if (data.name) user.name = data.name;
    if (data.phone) user.phone = data.phone;
    if (data.address) user.address = data.address;

    await user.save();

    return {
      success: true,
      message: 'Profile updated successfully.',
      data: user,
    };
  } catch (error) {
    console.error('Update profile error:', error);
    return {
      success: false,
      error: 'Failed to update profile.',
    };
  }
}

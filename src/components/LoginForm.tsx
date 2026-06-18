/**
 * Login Form Component
 * Handles user authentication with email and password
 */

'use client';

import React, { useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userLoginSchema, type UserLoginInput } from '@/src/lib/validations';
import { loginUser } from '@/src/actions/auth';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLoginInput>({
     resolver: zodResolver(userLoginSchema) as unknown as Resolver<UserLoginInput>,
  });

  const onSubmit = async (data: UserLoginInput) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      // First verify credentials and get redirect URL
      const result = await loginUser(data);

      if (result.success && result.credentials) {
        // Now sign in with NextAuth
        const signInResult = await signIn('credentials', {
          email: result.credentials.email,
          password: result.credentials.password,
          redirect: false,
        });

        if (signInResult?.ok) {
          // Redirect to appropriate dashboard
          router.push(result.redirect || '/dashboard/donor');
          router.refresh();
        } else {
          setErrorMessage('Failed to authenticate. Please try again.');
        }
      } else {
        setErrorMessage(result.error || 'Login failed');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Welcome Back
      </h1>

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            {...register('email')}
            id="email"
            type="email"
            placeholder="you@example.com"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative mt-1">
            <input
              {...register('password')}
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center text-gray-700">
            <input type="checkbox" className="mr-2 w-4 h-4" />
            Remember me
          </label>
          <Link href="/auth/forgot-password" className="text-green-600 hover:text-green-700">
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          {isLoading ? 'Logging In...' : 'Login'}
        </button>
      </form>

      {/* Register Link */}
      <p className="mt-6 text-center text-gray-600">
        Don't have an account?{' '}
        <Link href="/auth/register" className="text-green-600 hover:text-green-700 font-semibold">
          Register here
        </Link>
      </p>
    </div>
  );
}

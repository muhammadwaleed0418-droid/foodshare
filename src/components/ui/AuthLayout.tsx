'use client';

import React from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  footerText?: string;
  footerLink?: {
    text: string;
    href: string;
  };
}

export function AuthLayout({
  children,
  title,
  subtitle,
  footerText,
  footerLink,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white dark:bg-gray-950 overflow-hidden">
      {/* Left Side - Hero/Illustration Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-green-500 via-emerald-500 to-blue-600 dark:from-green-600 dark:via-emerald-600 dark:to-blue-700 relative overflow-hidden items-center justify-center p-8">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"
            style={{
              top: '-48px',
              left: '-48px',
              animationDuration: '4s',
            }}
          ></div>
          <div
            className="absolute w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"
            style={{
              bottom: '-48px',
              right: '-48px',
              animationDuration: '6s',
            }}
          ></div>
          <div
            className="absolute w-72 h-72 bg-green-300/10 rounded-full blur-3xl animate-pulse"
            style={{
              top: '50%',
              right: '10%',
              animationDuration: '5s',
            }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-white text-center px-8 max-w-md">
          <div className="mb-8 inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full border border-white/30">
            <svg
              className="w-8 h-8"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </div>

          <h2 className="text-4xl font-bold mb-4">FoodShare</h2>
          <p className="text-lg text-green-50 mb-8 leading-relaxed">
            Join our community to share meals, reduce food waste, and help those in need. Together, we create a better tomorrow.
          </p>

          {/* Features List */}
          <div className="space-y-4 text-left">
            {[
              {
                icon: '🍽️',
                text: 'Share surplus food',
              },
              {
                icon: '🤝',
                text: 'Connect with community',
              },
              {
                icon: '♻️',
                text: 'Reduce food waste',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-green-50"
              >
                <span className="text-2xl">{feature.icon}</span>
                <span className="font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-linear-to-br from-green-500 to-blue-600 rounded-full mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">FoodShare</h1>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
            {subtitle && (
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form */}
          <div className="backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 rounded-2xl border border-white/20 dark:border-gray-800/50 shadow-2xl shadow-black/10 dark:shadow-black/50 p-8 transition-all duration-300">
            {children}
          </div>

          {/* Footer */}
          {footerText && footerLink && (
            <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-6">
              {footerText}{' '}
              <Link
                href={footerLink.href}
                className="font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
              >
                {footerLink.text}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

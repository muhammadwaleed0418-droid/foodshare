'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { LogoutButton } from '@/src/components/LogoutButton';

export function NavbarClient() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-linear-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🍃</span>
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-white">FoodShare</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition"
          >
            Home
          </Link>
          <Link
            href="/donations"
            className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition"
          >
            Donations
          </Link>
          <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition">
            About
          </Link>
          <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 bg-linear-to-r from-green-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

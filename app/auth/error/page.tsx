/**
 * Authentication Error Page
 */

import Link from 'next/link';

export const metadata = {
  title: 'Authentication Error - Food Share',
  description: 'An error occurred during authentication',
};

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[]>;
}) {
  const error = searchParams?.error || 'An authentication error occurred';

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Error
          </h1>
          <p className="text-gray-600 mb-6">
            {Array.isArray(error) ? error[0] : error}
          </p>

          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              Try Logging In Again
            </Link>
            <Link
              href="/auth/register"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              Create New Account
            </Link>
            <Link
              href="/"
              className="block w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

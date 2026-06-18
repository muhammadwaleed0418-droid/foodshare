/**
 * Access Denied Page
 */

import Link from 'next/link';

export const metadata = {
  title: 'Access Denied - Food Share',
  description: 'You do not have permission to access this page',
};

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You do not have permission to access this page. Please contact an administrator if
            you believe this is a mistake.
          </p>

          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              Go to Dashboard
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

/**
 * Moderator Dashboard Home
 */

'use client';

import React from 'react';
import Link from 'next/link';

export default function ModeratorDashboard() {
  const stats = [
    {
      label: 'Pending Verifications',
      value: '8',
      icon: '✔️',
      color: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Listings to Approve',
      value: '5',
      icon: '📝',
      color: 'bg-amber-50 dark:bg-amber-900/20',
      textColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Active Reports',
      value: '3',
      icon: '🚩',
      color: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-600 dark:text-red-400',
    },
    {
      label: 'Users Managed',
      value: '245',
      icon: '👥',
      color: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Moderator Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage food listings, verify donors, and handle reports</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} rounded-2xl p-6 border border-gray-200 dark:border-gray-700`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className={`text-3xl font-bold mt-2 ${stat.textColor}`}>{stat.value}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/moderator/verify"
          className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200 dark:border-blue-700 p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">✅ Verify Donors</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Review and verify new donor accounts</p>
        </Link>

        <Link
          href="/dashboard/moderator/approve"
          className="bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200 dark:border-amber-700 p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📝 Approve Listings</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Review and approve food donations</p>
        </Link>

        <Link
          href="/dashboard/moderator/reports"
          className="bg-linear-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl border border-red-200 dark:border-red-700 p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🚩 Handle Reports</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Review and resolve user reports</p>
        </Link>
      </div>
    </div>
  );
}
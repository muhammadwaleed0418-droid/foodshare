/**
 * Receiver Dashboard Home
 */

'use client';

import React from 'react';
import Link from 'next/link';

export default function ReceiverDashboard() {
  const stats = [
    {
      label: 'Reservations',
      value: '5',
      icon: '📦',
      color: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Completed Pickups',
      value: '12',
      icon: '✅',
      color: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Pending Requests',
      value: '2',
      icon: '⏳',
      color: 'bg-amber-50 dark:bg-amber-900/20',
      textColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Help Provided',
      value: '28 kg',
      icon: '🤝',
      color: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Receiver Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Find surplus food in your community</p>
        </div>
        <Link
          href="/dashboard/receiver/search"
          className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <span>🔍</span>
          Search Donations
        </Link>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/receiver/search"
          className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200 dark:border-blue-700 p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🔍 Search Donations</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Browse available food donations in your area</p>
        </Link>

        <Link
          href="/dashboard/receiver/reservations"
          className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-700 p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📦 My Reservations</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Track your active and completed reservations</p>
        </Link>
      </div>
    </div>
  );
}
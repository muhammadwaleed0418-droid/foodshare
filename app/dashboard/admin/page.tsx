/**
 * Admin Dashboard Home
 * Advanced analytics and platform management
 */

'use client';

import React from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const stats = [
    {
      label: 'Total Users',
      value: '2,547',
      icon: '👥',
      change: '+142 this month',
      color: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Total Donations',
      value: '8,324',
      icon: '🎁',
      change: '+1,245 this month',
      color: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Total Reservations',
      value: '5,891',
      icon: '📦',
      change: '+823 this month',
      color: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Active Moderators',
      value: '24',
      icon: '👮',
      change: '+2 new this month',
      color: 'bg-amber-50 dark:bg-amber-900/20',
      textColor: 'text-amber-600 dark:text-amber-400',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Platform management and analytics</p>
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
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">{stat.change}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📈 Donations Trend</h3>
          <div className="h-48 bg-linear-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-600">Chart placeholder</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">👥 User Growth</h3>
          <div className="h-48 bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-600">Chart placeholder</span>
          </div>
        </div>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/admin/users"
          className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200 dark:border-blue-700 p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">👥 User Management</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">View all users, ban accounts, manage roles</p>
        </Link>

        <Link
          href="/dashboard/admin/moderators"
          className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-700 p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">👮 Moderators</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage moderator team and permissions</p>
        </Link>

        <Link
          href="/dashboard/admin/analytics"
          className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-700 p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📊 Advanced Analytics</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Detailed metrics and reporting</p>
        </Link>

        <Link
          href="/dashboard/admin/logs"
          className="bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200 dark:border-amber-700 p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📜 Activity Logs</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">System and user activity audit logs</p>
        </Link>
      </div>
    </div>
  );
}

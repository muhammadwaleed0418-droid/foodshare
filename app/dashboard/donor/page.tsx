/**
 * Donor Dashboard Home
 * Shows statistics and overview
 */

'use client';

import React from 'react';
import Link from 'next/link';

export default function DonorDashboard() {
  // Mock data - replace with real data from API
  const stats = [
    {
      label: 'Total Donations',
      value: '12',
      icon: '🎁',
      trend: '+2 this month',
      color: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Active Reservations',
      value: '3',
      icon: '⏳',
      trend: 'Awaiting pickup',
      color: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Completed Pickups',
      value: '8',
      icon: '✅',
      trend: '+1 last week',
      color: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Rating',
      value: '4.8',
      icon: '⭐',
      trend: 'Based on 15 reviews',
      color: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400',
    },
  ];

  const recentDonations = [
    {
      id: 1,
      title: 'Fresh Vegetables',
      quantity: '5 kg',
      status: 'reserved',
      reservedBy: 'John Doe',
      date: '2024-01-10',
    },
    {
      id: 2,
      title: 'Bakery Items',
      quantity: '12 pieces',
      status: 'available',
      reservedBy: null,
      date: '2024-01-08',
    },
    {
      id: 3,
      title: 'Dairy Products',
      quantity: '2 liters',
      status: 'picked_up',
      reservedBy: 'Jane Smith',
      date: '2024-01-05',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 'reserved':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
      case 'picked_up':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Donor Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Here's your donation overview.</p>
        </div>
        <Link
          href="/dashboard/donor/add"
          className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          <span>➕</span>
          Add New Donation
        </Link>
      </div>

      {/* Statistics Grid */}
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
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">{stat.trend}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Donations */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Donations</h2>
          <Link
            href="/dashboard/donor/manage"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Food Item
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Quantity
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Reserved By
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {recentDonations.map((donation) => (
                <tr key={donation.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">
                    {donation.title}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {donation.quantity}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                      {donation.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {donation.reservedBy || '-'}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {donation.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🎯 Next Steps</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">Complete your profile with a profile picture</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">Add your first donation to start helping</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">Get verified to increase trust with receivers</span>
            </li>
          </ul>
        </div>

        <div className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200 dark:border-blue-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📚 Resources</h3>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                → How to add a donation
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                → Food safety guidelines
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                → Community standards
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

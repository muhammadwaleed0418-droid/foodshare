/**
 * Manage Donations Page
 * Donor can view, edit, and delete their donations
 */

'use client';

import React, { useState } from 'react';

export default function ManageDonationsPage() {
  const [donations] = useState([
    {
      id: 1,
      title: 'Fresh Vegetables',
      quantity: '5 kg',
      status: 'reserved',
      reservedBy: 'John Doe',
      expiryDate: '2024-01-15',
      reservations: 2,
    },
    {
      id: 2,
      title: 'Bakery Items',
      quantity: '12 pieces',
      status: 'available',
      reservedBy: null,
      expiryDate: '2024-01-12',
      reservations: 0,
    },
    {
      id: 3,
      title: 'Dairy Products',
      quantity: '2 liters',
      status: 'picked_up',
      reservedBy: 'Jane Smith',
      expiryDate: '2024-01-05',
      reservations: 1,
    },
  ]);

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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Donations</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">View and manage all your food donations</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Food Item
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Quantity
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Reservations
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Expiry Date
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr
                  key={donation.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                >
                  <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                    {donation.title}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
                    {donation.quantity}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                      {donation.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
                    {donation.reservations} {donation.reservations === 1 ? 'reservation' : 'reservations'}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
                    {donation.expiryDate}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded">
                        View
                      </button>
                      <button className="px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded">
                        Edit
                      </button>
                      <button className="px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {donations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't listed any donations yet.</p>
          <a
            href="/dashboard/donor/add"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <span>➕</span>
            Add Your First Donation
          </a>
        </div>
      )}
    </div>
  );
}

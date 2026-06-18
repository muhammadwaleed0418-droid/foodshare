/**
 * Search Donations Page
 * Receiver can search and filter available donations
 */

'use client';

import React, { useState } from 'react';

export default function SearchDonationsPage() {
  const [filters, setFilters] = useState({
    foodType: '',
    location: '',
    radius: '5',
  });

  const donations = [
    {
      id: 1,
      title: 'Fresh Vegetables',
      quantity: '5 kg',
      donor: 'Local Market',
      distance: '0.5 km',
      expiryDate: '2024-01-15',
      image: '🥬',
    },
    {
      id: 2,
      title: 'Bakery Items',
      quantity: '12 pieces',
      donor: 'City Bakery',
      distance: '1.2 km',
      expiryDate: '2024-01-12',
      image: '🥐',
    },
    {
      id: 3,
      title: 'Dairy Products',
      quantity: '2 liters',
      donor: 'Farm Store',
      distance: '2.3 km',
      expiryDate: '2024-01-18',
      image: '🥛',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Search Donations</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Find available food in your area</p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Food Type
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              value={filters.foodType}
              onChange={(e) => setFilters({ ...filters, foodType: e.target.value })}
            >
              <option>All Types</option>
              <option>Vegetables</option>
              <option>Fruits</option>
              <option>Bakery</option>
              <option>Dairy</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              placeholder="Enter location"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Radius (km)
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              value={filters.radius}
              onChange={(e) => setFilters({ ...filters, radius: e.target.value })}
            >
              <option>1</option>
              <option>5</option>
              <option>10</option>
              <option>25</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donations.map((donation) => (
          <div
            key={donation.id}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="bg-linear-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-8 text-4xl flex items-center justify-center">
              {donation.image}
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {donation.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                by <span className="font-medium">{donation.donor}</span>
              </p>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  📦 Quantity: <span className="font-medium">{donation.quantity}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  📍 Distance: <span className="font-medium">{donation.distance}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ⏰ Expires: <span className="font-medium">{donation.expiryDate}</span>
                </p>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Reserve Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

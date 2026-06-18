'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { NavbarClient } from '@/src/components/NavbarClient';
import { FoodType, DonationStatus } from '@/src/types';

interface Donation {
  _id: string;
  title: string;
  description: string;
  foodType: FoodType[];
  quantity: number;
  unit: string;
  pickupLocation: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  availableUntil: string;
  status: DonationStatus;
  donorId: {
    _id: string;
    name: string;
    profileImage?: string;
    rating?: number;
  };
  expiryDate?: string;
  images?: string[];
  createdAt: string;
}

const FOOD_TYPE_ICONS: Record<FoodType, string> = {
  vegetables: '🥬',
  fruits: '🍎',
  grains: '🌾',
  dairy: '🥛',
  meat: '🥩',
  bakery: '🥐',
  cooked: '🍜',
  packaged: '📦',
  other: '🍱',
};

export default function AvailableDonations() {
  const { data: session } = useSession();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [reservingDonationId, setReservingDonationId] = useState<string | null>(null);
  const [reserveError, setReserveError] = useState('');
  const [reserveSuccess, setReserveSuccess] = useState('');
  
  // Filter and search state
  const [foodTypeFilter, setFoodTypeFilter] = useState<FoodType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<DonationStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'nearest' | 'expiring'>('newest');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/donations?limit=100');
      if (!response.ok) throw new Error('Failed to fetch donations');
      
      const data = await response.json();
      setDonations(data.data || []);
    } catch (err) {
      setError('Failed to load donations. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async () => {
    if (!selectedDonation || !session?.user?.id) return;
    
    try {
      setReservingDonationId(selectedDonation._id);
      setReserveError('');
      setReserveSuccess('');
      
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donationId: selectedDonation._id,
          receiverId: session.user.id,
          quantity: selectedDonation.quantity,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reserve donation');
      }
      
      setReserveSuccess('Donation reserved successfully!');
      
      // Update donation status
      setDonations(donations.map(d =>
        d._id === selectedDonation._id
          ? { ...d, status: DonationStatus.RESERVED }
          : d
      ));
      
      // Close modal after 2 seconds
      setTimeout(() => setSelectedDonation(null), 2000);
    } catch (err: any) {
      setReserveError(err.message || 'Failed to reserve donation');
    } finally {
      setReservingDonationId(null);
    }
  };

  const closeDetailsModal = () => {
    setSelectedDonation(null);
    setReserveError('');
    setReserveSuccess('');
  };

  // Filter and sort donations
  const filteredDonations = donations
    .filter(donation => {
      // Status filter
      if (statusFilter !== 'all' && donation.status !== statusFilter) return false;
      
      // Food type filter
      if (foodTypeFilter !== 'all' && !donation.foodType.includes(foodTypeFilter)) return false;
      
      // Search query
      if (searchQuery && !donation.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !donation.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // City filter
      if (cityFilter !== 'all' && donation.pickupLocation.city !== cityFilter) return false;
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'expiring') {
        return new Date(a.availableUntil).getTime() - new Date(b.availableUntil).getTime();
      }
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDonations = filteredDonations.slice(startIndex, startIndex + itemsPerPage);

  const uniqueCities = Array.from(new Set(donations.map(d => d.pickupLocation.city)));
  const availableFoodTypes = Array.from(new Set(donations.flatMap(d => d.foodType)));

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <NavbarClient />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-500 to-blue-500 py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Available Donations</h1>
          <p className="text-lg opacity-90">
            Find fresh food available in your area
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search donations..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
            />
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Food Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Food Type
              </label>
              <select
                value={foodTypeFilter}
                onChange={(e) => {
                  setFoodTypeFilter(e.target.value as FoodType | 'all');
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Types</option>
                {availableFoodTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as DonationStatus | 'all');
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value={DonationStatus.AVAILABLE}>Available</option>
                <option value={DonationStatus.RESERVED}>Reserved</option>
                <option value={DonationStatus.PICKED_UP}>Picked Up</option>
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City
              </label>
              <select
                value={cityFilter}
                onChange={(e) => {
                  setCityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Cities</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="newest">Newest First</option>
                <option value="expiring">Expiring Soon</option>
              </select>
            </div>
          </div>

          {/* Results Info */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredDonations.length)} of {filteredDonations.length} donations
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8 text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading donations...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && paginatedDonations.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-xl text-gray-600 dark:text-gray-400">No donations found</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Try adjusting your filters or search terms</p>
          </div>
        )}

        {/* Donations Grid */}
        {!loading && paginatedDonations.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedDonations.map((donation) => (
                <div
                  key={donation._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                >
                  {/* Header with Status Badge */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
                    <div className="flex items-start gap-2">
                      <span className="text-3xl">
                        {FOOD_TYPE_ICONS[donation.foodType[0] as FoodType] || '🍱'}
                      </span>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                          {donation.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {donation.foodType.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      donation.status === DonationStatus.AVAILABLE
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : donation.status === DonationStatus.RESERVED
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {donation.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-grow">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {donation.description}
                    </p>

                    <div className="space-y-3 text-sm">
                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">Quantity:</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {donation.quantity} {donation.unit}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">Location:</span>
                        <div className="text-gray-900 dark:text-white">
                          <p>{donation.pickupLocation.street}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {donation.pickupLocation.city}, {donation.pickupLocation.state} {donation.pickupLocation.zipCode}
                          </p>
                        </div>
                      </div>

                      {/* Available Until */}
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">Available:</span>
                        <span className="text-gray-900 dark:text-white">
                          {formatDate(donation.availableUntil)}
                        </span>
                      </div>

                      {/* Donor */}
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">Donor:</span>
                        <div className="flex items-center gap-2">
                          {donation.donorId.profileImage && (
                            <img
                              src={donation.donorId.profileImage}
                              alt={donation.donorId.name}
                              className="w-6 h-6 rounded-full"
                            />
                          )}
                          <span className="text-gray-900 dark:text-white">
                            {donation.donorId.name}
                          </span>
                          {donation.donorId.rating && (
                            <span className="text-yellow-500">
                              ⭐ {donation.donorId.rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    {!session ? (
                      <Link
                        href="/auth/login"
                        className="w-full block text-center bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition"
                      >
                        Login to Reserve
                      </Link>
                    ) : (
                      <button
                        onClick={() => setSelectedDonation(donation)}
                        disabled={donation.status !== DonationStatus.AVAILABLE}
                        className={`w-full py-2 rounded-lg font-semibold transition ${
                          donation.status === DonationStatus.AVAILABLE
                            ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                            : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {donation.status === DonationStatus.AVAILABLE ? 'View Details' : (donation.status === DonationStatus.RESERVED ? 'Already Reserved' : 'Unavailable')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 border rounded-lg transition ${
                      currentPage === page
                        ? 'bg-green-500 text-white border-green-500'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Details Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedDonation.title}
              </h2>
              <button
                onClick={closeDetailsModal}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  selectedDonation.status === DonationStatus.AVAILABLE
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : selectedDonation.status === DonationStatus.RESERVED
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {selectedDonation.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedDonation.description}
                </p>
              </div>

              {/* Food Types */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Food Types</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDonation.foodType.map(type => (
                    <span
                      key={type}
                      className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-3 py-1 rounded-full text-sm"
                    >
                      {FOOD_TYPE_ICONS[type as FoodType]} {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Quantity</h3>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedDonation.quantity} {selectedDonation.unit}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Available Until</h3>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {formatDate(selectedDonation.availableUntil)}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Pickup Location</h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-900 dark:text-white font-medium">{selectedDonation.pickupLocation.street}</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedDonation.pickupLocation.city}, {selectedDonation.pickupLocation.state} {selectedDonation.pickupLocation.zipCode}
                  </p>
                </div>
              </div>

              {/* Donor Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Donor Information</h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-center gap-3">
                  {selectedDonation.donorId.profileImage && (
                    <img
                      src={selectedDonation.donorId.profileImage}
                      alt={selectedDonation.donorId.name}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedDonation.donorId.name}</p>
                    {selectedDonation.donorId.rating && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ⭐ Rating: {selectedDonation.donorId.rating.toFixed(1)} out of 5
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              {reserveError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg">
                  {reserveError}
                </div>
              )}
              
              {reserveSuccess && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 p-4 rounded-lg">
                  {reserveSuccess}
                </div>
              )}

              {selectedDonation.status === DonationStatus.AVAILABLE && session && session.user?.role !== 'admin' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 p-4 rounded-lg">
                  ℹ️ Only admin users can reserve food. Please contact administration for assistance.
                </div>
              )}

              {!session && selectedDonation.status === DonationStatus.AVAILABLE && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 p-4 rounded-lg">
                  Please login to view reservation options.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <button
                onClick={closeDetailsModal}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Close
              </button>
              {selectedDonation.status === DonationStatus.AVAILABLE && session?.user?.role === 'admin' && (
                <button
                  onClick={handleReserve}
                  disabled={reservingDonationId === selectedDonation._id}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold text-white transition ${
                    reservingDonationId === selectedDonation._id
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {reservingDonationId === selectedDonation._id ? 'Reserving...' : 'Reserve Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


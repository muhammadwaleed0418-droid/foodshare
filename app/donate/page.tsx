'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { NavbarClient } from '@/src/components/NavbarClient';

export default function DonatePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    donorName: '',
    email: '',
    phone: '',
    title: '',
    description: '',
    quantity: '',
    unit: 'kg',
    expiryDate: '',
    pickupLocation: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Session state:', { session, userId: session?.user?.id });
      
      if (!session?.user?.id) {
        const errorMsg = !session ? 'You must be logged in to submit a donation.' : 'User ID not found in session';
        setError(errorMsg);
        console.error(errorMsg);
        setLoading(false);
        return;
      }

      // Validate required fields
      if (!formData.title || !formData.quantity) {
        setError('Please fill in all required fields (Food Title and Quantity).');
        setLoading(false);
        return;
      }

      if (!formData.pickupLocation) {
        setError('Please provide a pickup location.');
        setLoading(false);
        return;
      }

      const payload = {
        donorId: session.user.id,
        title: formData.title,
        description: formData.description,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        expiryDate: formData.expiryDate,
        pickupLocation: formData.pickupLocation,
      };

      console.log('Submitting donation with payload:', payload);

      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('API Response:', { status: response.status, data });

      if (!response.ok) {
        const errorMsg = data.message || data.error || 'Failed to submit donation';
        throw new Error(errorMsg);
      }

      setSuccess(true);
      setFormData({
        donorName: '',
        email: '',
        phone: '',
        title: '',
        description: '',
        quantity: '',
        unit: 'kg',
        expiryDate: '',
        pickupLocation: '',
      });

      // Redirect to donations page after 2 seconds
      setTimeout(() => {
        router.push('/donations');
      }, 2000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to submit donation. Please try again.';
      setError(errorMsg);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <NavbarClient />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Donate Food</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Share surplus food with your community. Every donation makes a difference.
          </p>
        </div>

        {/* Not Logged In Message */}
        {!session && (
          <div className="mb-8 p-6 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <h3 className="text-yellow-800 dark:text-yellow-200 font-semibold mb-3">Login Required</h3>
            <p className="text-yellow-700 dark:text-yellow-300 mb-4">
              You must be logged in to submit a donation. Please login or create an account to continue.
            </p>
            <Link
              href="/auth/login"
              className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Login to Donate
            </Link>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-8 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 rounded-lg">
            <h3 className="text-green-800 dark:text-green-200 font-semibold mb-2">Thank You!</h3>
            <p className="text-green-700 dark:text-green-300">
              Your donation request has been submitted successfully. We'll verify your information and contact you shortly.
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Form */}
        {!success && session && (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 space-y-6">
            {/* Donor Information Section */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Donor Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="donorName"
                    placeholder="Your name"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:border-green-500"
                    value={formData.donorName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:border-green-500"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:border-green-500"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Food Details Section */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Food Details</h2>
              
              {/* Food Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Food Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g., Fresh Vegetables, Bakery Items, Cooked Meals"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:border-green-500"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description <span className="text-gray-500">(Optional)</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Describe the food items, condition, ingredients, and any allergen information..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:border-green-500 h-32 resize-none"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              {/* Quantity & Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    placeholder="10"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:border-green-500"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="0.1"
                    step="0.1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Unit
                  </label>
                  <select
                    name="unit"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:border-green-500"
                    value={formData.unit}
                    onChange={handleChange}
                  >
                    <option>kg</option>
                    <option>pieces</option>
                    <option>liters</option>
                    <option>boxes</option>
                    <option>plates</option>
                    <option>servings</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pickup Details Section */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Pickup Details</h2>
              
              {/* Expiry Date */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expiry/Best Before Date & Time <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  type="datetime-local"
                  name="expiryDate"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:border-green-500"
                  value={formData.expiryDate}
                  onChange={handleChange}
                />
              </div>

              {/* Pickup Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pickup Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pickupLocation"
                  placeholder="123 Main Street, City, State, Zip Code (or just address and city)"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:border-green-500"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Donation'}
              </button>
              <Link
                href="/"
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Note:</strong> After submitting this form, our team will verify your information and contact you to arrange the pickup. We appreciate your contribution to reducing food waste!
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

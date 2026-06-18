/**
 * Dashboard Layout
 * Shared layout for all dashboard routes with sidebar navigation
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/src/components/LogoutButton';

interface NavItem {
  name: string;
  href: string;
  icon: string;
  description?: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Determine user role from pathname
  const role = pathname.split('/')[2] as 'donor' | 'receiver' | 'admin' | 'moderator';

  const navItems: Record<string, NavItem[]> = {
    donor: [
      { name: 'Dashboard', href: '/dashboard/donor', icon: '📊' },
      { name: 'Add Donation', href: '/dashboard/donor/add', icon: '➕' },
      { name: 'Manage Donations', href: '/dashboard/donor/manage', icon: '📋' },
      { name: 'Settings', href: '/dashboard/donor/settings', icon: '⚙️' },
    ],
    receiver: [
      { name: 'Dashboard', href: '/dashboard/receiver', icon: '📊' },
      { name: 'Search Donations', href: '/dashboard/receiver/search', icon: '🔍' },
      { name: 'Reservations', href: '/dashboard/receiver/reservations', icon: '📦' },
      { name: 'Settings', href: '/dashboard/receiver/settings', icon: '⚙️' },
    ],
    moderator: [
      { name: 'Dashboard', href: '/dashboard/moderator', icon: '📊' },
      { name: 'Verify Donors', href: '/dashboard/moderator/verify', icon: '✅' },
      { name: 'Approve Listings', href: '/dashboard/moderator/approve', icon: '📝' },
      { name: 'Reports', href: '/dashboard/moderator/reports', icon: '🚩' },
      { name: 'Settings', href: '/dashboard/moderator/settings', icon: '⚙️' },
    ],
    admin: [
      { name: 'Dashboard', href: '/dashboard/admin', icon: '📊' },
      { name: 'Analytics', href: '/dashboard/admin/analytics', icon: '📈' },
      { name: 'Users', href: '/dashboard/admin/users', icon: '👥' },
      { name: 'Moderators', href: '/dashboard/admin/moderators', icon: '👮' },
      { name: 'Logs', href: '/dashboard/admin/logs', icon: '📜' },
      { name: 'Settings', href: '/dashboard/admin/settings', icon: '⚙️' },
    ],
  };

  const items = navItems[role] || [];
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:relative lg:z-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FS</span>
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white">FoodShare</span>
            </Link>
          </div>

          {/* Role Badge */}
          <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Current Role</p>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">{roleLabel}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <main className="lg:ml-0 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

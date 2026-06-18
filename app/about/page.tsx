'use client';

import Link from 'next/link';
import { NavbarClient } from '@/src/components/NavbarClient';
export default function About() {
  const team = [
    {
      name: 'Ameer Hamza',
      role: 'Team Member',
      image: '👨‍💼',
      bio: 'bsf2210485',
    },
    {
      name: 'Muhammad Usman',
      role: 'Team Member',
      image: '👨‍💼',
      bio: 'bsf2210519',
    },
    {
      name: 'Gulam Mustafa',
      role: 'Team Member',
      image: '👨‍💼',
      bio: 'bsf2210515',
    },
    {
      name: 'Moazam Mansoor',
      role: 'Team Member',
      image: '👨‍💼',
      bio: 'bsf2210498',
    },
    {
      name: 'Ayesha Jahangir',
      role: 'Team Member',
      image: '👩‍💼',
      bio: 'bsf2210490',
    },
  ];

  const values = [
    {
      icon: '🌱',
      title: 'Sustainability',
      description: 'Reducing environmental impact through food waste reduction',
    },
    {
      icon: '❤️',
      title: 'Community',
      description: 'Building stronger communities through sharing and collaboration',
    },
    {
      icon: '🤝',
      title: 'Transparency',
      description: 'Open and honest communication in all operations',
    },
    {
      icon: '⚡',
      title: 'Innovation',
      description: 'Using technology to solve real-world problems',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <NavbarClient />

      {/* Hero Section */}
      <section className="py-20 bg-linear-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About FoodShare
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Our mission is to reduce food waste and feed those in need through technology and community collaboration.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                FoodShare was founded with a simple yet powerful vision: to connect food donors with those who need it most.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                Every year, millions of tons of food go to waste while millions of people go hungry. This disconnect inspired us to create a platform that brings together donors, receivers, and NGOs.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Today, we're proud to have helped thousands of individuals and organizations make a tangible impact in their communities.
              </p>
            </div>
            <div className="bg-linear-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-3xl p-12 flex items-center justify-center">
              <div className="text-8xl">🌍</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
              >
                <div className="text-7xl mb-4">{member.image}</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-green-600 dark:text-green-400 font-semibold mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-linear-to-r from-green-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            Our Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
              <p className="text-5xl font-bold text-white mb-2">150K+</p>
              <p className="text-green-100">Meals Saved</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
              <p className="text-5xl font-bold text-white mb-2">50K+</p>
              <p className="text-green-100">Users Joined</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
              <p className="text-5xl font-bold text-white mb-2">200+</p>
              <p className="text-green-100">NGOs Connected</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Be part of a community making a real difference in reducing food waste.
          </p>
          <Link
            href="/auth/register"
            className="inline-block px-8 py-4 bg-linear-to-r from-green-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm">© 2024 FoodShare. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition">
                Terms
              </a>
              <a href="#" className="hover:text-white transition">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

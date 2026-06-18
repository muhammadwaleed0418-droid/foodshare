import Link from 'next/link';
import { NavbarClient } from '@/src/components/NavbarClient';
export default function Home() {
  const features = [
    {
      icon: '🎁',
      title: 'Donate Food',
      description: 'Share surplus food with those in need. Easy listing and pickup scheduling.',
    },
    {
      icon: '📦',
      title: 'Reserve Food',
      description: 'Browse available donations and reserve meals instantly.',
    },
    {
      icon: '✅',
      title: 'NGO Verification',
      description: 'Transparent verification system for NGOs and donors.',
    },
    {
      icon: '📍',
      title: 'Live Tracking',
      description: 'Track your donations in real-time from listing to delivery.',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Donations', icon: '🎁' },
    { value: '150K+', label: 'Meals Saved', icon: '🍽️' },
    { value: '200+', label: 'NGOs Connected', icon: '🤝' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <NavbarClient />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-300/20 dark:bg-green-900/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-300/20 dark:bg-blue-900/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Share Food,<br />
                <span className="bg-linear-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Save Lives</span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                🌱 <span className="font-semibold">Reduce Food Waste</span> - Transform surplus into opportunities
              </p>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                ❤️ <span className="font-semibold">Help Needy People</span> - Connect with those who need support
              </p>

              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Join our community-driven platform connecting food donors with receivers. Every donation creates impact.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/donate"
                  className="px-8 py-4 bg-linear-to-r from-green-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition inline-block text-center"
                >
                  Start Donating →
                </Link>
                <Link
                  href="/donations"
                  className="px-8 py-4 border-2 border-green-500 text-green-600 dark:text-green-400 font-semibold rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition inline-block text-center"
                >
                  Browse Donations
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-8">
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">50K+</p>
                  <p className="text-gray-600 dark:text-gray-400">Active Users</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">🌍</p>
                  <p className="text-gray-600 dark:text-gray-400">Nationwide</p>
                </div>
              </div>
            </div>

            {/* Hero Illustration */}
            <div className="relative h-96 lg:h-full">
              <div className="absolute inset-0 bg-linear-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-3xl blur"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4 h-96">
                  <div className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 flex items-center justify-center text-6xl">
                    🥬
                  </div>
                  <div className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-4 flex items-center justify-center text-6xl">
                    🍎
                  </div>
                  <div className="bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-4 flex items-center justify-center text-6xl">
                    🥖
                  </div>
                  <div className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4 flex items-center justify-center text-6xl">
                    🍜
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How FoodShare Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Four simple steps to make a difference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 hover:shadow-lg transition border border-gray-200 dark:border-gray-700"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-linear-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8 text-center border border-green-200 dark:border-green-700"
              >
                <div className="text-6xl mb-4">{stat.icon}</div>
                <p className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </p>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of donors and receivers already sharing food and creating impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-white text-green-600 font-semibold rounded-xl hover:shadow-lg transition"
            >
              Join Now
            </Link>
            <Link
              href="/donations"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition"
            >
              Explore Donations
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">FoodShare</h3>
              <p className="text-sm">Reducing food waste and feeding communities.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/donations" className="hover:text-white transition">
                    Donations
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white transition">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:text-white transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm">© 2024 FoodShare. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">
                Twitter
              </a>
              <a href="#" className="hover:text-white transition">
                Facebook
              </a>
              <a href="#" className="hover:text-white transition">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

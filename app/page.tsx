import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <header className="bg-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold">RouteSort</h1>
          <p className="text-green-100 mt-2">Smart Waste Pickup System</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome to RouteSort
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Optimize your waste collection with our intelligent routing system.
              Choose your role to get started:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Citizen App */}
            <Link href="/citizen">
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500">
                <div className="text-4xl mb-4">👤</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Citizen App
                </h3>
                <p className="text-gray-600">
                  Schedule pickups, get recycling guidance, and manage your waste collection.
                </p>
                <div className="mt-4 text-green-600 font-semibold">
                  Get Started →
                </div>
              </div>
            </Link>

            {/* Driver App */}
            <Link href="/driver">
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
                <div className="text-4xl mb-4">🚛</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Driver App
                </h3>
                <p className="text-gray-600">
                  Follow optimized routes, confirm stops, and manage your daily pickups.
                </p>
                <div className="mt-4 text-blue-600 font-semibold">
                  Get Started →
                </div>
              </div>
            </Link>

            {/* Coordinator Dashboard */}
            <Link href="/coordinator">
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-500">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Coordinator Dashboard
                </h3>
                <p className="text-gray-600">
                  Manage fleet, requests, and routes in real-time with analytics.
                </p>
                <div className="mt-4 text-purple-600 font-semibold">
                  Get Started →
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Key Features
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Smart route optimization for efficient waste collection</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Real-time tracking and management</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>AI-powered recycling guidance via photo upload</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Interactive maps powered by OpenStreetMap</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Secure authentication and role-based access</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 RouteSort. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

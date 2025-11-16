import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function CoordinatorPage() {
  return (
    <div>
      <SignedOut>
        <div className="max-w-2xl mx-auto text-center py-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Coordinator Dashboard
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Please sign in to manage fleet, requests, and routes.
          </p>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Coordinator Dashboard
          </h1>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                Active Drivers
              </h3>
              <p className="text-4xl font-bold text-purple-600">12</p>
              <p className="text-xs text-gray-500 mt-2">+2 from yesterday</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                Pending Requests
              </h3>
              <p className="text-4xl font-bold text-orange-600">28</p>
              <p className="text-xs text-gray-500 mt-2">4 urgent</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                Today's Routes
              </h3>
              <p className="text-4xl font-bold text-blue-600">8</p>
              <p className="text-xs text-gray-500 mt-2">6 completed</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                Fleet Efficiency
              </h3>
              <p className="text-4xl font-bold text-green-600">94%</p>
              <p className="text-xs text-gray-500 mt-2">Above target</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link href="/coordinator/requests">
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Manage Requests
                </h3>
                <p className="text-gray-600">
                  Review and assign pickup requests to drivers
                </p>
              </div>
            </Link>

            <Link href="/coordinator/routes">
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
                <div className="text-4xl mb-4">🗺️</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Route Planning
                </h3>
                <p className="text-gray-600">
                  Create and optimize collection routes
                </p>
              </div>
            </Link>

            <Link href="/coordinator/fleet">
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
                <div className="text-4xl mb-4">🚛</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Fleet Management
                </h3>
                <p className="text-gray-600">
                  Monitor and manage your vehicle fleet
                </p>
              </div>
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Recent Requests
              </h2>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border-l-4 border-purple-500 pl-4 py-2 bg-gray-50"
                  >
                    <div>
                      <p className="font-semibold">Request #{1000 + i}</p>
                      <p className="text-sm text-gray-600">
                        123 Main St - Recyclable
                      </p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Active Routes
              </h2>
              <div className="space-y-3">
                {[
                  { name: "North District AM", driver: "John Doe", progress: 75 },
                  { name: "South District AM", driver: "Jane Smith", progress: 50 },
                  { name: "East District PM", driver: "Bob Johnson", progress: 30 },
                ].map((route, i) => (
                  <div
                    key={i}
                    className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{route.name}</p>
                        <p className="text-sm text-gray-600">Driver: {route.driver}</p>
                      </div>
                      <span className="text-sm font-semibold text-blue-600">
                        {route.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${route.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}

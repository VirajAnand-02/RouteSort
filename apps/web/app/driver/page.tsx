import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function DriverPage() {
  return (
    <div>
      <SignedOut>
        <div className="max-w-2xl mx-auto text-center py-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Driver Portal
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Please sign in to access your routes and pickups.
          </p>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Driver Dashboard
          </h1>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Today's Routes
              </h3>
              <p className="text-4xl font-bold text-blue-600">2</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Completed Stops
              </h3>
              <p className="text-4xl font-bold text-green-600">8/15</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Remaining Distance
              </h3>
              <p className="text-4xl font-bold text-gray-800">12.5 km</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Active Route
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Route Name:</span>
                  <span className="font-semibold">North District AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Status:</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total Stops:</span>
                  <span className="font-semibold">15</span>
                </div>
                <Link href="/driver/routes">
                  <button className="w-full mt-4 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
                    View Route Details
                  </button>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Next Stop
              </h2>
              <div className="space-y-3">
                <p className="font-semibold text-lg">123 Main Street</p>
                <p className="text-gray-600">Waste Type: Recyclable</p>
                <p className="text-gray-600">ETA: 10 minutes</p>
                <button className="w-full mt-4 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors">
                  Mark as Arrived
                </button>
                <button className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors">
                  Skip Stop
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">🗺️</div>
                <h3 className="font-semibold mb-2">Follow Route</h3>
                <p className="text-sm text-gray-600">
                  Use the optimized route on the map
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">📍</div>
                <h3 className="font-semibold mb-2">Navigate to Stops</h3>
                <p className="text-sm text-gray-600">
                  Follow turn-by-turn navigation
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="font-semibold mb-2">Confirm Pickups</h3>
                <p className="text-sm text-gray-600">
                  Mark each stop as completed
                </p>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}

import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function CitizenPage() {
  return (
    <div>
      <SignedOut>
        <div className="max-w-2xl mx-auto text-center py-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Citizen Portal
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Please sign in to schedule pickups and access recycling guidance.
          </p>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Citizen Dashboard
          </h1>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link href="/citizen/schedule">
                  <button className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors">
                    Schedule a Pickup
                  </button>
                </Link>
                <Link href="/citizen/recycling">
                  <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
                    Recycling Guidance
                  </button>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Recent Pickups
              </h2>
              <p className="text-gray-600">
                View your pickup history and scheduled pickups here.
              </p>
              <div className="mt-4 space-y-2">
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <p className="font-semibold">Next Pickup</p>
                  <p className="text-sm text-gray-600">
                    Check your schedule for upcoming pickups
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">📅</div>
                <h3 className="font-semibold mb-2">Schedule Pickup</h3>
                <p className="text-sm text-gray-600">
                  Choose a date and time that works for you
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">📸</div>
                <h3 className="font-semibold mb-2">Get Guidance</h3>
                <p className="text-sm text-gray-600">
                  Upload photos for recycling guidance
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="font-semibold mb-2">Track Status</h3>
                <p className="text-sm text-gray-600">
                  Monitor your pickup in real-time
                </p>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}

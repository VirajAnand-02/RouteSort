"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const RouteMap = dynamic(() => import("./components/RouteMap"), { ssr: false });

export default function DriverRoutesPage() {
  const [selectedRoute, setSelectedRoute] = useState<number | null>(1);

  // Mock route data
  const routes = [
    {
      id: 1,
      name: "North District AM",
      date: "2024-11-16",
      status: "active",
      stops: [
        { id: 1, address: "123 Main St", lat: 40.7128, lng: -74.0060, status: "completed" },
        { id: 2, address: "456 Oak Ave", lat: 40.7138, lng: -74.0070, status: "completed" },
        { id: 3, address: "789 Pine Rd", lat: 40.7148, lng: -74.0080, status: "pending" },
        { id: 4, address: "321 Elm St", lat: 40.7158, lng: -74.0090, status: "pending" },
      ],
    },
    {
      id: 2,
      name: "South District PM",
      date: "2024-11-16",
      status: "planned",
      stops: [
        { id: 5, address: "111 Maple Dr", lat: 40.7068, lng: -74.0050, status: "pending" },
        { id: 6, address: "222 Cedar Ln", lat: 40.7078, lng: -74.0040, status: "pending" },
      ],
    },
  ];

  const activeRoute = routes.find((r) => r.id === selectedRoute);

  const handleStopComplete = (stopId: number) => {
    console.log("Marking stop as complete:", stopId);
    // In a real app, this would call an API to update the stop status
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Routes</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Route List */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Today's Routes
            </h2>
            <div className="space-y-3">
              {routes.map((route) => (
                <div
                  key={route.id}
                  onClick={() => setSelectedRoute(route.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedRoute === route.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{route.name}</h3>
                      <p className="text-sm text-gray-600">
                        {route.stops.length} stops
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        route.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {route.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stop List */}
          {activeRoute && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Route Stops
              </h2>
              <div className="space-y-3">
                {activeRoute.stops.map((stop, index) => (
                  <div
                    key={stop.id}
                    className="p-4 border-l-4 border-blue-500 bg-gray-50 rounded-r-md"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-semibold text-gray-700">
                          Stop {index + 1}
                        </span>
                        <p className="text-sm text-gray-800">{stop.address}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          stop.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {stop.status}
                      </span>
                    </div>
                    {stop.status === "pending" && (
                      <button
                        onClick={() => handleStopComplete(stop.id)}
                        className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Route Map</h2>
          <div className="h-[600px] rounded-lg overflow-hidden">
            {activeRoute && <RouteMap route={activeRoute} />}
          </div>
        </div>
      </div>
    </div>
  );
}

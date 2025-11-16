"use client";

import { useState } from "react";

export default function RoutesPage() {
  const routes = [
    {
      id: 1,
      name: "North District AM",
      driver: "John Doe",
      date: "2024-11-16",
      stops: 15,
      status: "active",
      distance: "25 km",
    },
    {
      id: 2,
      name: "South District AM",
      driver: "Jane Smith",
      date: "2024-11-16",
      stops: 12,
      status: "active",
      distance: "18 km",
    },
    {
      id: 3,
      name: "East District PM",
      driver: "Unassigned",
      date: "2024-11-16",
      stops: 10,
      status: "planned",
      distance: "22 km",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Route Management</h1>
        <button className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors font-semibold">
          Create New Route
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">
            Total Routes Today
          </h3>
          <p className="text-4xl font-bold text-purple-600">{routes.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">
            Active Routes
          </h3>
          <p className="text-4xl font-bold text-green-600">
            {routes.filter((r) => r.status === "active").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">
            Total Distance
          </h3>
          <p className="text-4xl font-bold text-blue-600">65 km</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Driver
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stops
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Distance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {routes.map((route) => (
              <tr key={route.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {route.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {route.driver}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {route.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {route.stops}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {route.distance}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      route.status === "active"
                        ? "bg-green-100 text-green-800"
                        : route.status === "planned"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {route.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-purple-600 hover:text-purple-800 font-semibold mr-3">
                    View
                  </button>
                  <button className="text-blue-600 hover:text-blue-800 font-semibold">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

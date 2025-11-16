"use client";

import { useState } from "react";

export default function FleetPage() {
  const vehicles = [
    {
      id: 1,
      number: "WM-001",
      driver: "John Doe",
      type: "Compactor",
      status: "on_route",
      capacity: "8 tons",
    },
    {
      id: 2,
      number: "WM-002",
      driver: "Jane Smith",
      type: "Compactor",
      status: "on_route",
      capacity: "8 tons",
    },
    {
      id: 3,
      number: "WM-003",
      driver: "Unassigned",
      type: "Flatbed",
      status: "available",
      capacity: "5 tons",
    },
    {
      id: 4,
      number: "WM-004",
      driver: "Bob Johnson",
      type: "Compactor",
      status: "maintenance",
      capacity: "8 tons",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Fleet Management</h1>
        <button className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors font-semibold">
          Add Vehicle
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">
            Total Vehicles
          </h3>
          <p className="text-4xl font-bold text-purple-600">{vehicles.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">
            On Route
          </h3>
          <p className="text-4xl font-bold text-green-600">
            {vehicles.filter((v) => v.status === "on_route").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">
            Available
          </h3>
          <p className="text-4xl font-bold text-blue-600">
            {vehicles.filter((v) => v.status === "available").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">
            Maintenance
          </h3>
          <p className="text-4xl font-bold text-orange-600">
            {vehicles.filter((v) => v.status === "maintenance").length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Driver
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacity
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
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {vehicle.number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {vehicle.driver}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {vehicle.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {vehicle.capacity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      vehicle.status === "on_route"
                        ? "bg-green-100 text-green-800"
                        : vehicle.status === "available"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {vehicle.status.replace("_", " ")}
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

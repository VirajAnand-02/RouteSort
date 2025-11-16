"use client";

import { useState } from "react";

export default function RequestsPage() {
  const [filter, setFilter] = useState("all");

  const requests = [
    {
      id: 1001,
      address: "123 Main St",
      wasteType: "Recyclable",
      status: "pending",
      date: "2024-11-16",
      timeSlot: "morning",
    },
    {
      id: 1002,
      address: "456 Oak Ave",
      wasteType: "General Waste",
      status: "scheduled",
      date: "2024-11-16",
      timeSlot: "afternoon",
    },
    {
      id: 1003,
      address: "789 Pine Rd",
      wasteType: "Organic",
      status: "pending",
      date: "2024-11-17",
      timeSlot: "morning",
    },
  ];

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter((r) => r.status === filter);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Pickup Requests
      </h1>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md font-semibold ${
              filter === "all"
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All Requests ({requests.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-md font-semibold ${
              filter === "pending"
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("scheduled")}
            className={`px-4 py-2 rounded-md font-semibold ${
              filter === "scheduled"
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Scheduled
          </button>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Request ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Waste Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
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
            {filteredRequests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{request.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {request.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {request.wasteType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {request.date} ({request.timeSlot})
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      request.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : request.status === "scheduled"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-purple-600 hover:text-purple-800 font-semibold mr-3">
                    Assign
                  </button>
                  <button className="text-blue-600 hover:text-blue-800 font-semibold">
                    Details
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

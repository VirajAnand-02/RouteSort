"use client";

import { useState } from "react";

export default function RecyclingGuidePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<string | null>(null);

  const recyclingGuides = [
    {
      item: "Plastic Bottle",
      category: "Plastic",
      recyclable: true,
      instructions: "Rinse and remove cap before recycling",
    },
    {
      item: "Glass Jar",
      category: "Glass",
      recyclable: true,
      instructions: "Clean and remove labels",
    },
    {
      item: "Pizza Box",
      category: "Paper",
      recyclable: false,
      instructions: "Grease-stained boxes cannot be recycled",
    },
    {
      item: "Aluminum Can",
      category: "Metal",
      recyclable: true,
      instructions: "Rinse before recycling",
    },
    {
      item: "Styrofoam",
      category: "Plastic",
      recyclable: false,
      instructions: "Not accepted in most recycling programs",
    },
    {
      item: "Newspaper",
      category: "Paper",
      recyclable: true,
      instructions: "Keep dry and bundle together",
    },
  ];

  const filteredGuides = recyclingGuides.filter(
    (guide) =>
      guide.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    // Simulate AI processing
    setUploadResult("Analyzing image...");
    setTimeout(() => {
      setUploadResult(
        "This appears to be a plastic bottle. It is recyclable! Please rinse and remove the cap before recycling."
      );
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Recycling Guidance
      </h1>

      {/* Photo Upload Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Upload Photo for AI Guidance
        </h2>
        <p className="text-gray-600 mb-4">
          Take a photo of your waste item and get instant recycling guidance powered by AI.
        </p>
        
        <div className="flex gap-4 items-start">
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {selectedFile && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
          <button
            onClick={handleUpload}
            disabled={!selectedFile}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Analyze
          </button>
        </div>

        {uploadResult && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-800">{uploadResult}</p>
          </div>
        )}
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Search Recycling Guide
        </h2>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for an item or category..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Recycling Guide List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recycling Guide Database
        </h2>
        
        <div className="space-y-4">
          {filteredGuides.map((guide, index) => (
            <div
              key={index}
              className={`border-l-4 ${
                guide.recyclable ? "border-green-500" : "border-red-500"
              } p-4 bg-gray-50 rounded-r-md`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {guide.item}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Category: {guide.category}
                  </p>
                  <p className="mt-2 text-gray-700">{guide.instructions}</p>
                </div>
                <div>
                  {guide.recyclable ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      ♻️ Recyclable
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                      ❌ Not Recyclable
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGuides.length === 0 && (
          <p className="text-gray-600 text-center py-8">
            No items found. Try a different search term.
          </p>
        )}
      </div>
    </div>
  );
}

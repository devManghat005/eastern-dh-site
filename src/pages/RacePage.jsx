import React from "react";
import { useNavigate } from "react-router-dom";

export default function RacePage() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col items-center justify-center">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 px-4 py-2 bg-black text-white rounded-lg"
      >
        ← Back
      </button>

      <div className="bg-white w-[420px] p-6 rounded-xl shadow-xl border text-center">
        <h1 className="text-2xl font-semibold mb-2">Race Explorer</h1>
        <p className="text-gray-700 text-sm">
          Here you can visualize and analyze race data. Charts, counts, and insights will go here.
        </p>
      </div>
    </div>
  );
}

// src/Components/ObservationInfoCard.js
import React, { useState, useEffect } from "react";

const ObservationInfoCard = () => {
  const [observation, setObservation] = useState({
    target: "M31 (Andromeda Galaxy)",
    currentExposure: 0,
    totalExposures: 10,
  });
  const [loading, setLoading] = useState(true);

  const fetchObservation = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/observation");
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setObservation(data);
    } catch (err) {
      console.warn("Backend not connected, using default values.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObservation();
    const interval = setInterval(fetchObservation, 5000);
    return () => clearInterval(interval);
  }, []);

  const { target, currentExposure, totalExposures } = observation;
  const progress = Math.round((currentExposure / totalExposures) * 100);

  return (
    <div className="w-full p-4 rounded-2xl shadow-xl bg-gradient-to-br from-[#0a1b2d]/90 to-[#1e3a56]/90 border border-[#2b4a78]/40 backdrop-blur-md flex flex-col gap-4">
      
      {/* Header */}
      <h2 className="text-lg font-semibold text-gray-200">Observation Info</h2>

      {/* Target Section */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">Target</span>
        <span className="text-gray-100 font-medium">{target}</span>
      </div>

      {/* Exposure Section */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">Exposure</span>
        <span className="text-gray-100 font-medium">
          {currentExposure} / {totalExposures}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Status */}
      <div className="text-xs text-gray-400 text-center">
        {loading
          ? "Loading..."
          : currentExposure < totalExposures
          ? `Capturing exposures...`
          : "All exposures completed ✅"}
      </div>
    </div>
  );
};

export default ObservationInfoCard;

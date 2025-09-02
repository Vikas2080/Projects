import React from "react";

const EnvironmentCard = () => {
  return (
    <div className="relative w-full h-[calc(100vh/3)] p-4 rounded-3xl shadow-2xl bg-gradient-to-br from-[#0a1b2d]/90 to-[#1e3a56]/90 border border-[#2b4a78]/40 backdrop-blur-xl overflow-hidden flex flex-col">
      
      {/* Title */}
      <h2 className="text-xl font-extrabold text-white mb-2 border-b border-[#2b4a78]/50 pb-1 tracking-wide">
        Environment
      </h2>

      {/* Key-Value Pairs */}
      <div className="flex-1 flex flex-col justify-between text-sm text-white space-y-1">
        <div className="flex justify-between text-gray-400/70">
          <span>Outside temp</span>
          <span className="text-white">--</span>
        </div>
        <div className="flex justify-between text-gray-400/70">
          <span>Humidity</span>
          <span className="text-white">--</span>
        </div>
        <div className="flex justify-between text-gray-400/70">
          <span>Wind</span>
          <span className="text-white">--</span>
        </div>
        <div className="flex justify-between text-gray-400/70">
          <span>Cloud detection</span>
          <span className="text-white">--</span>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentCard;

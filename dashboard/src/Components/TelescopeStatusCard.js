import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const TelescopeStatusCard = () => {
  const [status, setStatus] = useState({
    ra: "--",
    dec: "--",
    tracking: "--",
    dome_state: "--",
    mount_mode: "--",
    weather: "--",
    timestamp: "--",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/api/data/latest`);
        if (!res.ok) throw new Error("Failed to fetch telescope status");

        const data = await res.json();
        setStatus((prev) => ({
          ...prev, // keep old values for extra fields
          ra: data.ra !== undefined ? Number(data.ra).toFixed(5) : "--",
          dec: data.dec !== undefined ? Number(data.dec).toFixed(5) : "--",
          timestamp: data.timestamp ?? "--",
        }));
        setError("");
      } catch (err) {
        console.error("Error fetching telescope status:", err);
        setError("Could not load status");
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 2000); // refresh every 2 sec
    return () => clearInterval(interval);
  }, []);

  const renderRow = (label, value, highlight = false) => (
    <div className="flex justify-between text-gray-400/70">
      <span>{label}</span>
      <span className={highlight ? "text-green-400 font-semibold" : "text-white"}>
        {value}
      </span>
    </div>
  );

  return (
    <div className="relative w-full max-h-[400px] p-4 rounded-3xl shadow-2xl bg-gradient-to-br from-[#0a1b2d]/90 to-[#1e3a56]/90 border border-[#2b4a78]/40 backdrop-blur-xl overflow-hidden flex flex-col">
      <h2 className="text-xl font-extrabold text-white mb-2 border-b border-[#2b4a78]/50 pb-1 tracking-wide">
        Telescope Status
      </h2>

      <div className="flex-1 flex flex-col justify-center text-sm text-white space-y-2">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <>
            {renderRow("RA (deg)", status.ra, true)}
            {renderRow("DEC (deg)", status.dec, true)}
            {renderRow("Tracking", status.tracking)}
            {renderRow("Dome state", status.dome_state)}
            {renderRow("Mount mode", status.mount_mode)}
            {renderRow("Weather", status.weather)}
            {renderRow("Timestamp", status.timestamp)}
          </>
        )}
      </div>
    </div>
  );
};

export default TelescopeStatusCard;

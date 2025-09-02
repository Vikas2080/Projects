import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [utcTime, setUtcTime] = useState("");
  const [lstTime, setLstTime] = useState("");
  const [username, setUsername] = useState("");

  const calculateLST = (date, longitude) => {
    const JD = date.getTime() / 86400000 + 2440587.5;
    const D = JD - 2451545.0;
    let GMST = 18.697374558 + 24.06570982441908 * D;
    GMST = GMST % 24;
    let LST = GMST + longitude / 15;
    if (LST < 0) LST += 24;
    if (LST >= 24) LST -= 24;
    return LST;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      // store name
      setUsername(parsedUser.firstname || parsedUser.username);

      // ⏳ check session expiry
      if (parsedUser.accessEnd) {
        const endTime = new Date(`1970-01-01T${parsedUser.accessEnd}Z`);
        const checkExpiry = setInterval(() => {
          const now = new Date();
          const currentUTC = new Date(
            `1970-01-01T${now.toISOString().split("T")[1].split(".")[0]}Z`
          );

          if (currentUTC > endTime) {
            alert("⏳ Session expired. Please login again.");
            localStorage.removeItem("user");
            clearInterval(checkExpiry);
            window.location.href = "/";
          }
        }, 1000);

        return () => clearInterval(checkExpiry);
      }
    }

    // 🌍 longitude setup
    let longitude = 0;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        longitude = pos.coords.longitude;
      },
      () => {
        longitude = 79.0193; // Default longitude
      }
    );

    const updateTime = () => {
      const now = new Date();
      const utc = now.toUTCString().split(" ")[4];
      setUtcTime(utc);

      const lstHours = calculateLST(now, longitude);
      const lstH = Math.floor(lstHours);
      const lstM = Math.floor((lstHours - lstH) * 60);
      const lstS = Math.floor(((lstHours - lstH) * 60 - lstM) * 60);

      const lstFormatted = `${lstH.toString().padStart(2, "0")}:${lstM
        .toString()
        .padStart(2, "0")}:${lstS.toString().padStart(2, "0")}`;
      setLstTime(lstFormatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#0f2537] to-[#16334a] border-b border-[#1c3b5a]/40 shadow-lg px-4 sm:px-8 py-3 backdrop-blur-md bg-opacity-95">
      <div className="flex flex-col sm:grid sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-4 w-full">
        
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3 justify-center sm:justify-start mb-2 sm:mb-0">
          <img
            src="https://www.aries.res.in/dot/DOT_logo3_crop.png"
            alt="Aries"
            className="w-10 h-10 rounded-full shadow-md"
          />
          <span className="text-lg sm:text-xl font-semibold tracking-wide text-gray-100 text-center sm:text-left">
            3.6m Devasthal Optical Telescope (DOT)
          </span>
        </div>

        {/* Center: Time */}
        <div className="flex justify-center flex-wrap gap-4 text-gray-200 font-mono text-xl sm:text-base mb-2 sm:mb-0">
          <span className="flex items-center gap-1">
            <span className="font-bold text-xl">{utcTime}</span>
            <span className="text-gray-400"> UTC</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="ffont-bold text-xl">{lstTime}</span>
            <span className="text-gray-400"> LST</span>
          </span>
        </div>

        {/* Right: User + Logout */}
        <div className="flex items-center gap-4 justify-center sm:justify-end">
          <span className="text-blue-300 font-medium">
            {username || "Guest"}
          </span>
          <button
            onClick={() => {
              localStorage.removeItem("user"); 
              window.location.href = "/";
            }}
            className="bg-gradient-to-r from-[#1c3b5a] to-[#274d6d] hover:from-[#274d6d] hover:to-[#32638c] text-gray-100 font-medium transition-all duration-200 px-5 py-2 rounded-xl shadow-md hover:shadow-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

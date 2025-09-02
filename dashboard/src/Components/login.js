import React, { useState, useEffect } from "react";
import { login } from "./api";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Lock } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const timeToMinutes = (timeStr) => {
    if (!timeStr) return null;
    const [h, m, s] = timeStr.split(":").map(Number);
    return h * 60 + m + (s ? Math.floor(s / 60) : 0);
  };

  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  useEffect(() => {
    if (location.state?.expired) {
      setMessage("Your session has expired. Please log in again.");
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // Call backend login
      const { user: loggedInUser } = await login(username, password);

      console.log("🔎 Backend login response:", loggedInUser);

      if (!loggedInUser) {
        setMessage("Invalid response from server.");
        return;
      }

      // ADMIN LOGIN CHECK
      if (isAdmin) {
        if (
          !loggedInUser.role ||
          loggedInUser.role.toString().toLowerCase() !== "admin"
        ) {
          setMessage("Access denied: You are not an admin.");
          return;
        }
        localStorage.setItem(
          "user",
          JSON.stringify({ ...loggedInUser, loginTime: Date.now() })
        );
        navigate("/admin");
        return;
      }

      // USER LOGIN CHECKS
      const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
      const accessStart = timeToMinutes(loggedInUser.accessstart);
      const accessEnd = timeToMinutes(loggedInUser.accessend);

      if (accessStart !== null && accessEnd !== null) {
        if (nowMinutes < accessStart || nowMinutes > accessEnd) {
          setMessage("Access denied: outside allowed time window.");
          return;
        }
      }

      const today = getToday();
      if (loggedInUser.access_dates?.length > 0) {
        if (!loggedInUser.access_dates.includes(today)) {
          setMessage("Access denied: today is not allowed.");
          return;
        }
      }

      localStorage.setItem(
        "user",
        JSON.stringify({ ...loggedInUser, loginTime: Date.now() })
      );
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setMessage(err.message || "Login failed");
    }
  };

  return (
    <div className="relative flex justify-center items-center h-screen overflow-hidden">
      {/* Backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-700 animate-gradientBackground opacity-70"></div>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/821644/pexels-photo-821644.jpeg')",
        }}
      ></div>

      {/* Login Card */}
      <div className="relative bg-white/20 backdrop-blur-lg border border-white/30 p-10 rounded-3xl shadow-2xl w-96 flex flex-col items-center animate-fadeIn z-10">
        <img
          src="https://www.aries.res.in/dot/DOT_logo3_crop.png"
          alt="Logo"
          className="w-24 h-24 mb-4 drop-shadow-lg"
        />
        <h2 className="text-3xl font-extrabold text-white mb-6 tracking-wide">
          {isAdmin ? "Admin Login" : "User Login"}
        </h2>

        <form onSubmit={handleLogin} className="w-full space-y-5">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 pl-10 rounded-xl border border-white/40 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pl-10 rounded-xl border border-white/40 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-700 hover:from-blue-600 hover:to-indigo-800 text-white font-semibold p-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            {isAdmin ? "Login as Admin" : "Login"}
          </button>
        </form>

        <button
          onClick={() => setIsAdmin(!isAdmin)}
          className="mt-4 text-sm text-yellow-200 hover:underline"
        >
          {isAdmin ? "Switch to User Login" : "Login as Admin"}
        </button>

        {message && (
          <p className="mt-4 text-center text-yellow-200 font-medium animate-fadeInDelay">
            {message}
          </p>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from {opacity:0;transform:translateY(-10px);} to {opacity:1;transform:translateY(0);} }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        .animate-fadeInDelay { animation: fadeIn 1s ease-out forwards; }

        @keyframes gradientBackground { 0% {background-position:0% 50%;} 50% {background-position:100% 50%;} 100% {background-position:0% 50%;} }
        .animate-gradientBackground { background-size:200% 200%; animation:gradientBackground 15s ease infinite; }
      `}</style>
    </div>
  );
};

export default Login;

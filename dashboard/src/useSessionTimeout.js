// src/useSessionTimeout.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useSessionTimeout() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = () => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) return; // no user logged in

      const now = new Date();
      const accessEnd = new Date(user.accessEnd); // stored when login success

      if (now > accessEnd) {
        // Session expired
        localStorage.removeItem("user"); // clear session
        alert("Session expired. Please log in again.");
        navigate("/login"); // redirect to login
      }
    };

   
    const interval = setInterval(checkSession, 10000);

    return () => clearInterval(interval);
  }, [navigate]);
}

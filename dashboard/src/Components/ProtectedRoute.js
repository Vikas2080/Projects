// src/Components/ProtectedRoute.js
import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";

// Safely parse "HH:mm:ss" or "HH:mm" to minutes (ignore seconds)
const parseMinutes = (t) => {
  if (!t || typeof t !== "string") return null;
  const [h, m] = t.split(":");
  const H = parseInt(h, 10);
  const M = parseInt(m ?? "0", 10);
  if (Number.isNaN(H) || Number.isNaN(M)) return null;
  return H * 60 + M;
};

// Support normal and overnight windows
const isWithinWindow = (now, start, end) => {
  if (start == null || end == null) return true; // no restriction
  if (start <= end) return now >= start && now <= end; // same day window
  return now >= start || now <= end; // overnight, e.g. 22:00–06:00
};

export default function ProtectedRoute({ children }) {
  const [redirect, setRedirect] = useState(false);

  // Core check (used on first render and in the interval)
  const checkAllowed = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return false;

    let user;
    try {
      user = JSON.parse(userStr);
    } catch {
      return false;
    }

    // Accept multiple possible key casings from backend
    const startStr =
      user.accessstart ?? user.accessStart ?? user.access_start ?? null;
    const endStr = user.accessend ?? user.accessEnd ?? user.access_end ?? null;

    const start = parseMinutes(startStr);
    const end = parseMinutes(endStr);

    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();

    const ok = isWithinWindow(nowMin, start, end);
    if (!ok) {
      localStorage.removeItem("user");
    }
    return ok;
  };

  // Evaluate once on initial render so we can block immediately
  const okOnFirstRender = useMemo(() => checkAllowed(), []);

  useEffect(() => {
    if (!okOnFirstRender) {
      setRedirect(true);
      return;
    }
    // Re-check every 1s while the user is on the page
    const id = setInterval(() => {
      if (!checkAllowed()) {
        setRedirect(true);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [okOnFirstRender]);

  if (redirect || !okOnFirstRender) {
    return <Navigate to="/" replace state={{ expired: true }} />;
  }

  return children;
}

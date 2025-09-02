import express from "express";
import fs from "fs";
import csvParser from "csv-parser";

const router = express.Router();

// ✅ Helper: load all users from CSV
function loadUsers() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream("users.csv")
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

// ✅ Regular user login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = await loadUsers();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // ✅ Admin bypass
    if (user.role && user.role.toLowerCase() === "admin") {
      return res.json({ message: "Login successful (admin)", user });
    }

    const today = new Date().toISOString().split("T")[0];
    let accessDates = (user.access_dates || "").trim();

    console.log("DEBUG user:", user.username, "access_dates:", JSON.stringify(accessDates));

    // ✅ Deny login if no access dates provided
    if (!accessDates || accessDates.toLowerCase() === "undefined") {
      return res.status(403).json({ error: "No access dates assigned" });
    }

    const allowedDates = accessDates
      .split(";")
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    if (!allowedDates.includes(today)) {
      return res.status(403).json({ error: "Access not allowed for today" });
    }

    // ✅ Time-based restriction
    if (user.accessstart && user.accessend) {
      const now = new Date();
      const [startH, startM] = user.accessstart.split(":").map(Number);
      const [endH, endM] = user.accessend.split(":").map(Number);

      const start = new Date();
      start.setHours(startH, startM, 0, 0);

      const end = new Date();
      end.setHours(endH, endM, 0, 0);

      if (now < start || now > end) {
        return res.status(403).json({ error: "Access not allowed at this time" });
      }
    }

    res.json({ message: "Login successful", user });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Admin login
router.post("/admin-login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = await loadUsers();
    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    if (user.role.toLowerCase() !== "admin") {
      return res.status(403).json({ error: "Not an admin" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.json({ message: "Admin login successful", user });
  } catch (err) {
    console.error("❌ Admin login error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

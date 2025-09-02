import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

import usersRouter from "./routes/users.js";
import dataRouter from "./routes/data.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", usersRouter);
app.use("/api/data", dataRouter);

// File path to your log
const LOG_FILE = path.join(process.cwd(), "20250824_tcs_params.log");

// Endpoint to get latest telescope data
app.get("/api/telescope/latest", (req, res) => {
  try {
    if (!fs.existsSync(LOG_FILE)) {
      return res.status(404).json({ error: "Log file not found" });
    }

    const lines = fs.readFileSync(LOG_FILE, "utf-8").trim().split("\n");
    const lastLine = lines[lines.length - 1]; // get latest entry

    // Format: timestamp, ra_hms, dec_dms, ra_deg, dec_deg, ...
    const parts = lastLine.split(",").map((p) => p.trim());

    const result = {
      timestamp: parts[0] || "--",
      ra: parts[3] ? parseFloat(parts[3]).toFixed(6) : "--",   // RA deg
      dec: parts[4] ? parseFloat(parts[4]).toFixed(6) : "--",  // DEC deg
    };

    res.json(result);
  } catch (err) {
    console.error("Error reading log file:", err);
    res.status(500).json({ error: "Failed to read log file" });
  }
});

app.get("/", (req, res) => res.send("Backend is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

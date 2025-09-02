import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

router.get("/latest", (req, res) => {
  try {
    // ✅ Generate today's date string (YYYYMMDD)
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}${mm}${dd}`;

    // ✅ Build the log file name
    const fileName = `${dateStr}_tcs_params.log`;
    const filePath = path.join(process.cwd(), fileName);

    // ✅ Read the file content
    const lines = fs.readFileSync(filePath, "utf-8").trim().split("\n");

    // ✅ Get the latest line (last entry)
    const lastLine = lines[lines.length - 1];

    // ✅ Split by comma and trim spaces
    const parts = lastLine.split(",").map((p) => p.trim());

    // ✅ Extract needed fields
    const timestamp = parts[0]; // first one
    const ra = parts[parts.length - 2]; // second last
    const dec = parts[parts.length - 1]; // last

    res.json({ timestamp, ra, dec });
  } catch (error) {
    console.error("Error reading log file:", error);
    res.status(500).json({ error: "Failed to read log file" });
  }
});

export default router;

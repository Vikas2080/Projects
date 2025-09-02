import express from "express";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { createObjectCsvWriter } from "csv-writer";

const router = express.Router();

// Path to CSV file
const usersFile = path.join(process.cwd(), "users.csv");

// CSV headers
const csvWriter = createObjectCsvWriter({
  path: usersFile,
  header: [
    { id: "id", title: "id" },
    { id: "firstname", title: "firstname" },
    { id: "lastname", title: "lastname" },
    { id: "username", title: "username" },
    { id: "password", title: "password" },
    { id: "role", title: "role" },
    { id: "accessstart", title: "accessstart" },
    { id: "accessend", title: "accessend" },
    { id: "access_dates", title: "access_dates" },
  ],
});

// Helper: Read users from CSV
function readUsers() {
  if (!fs.existsSync(usersFile)) return [];
  const data = fs.readFileSync(usersFile, "utf8");
  return parse(data, {
    columns: true,
    skip_empty_lines: true,
  }).map((u) => ({
    ...u,
    username: u.username?.trim(),
    password: u.password?.trim(),
    role: u.role?.trim(),
    accessstart: u.accessstart?.trim(),
    accessend: u.accessend?.trim(),
    access_dates: u.access_dates
      ? u.access_dates.replace(/"/g, "").split(/[,|]/).map((d) => d.trim())
      : [],
  }));
}

// Helper: Write users to CSV
async function writeUsers(users) {
  await csvWriter.writeRecords(
    users.map((u) => ({
      ...u,
      access_dates: Array.isArray(u.access_dates)
        ? u.access_dates.join("|")
        : u.access_dates,
    }))
  );
}

//  GET all users
router.get("/", (req, res) => {
  try {
    const users = readUsers();
    res.json(users);
  } catch (err) {
    console.error("❌ GET /users error:", err);
    res.status(500).json({ error: err.message });
  }
});

//  REGISTER new user
router.post("/register", async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      username,
      password,
      role,
      accessstart,
      accessend,
      access_dates,
    } = req.body;

    let users = readUsers();

    // Generate new ID
    const id =
      users.length > 0 ? Math.max(...users.map((u) => Number(u.id))) + 1 : 1;

    const newUser = {
      id,
      firstname,
      lastname,
      username: username.trim(),
      password: password.trim(),
      role: role.trim(),
      accessstart,
      accessend,
      access_dates: access_dates || [],
    };

    users.push(newUser);
    await writeUsers(users);

    // 🔥 Re-read CSV to get the latest saved record
    const updatedUsers = readUsers();
    const savedUser = updatedUsers.find((u) => String(u.id) === String(id));

    res.json(savedUser);
  } catch (err) {
    console.error("❌ POST /register error:", err);
    res.status(500).json({ error: err.message });
  }
});

//  USER LOGIN
router.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;
    const users = readUsers();

    console.log("🔎 Login attempt:", username, password);

    const user = users.find(
      (u) => u.username === username.trim() && u.password === password.trim()
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    //  Admin bypass (skip time/date restrictions)
    if (user.role?.toLowerCase() === "admin") {
      return res.json({ message: "Login successful (admin)", user });
    }

    // Check access date
    //  Check access dates properly
    const today = new Date().toISOString().split("T")[0];

    console.log("DEBUG user:", user.username, "access_dates:", user.access_dates);

    // ❌ Block login if no dates assigned
    if (!user.access_dates || user.access_dates.length === 0) {
      return res.status(403).json({ error: "No access dates assigned" });
    }

    // Block if today is not in allowed dates
    if (!user.access_dates.includes(today)) {
      return res.status(403).json({ error: `Access not allowed today (${today})` });
    }


    //  Check access time
    const now = new Date();
    if (user.accessstart && user.accessend) {
      const [startH, startM] = user.accessstart.split(":").map(Number);
      const [endH, endM] = user.accessend.split(":").map(Number);

      const startTime = new Date();
      startTime.setHours(startH, startM, 0, 0);

      const endTime = new Date();
      endTime.setHours(endH, endM, 0, 0);

      if (now < startTime || now > endTime) {
        return res.status(403).json({ error: "Access not allowed at this time" });
      }
    }

    res.json({ message: "Login successful", user });
  } catch (err) {
    console.error("❌ POST /login error:", err);
    res.status(500).json({ error: err.message });
  }
});

//  ADMIN LOGIN (ignores time/date restrictions but checks role)
router.post("/admin-login", (req, res) => {
  try {
    const { username, password } = req.body;
    const users = readUsers();

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // 🔑 Make sure only real admins pass
    if (user.role && user.role.trim().toLowerCase() === "admin") {
      return res.json({ message: "Admin login successful", user });
    }

    return res.status(403).json({ error: "Not authorized as admin" });
  } catch (err) {
    console.error("❌ POST /admin-login error:", err);
    res.status(500).json({ error: err.message });
  }
});

//  UPDATE user
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let users = readUsers();

    const index = users.findIndex((u) => String(u.id) === String(id));
    if (index === -1) return res.status(404).json({ error: "User not found" });

    users[index] = { ...users[index], ...req.body };

    await writeUsers(users);

    // 🔥 Re-read CSV to return updated record
    const updatedUsers = readUsers();
    const updatedUser = updatedUsers.find((u) => String(u.id) === String(id));

    res.json(updatedUser);
  } catch (err) {
    console.error("❌ PUT /users/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

//  DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let users = readUsers();

    users = users.filter((u) => String(u.id) !== String(id));

    await writeUsers(users);

    //  Re-read to confirm
    const updatedUsers = readUsers();
    res.json({ success: true, users: updatedUsers });
  } catch (err) {
    console.error("❌ DELETE /users/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

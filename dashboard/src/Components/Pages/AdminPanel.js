import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker, { DateObject } from "react-multi-date-picker";

const API_URL = process.env.REACT_APP_API_URL;

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    id: null,
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    role: "user",
    accessstart: "",
    accessend: "",
    access_dates: [],
  });

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/users`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleDatesChange = (dates) => setForm({ ...form, access_dates: dates });

  const resetForm = () =>
    setForm({
      id: null,
      firstname: "",
      lastname: "",
      username: "",
      password: "",
      role: "user",
      accessstart: "",
      accessend: "",
      access_dates: [],
    });

  // Add or update user
  const saveUser = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        access_dates: form.access_dates.map((d) => d.format("YYYY-MM-DD")),
      };
      if (form.id && !form.password) delete payload.password;

      const url = form.id ? `${API_URL}/api/users/${form.id}` : `${API_URL}/api/users/register`;
      const method = form.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(form.id ? "Failed to update user" : "Failed to add user");

      await res.json();
      resetForm();
      await fetchUsers(); // await to ensure latest users
      alert(form.id ? "User updated successfully ✅" : "User added successfully ✅");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Failed to delete user: ${res.statusText}`);
      await fetchUsers(); // refresh table
      alert("User deleted successfully ✅");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Edit user
  const editUser = (user) => {
    setForm({
      id: user._id || user.id,
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      username: user.username || "",
      password: "",
      role: user.role || "user",
      accessstart: user.accessstart || "",
      accessend: user.accessend || "",
      access_dates: user.access_dates ? user.access_dates.map((d) => new DateObject(d)) : [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen font-sans bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Admin Panel</h1>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-2xl p-8 mb-12 shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-6">{form.id ? "Edit User" : "Add New User"}</h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
          <input
            name="firstname"
            placeholder="First Name"
            value={form.firstname}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-700"
          />
          <input
            name="lastname"
            placeholder="Last Name"
            value={form.lastname}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-700"
          />
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-700"
          />
          <input
            name="password"
            type="password"
            placeholder="Password (only if updating)"
            value={form.password}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-700"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-700"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <input
            name="accessstart"
            type="time"
            value={form.accessstart}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-700"
          />
          <input
            name="accessend"
            type="time"
            value={form.accessend}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-700"
          />
          <div className="col-span-1 md:col-span-4">
            <label className="block mb-1">Access Dates:</label>
            <DatePicker
              multiple
              value={form.access_dates}
              onChange={handleDatesChange}
              format="YYYY-MM-DD"
              className="p-3 rounded-lg bg-gray-700 w-full"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={saveUser}
            disabled={saving}
            className="bg-blue-600 px-6 py-3 rounded-xl"
          >
            {form.id ? "Update User" : "Add User"}
          </button>
          <button onClick={resetForm} className="bg-gray-600 px-6 py-3 rounded-xl">
            Reset
          </button>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto rounded-xl shadow-lg">
        {loading ? (
          <p className="text-center py-6">Loading users...</p>
        ) : (
          <table className="w-full table-auto border border-gray-700">
            <thead className="bg-gray-700">
              <tr>
                {["ID", "First Name", "Last Name", "Username", "Role", "Access Start", "Access End", "Access Dates", "Actions"].map(
                  (head) => (
                    <th key={head} className="border px-4 py-3 text-left">{head}</th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {users.map((u) => (
                  <motion.tr
                    key={u._id || u.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="odd:bg-gray-800 even:bg-gray-700 hover:bg-gray-600/50 transition-colors"
                  >
                    <td className="border px-4 py-2">{u._id || u.id}</td>
                    <td className="border px-4 py-2">{u.firstname}</td>
                    <td className="border px-4 py-2">{u.lastname}</td>
                    <td className="border px-4 py-2">{u.username}</td>
                    <td className="border px-4 py-2">{u.role}</td>
                    <td className="border px-4 py-2">{u.accessstart}</td>
                    <td className="border px-4 py-2">{u.accessend}</td>
                    <td className="border px-4 py-2">
                      {u.access_dates && u.access_dates.length > 0
                        ? u.access_dates.map(d => new DateObject(d).format("YYYY-MM-DD")).join(", ")
                        : "-"}
                    </td>
                    <td className="border px-4 py-2 flex gap-2">
                      <button onClick={() => editUser(u)} className="bg-yellow-500 px-3 py-1 rounded-lg">Edit</button>
                      <button onClick={() => deleteUser(u._id || u.id)} className="bg-red-600 px-3 py-1 rounded-lg">Delete</button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  );
};

export default AdminPanel;

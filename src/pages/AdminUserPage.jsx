import React, { useEffect, useState } from "react";
import AdminNavBar from "./AdminNavBar.jsx";
import { getAdminProfile, updateAdminProfile } from "../services/authAPI.jsx";

export default function AdminUserPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  // load profile once on page load
  useEffect(() => {
    (async () => {
      try {
        const { status, data, message } = await getAdminProfile();
        if (status === "success") {
          setUser(data);
          setForm({ name: data.name, email: data.email });
        } else {
          setError(message || "Failed to load profile");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // save updates
  const handleSave = async () => {
    try {
      const { status, data, message } = await updateAdminProfile(form);
      if (status === "success") {
        setUser(data);
        setEditMode(false);
      } else {
        alert(message || "Update failed");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ background: "white", minHeight: "100vh", color: "black" }}>
      <AdminNavBar />
      <div
        style={{
        background: "white",
        border: "1px solid #eee",
        borderRadius: 10,
        padding: 20,
        maxWidth: 400,
        margin: "40px auto",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h3>Profile Information</h3>

        {!editMode ? (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span style={{ color: user.status === "active" ? "green" : "red" }}>
                {user.status}
              </span>
            </p>
            <button onClick={() => setEditMode(true)}>Edit</button>
          </>
        ) : (
          <>
            <div>
              <label>Name: </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Email: </label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
}

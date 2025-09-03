import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { deleteUserApi, editUserApi, fetchUsersApi } from "../services/authAPI.jsx";
import AdminNavBar from "./AdminNavBar.jsx";

// Initial form state for editing
const initialForm = {
  _id: null,
  name: "",
  email: "",
  role: "",
  status: "",
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");

  // Load all users on page load
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users from backend
  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetchUsersApi();
    if (res.status === "success") setUsers(res.data || []);
        console.log("Fetched users:", res.data);
    setLoading(false);
  };

  // Start editing a user
  const handleEdit = async (user) => {
    // You can fetch full user if needed:
    // const res = await fetchSingleUserApi(user._id);
    // if (res.status === "success") setForm(res.data);
    setForm(user); // Simple: use the row's data
    setIsEditing(true);
  };

  // Handle form input changes
  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save edited user
  const handleSave = async (e) => {
    e.preventDefault();
    await editUserApi(form._id, {
      name: form.name,
      email: form.email,
      role: form.role,
      status: form.status,
    });
    setIsEditing(false);
    setForm(initialForm);
    fetchUsers();
  };

  // Delete user
  const handleDelete = async (id) => {
    if (window.confirm("Delete this user?")) {
      await deleteUserApi(id);
      fetchUsers();
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setForm(initialForm);
  };
    // Filter users by name, email, or id
  const filteredUsers = users.filter(u =>
    (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
    (u._id && u._id.includes(search))
  );

  return (
    <div className="container mt-4">

      <AdminNavBar />
      <h2>User Management</h2>
            {/* Search Bar */}
      <input
        className="form-control mb-3"
        placeholder="Search by name, email, or ID"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ maxWidth: 300 }}
      />

      {/* Edit User Form */}
      {isEditing && (
        <form className="mb-4" onSubmit={handleSave}>
          <div className="row g-2 align-items-end">
            <div className="col-md-3">
              <label className="form-label">Name</label>
              <input className="form-control" name="name" value={form.name}
                onChange={handleInput} required />
            </div>
            <div className="col-md-3">
              <label className="form-label">Email</label>
              <input className="form-control" name="email" value={form.email}
                onChange={handleInput} required />
            </div>
            <div className="col-md-2">
              <label className="form-label">Role</label>
              <select className="form-select" name="role" value={form.role}
                onChange={handleInput}>
                <option value="member">Member</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Status</label>
              <select className="form-select" name="status" value={form.status}
                onChange={handleInput}>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="col-md-2 d-flex gap-2">
              <button className="btn btn-success" type="submit">Save</button>
              <button className="btn btn-secondary" onClick={handleCancel} type="button">Cancel</button>
            </div>
          </div>
        </form>
      )}

      {/* Users Table */}
      {loading ? (
        <div>Loading users...</div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.status}</td>
                <td>
                  <button className="btn btn-info btn-sm me-2" onClick={() => handleEdit(u)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
             <Link to='/' className="btn btn-secondary"> Go Back</Link>
    </div>
  );
}

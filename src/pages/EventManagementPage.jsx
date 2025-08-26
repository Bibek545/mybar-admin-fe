import React, { useEffect, useState } from "react";
import {
  addEventApi,
  deleteEventApi,
  editEventApi,
  fetchEventsApi,
} from "../services/authAPI.jsx";
import { Link } from "react-router-dom";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    _id: null,
    title: "",
    date: "",
    description: "",
    status: "upcoming", // e.g., "upcoming", "completed", "cancelled"
  });
  const [isEditing, setIsEditing] = useState(false);

  // Load events on page load
  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    const res = await fetchEventsApi();
    if (res.status === "success") setEvents(res.data || []);
    console.log("Fetched events:", res.data);
  };

  // Handle form input
  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Add or Edit event
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await editEventApi(form._id, form);
    } else {
      await addEventApi(form);
    }
    setForm({
      _id: null,
      title: "",
      date: "",
      description: "",
      status: "upcoming",
    });
    setIsEditing(false);
    fetchAllEvents();
  };

  // Start editing
  const handleEdit = (event) => {
    setForm(event);
    setIsEditing(true);
  };

  // Delete event
  const handleDelete = async (id) => {
    if (window.confirm("Delete this event?")) {
      await deleteEventApi(id);
      fetchAllEvents();
    }
  };

  // Reset form/cancel editing
  const resetForm = () => {
    setForm({
      _id: null,
      title: "",
      date: "",
      description: "",
      status: "upcoming",
    });
    setIsEditing(false);
  };

  return (
    <div className="container mt-4">
      <h2>Events Management</h2>
      <form
        onSubmit={handleSubmit}
        className="mb-4 row g-2"
        style={{ maxWidth: 600 }}
      >
        <div className="col-6">
          <input
            type="text"
            className="form-control"
            name="title"
            value={form.title}
            onChange={handleInput}
            placeholder="Title"
            required
          />
        </div>
        <div className="col-6">
          <input
            type="date"
            className="form-control"
            name="date"
            value={form.date}
            onChange={handleInput}
            required
          />
        </div>
        <div className="col-12">
          <input
            type="text"
            className="form-control"
            name="description"
            value={form.description}
            onChange={handleInput}
            placeholder="Description"
            required
          />
        </div>
        <div className="col-6">
          <select
            className="form-select"
            name="status"
            value={form.status}
            onChange={handleInput}
          >
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="col-6">
          <button className="btn btn-success" type="submit">
            {isEditing ? "Update" : "Add"}
          </button>
          {isEditing && (
            <button
              className="btn btn-secondary ms-2"
              onClick={resetForm}
              type="button"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      {/* List */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e._id}>
              <td>{e.title}</td>
              <td>{e.date}</td>
              <td>{e.description}</td>
              <td>{e.status}</td>
              <td>
                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() => handleEdit(e)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(e._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/" className="btn btn-secondary">
        Go Back
      </Link>
    </div>
  );
}

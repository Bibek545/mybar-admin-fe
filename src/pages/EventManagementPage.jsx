import React, { useEffect, useState } from "react";
import {
  addEventApi,
  deleteEventApi,
  editEventApi,
  fetchEventsApi,
} from "../services/authAPI.jsx";
import { Link } from "react-router-dom";
import AdminNavBar from "./AdminNavBar.jsx";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // upload-specific state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // form state
  const [form, setForm] = useState({
    _id: null,
    title: "",
    date: "",
    description: "",
    status: "upcoming", // upcoming | completed | cancelled
    imageUrl: "",
    // isPublic: true, // uncomment if your backend expects this
  });

  // load events on mount
  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    setLoading(true);
    setError("");
    const res = await fetchEventsApi();
    if (res.status === "success") {
      setEvents(res.data || []);
    } else {
      setError(res.message || "Failed to load events.");
    }
    setLoading(false);
  };

  // generic form input handler
  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // create or update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title.trim(),
      date: form.date,
      description: form.description.trim(),
      status: form.status,
      imageUrl: (form.imageUrl || "").trim(),
      // isPublic: form.isPublic,
    };

    if (isEditing) {
      await editEventApi(form._id, payload);
    } else {
      await addEventApi(payload);
    }

    resetForm();
    fetchAllEvents();
  };

  // start editing an existing row
  const handleEdit = (ev) => {
    setForm({
      _id: ev._id,
      title: ev.title || "",
      date: ev.date || "",
      description: ev.description || "",
      status: ev.status || "upcoming",
      imageUrl: ev.imageUrl || "",
      // isPublic: typeof ev.isPublic === "boolean" ? ev.isPublic : true,
    });
    setIsEditing(true);
  };

  // delete
  const handleDelete = async (id) => {
    if (window.confirm("Delete this event?")) {
      await deleteEventApi(id);
      fetchAllEvents();
    }
  };

  // reset form / cancel edit
  const resetForm = () => {
    setForm({
      _id: null,
      title: "",
      date: "",
      description: "",
      status: "upcoming",
      imageUrl: "",
      // isPublic: true,
    });
    setIsEditing(false);
  };

  // ---- Multer upload (local) ----
  const handleLocalUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // basic validations
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Max file size is 2MB.");
      return;
    }

    try {
      setUploading(true);
      setUploadError("");

      const formData = new FormData();
      formData.append("image", file);

      // include Authorization if your route is protected
      const token = localStorage.getItem("accessJWT"); // adjust if you store elsewhere
      const res = await fetch("/api/v1/upload/event-image", {
        method: "POST",
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const json = await res.json();
      if (json.status === "success" && json.url) {
        setForm((prev) => ({ ...prev, imageUrl: json.url }));
      } else {
        setUploadError(json.message || "Upload failed.");
      }
    } catch {
      setUploadError("Upload error. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  // ---- end upload ----

  return (
    <div className="container mt-4">
      <AdminNavBar />

      <h2>Events Management</h2>

      <form onSubmit={handleSubmit} className="mb-4 row g-2" style={{ maxWidth: 700 }}>
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

          {/* Image URL input */}
          <input
            type="text"
            className="form-control mt-2"
            placeholder="Image URL (optional)"
            name="imageUrl"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />

          {/* Browse (upload to Multer) + status */}
          <div className="d-flex align-items-center gap-2 mt-2">
            <input type="file" accept="image/*" onChange={handleLocalUpload} />
            {uploading && <small className="text-muted">Uploading…</small>}
            {uploadError && <small className="text-danger">{uploadError}</small>}
          </div>

          {/* Preview */}
          {!!form.imageUrl && (
            <img
              src={form.imageUrl}
              alt=""
              style={{ width: 90, height: 60, objectFit: "cover", borderRadius: 6, marginTop: 8 }}
            />
          )}

          <small className="text-muted d-block mt-1">
            Paste a direct link or click Browse to upload (max 2MB).
          </small>

          {/* If you use isPublic in backend, uncomment below */}
          {/*
          <div className="form-check mt-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="isPublicCheck"
              checked={form.isPublic}
              onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="isPublicCheck">
              Public
            </label>
          </div>
          */}
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
            <button className="btn btn-secondary ms-2" onClick={resetForm} type="button">
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && <div className="text-danger mb-2">{error}</div>}
      {loading && <div>Loading…</div>}

      {/* List */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th style={{ width: 80 }}>Image</th>
            <th>Title</th>
            <th>Date</th>
            <th>Description</th>
            <th>Status</th>
            <th style={{ minWidth: 140 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No events yet.
              </td>
            </tr>
          ) : (
            events.map((ev) => (
              <tr key={ev._id}>
                <td>
                  {ev.imageUrl ? (
                    <img
                      src={ev.imageUrl}
                      alt=""
                      style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 6 }}
                    />
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td>{ev.title}</td>
                <td>{ev.date}</td>
                <td>{ev.description}</td>
                <td className={ev.status === "cancelled" ? "text-danger" : ""}>{ev.status}</td>
                <td>
                  <button className="btn btn-info btn-sm me-2" onClick={() => handleEdit(ev)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ev._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Link to="/" className="btn btn-secondary">
        Go Back
      </Link>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { deleteBookingApi, fetchBookingsApi, updateStatusApi } from "../services/authAPI.jsx";
import { Link } from "react-router-dom";
import AdminNavBar from "./AdminNavBar.jsx";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const res = await fetchBookingsApi();
    if (res.status === "success") setBookings(res.data || []);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    await updateStatusApi(id, status);
    fetchBookings();
    setSelectedBooking(null);
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    await deleteBookingApi(id);
    fetchBookings();
    setSelectedBooking(null);
  };

  // Badge color logic
  const statusBadge = (status) => {
    if (status === "approved") return <span className="badge bg-success">{status}</span>;
    if (status === "pending") return <span className="badge bg-warning text-dark">{status}</span>;
    if (status === "declined") return <span className="badge bg-danger">{status}</span>;
    return <span className="badge bg-secondary">{status}</span>;
  };

  return (
    <div className="container mt-4">

      <AdminNavBar />

      <h2 className="mb-4">All Bookings</h2>
      {loading ? (
        <div>Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div>No bookings found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ minWidth: 220 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.name}</td>
                  <td>{b.email}</td>
                  <td>{b.date}</td>
                  <td>{statusBadge(b.status)}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => setSelectedBooking(b)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-success btn-sm"
                        disabled={b.status === "approved"}
                        onClick={() => updateStatus(b._id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-warning btn-sm"
                        disabled={b.status === "declined"}
                        onClick={() => updateStatus(b._id, "declined")}
                      >
                        Decline
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteBooking(b._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Booking Details */}
      {selectedBooking && (
        <div
          className="shadow mt-4 mx-auto"
          style={{
            background: "#fff",
            border: "1px solid #e2e2e2",
            borderRadius: 12,
            padding: 28,
            maxWidth: 400,
          }}
        >
          <h5 className="mb-3">Booking Details</h5>
          <p><b>Name:</b> {selectedBooking.name}</p>
          <p><b>Email:</b> {selectedBooking.email}</p>
          <p><b>Phone:</b> {selectedBooking.phone}</p>
          <p><b>Guests:</b> {selectedBooking.guests}</p>
          <p><b>Date:</b> {selectedBooking.date}</p>
          <p><b>Time:</b> {selectedBooking.time}</p>
          <p><b>Status:</b> {statusBadge(selectedBooking.status)}</p>
          <p><b>Requests:</b> {selectedBooking.specialRequests}</p>
          <button
            className="btn btn-secondary w-100 mt-2"
            onClick={() => setSelectedBooking(null)}
          >
            Close
          </button>
        </div>
      )}

      <div className="mt-4">
        <Link to="/" className="btn btn-secondary">
          Go Back
        </Link>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import {
  deleteBookingApi,
  fetchBookingsApi,
  updateStatusApi,
} from "../services/authAPI.jsx";
import { Link } from "react-router-dom";
import AdminNavBar from "./AdminNavBar.jsx";

function BookingModal({
  booking,
  onClose,
  statusBadge,
  onApprove,
  onDecline,
  onDelete,
}) {
  // Close on ESC + lock scroll
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ zIndex: 1050 }}
      onClick={onClose} // backdrop click closes
    >
      {/* Backdrop */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ background: "rgba(0,0,0,0.5)" }}
      />

      {/* Dialog */}
      <div
        className="position-relative bg-white shadow rounded-3 p-4"
        style={{ width: "min(92vw, 520px)" }}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h5 className="mb-0">Booking Details</h5>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="small">
          <p>
            <b>Name:</b> {booking.name}
          </p>
          <p>
            <b>Email:</b> {booking.email}
          </p>
          <p>
            <b>Phone:</b> {booking.phone}
          </p>
          <p>
            <b>Guests:</b> {booking.guests}
          </p>
          <p>
            <b>Date:</b> {booking.date}
          </p>
          <p>
            <b>Time:</b> {booking.time}
          </p>
          <p>
            <b>Status:</b> {statusBadge(booking.status)}
          </p>
          <p>
            <b>Requests:</b> {booking.specialRequests || "-"}
          </p>
        </div>

        <div className="d-flex gap-2 mt-3 flex-wrap">
          <button
            className="btn btn-success btn-sm"
            disabled={booking.status === "approved"}
            onClick={() => onApprove(booking._id)}
          >
            Approve
          </button>
          <button
            className="btn btn-warning btn-sm"
            disabled={booking.status === "declined"}
            onClick={() => onDecline(booking._id)}
          >
            Decline
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(booking._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

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
    if (status === "approved")
      return <span className="badge bg-success">{status}</span>;
    if (status === "pending")
      return <span className="badge bg-warning text-dark">{status}</span>;
    if (status === "declined")
      return <span className="badge bg-danger">{status}</span>;
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
        <BookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          statusBadge={statusBadge}
          onApprove={(id) => updateStatus(id, "approved")}
          onDecline={(id) => updateStatus(id, "declined")}
          onDelete={(id) => deleteBooking(id)}
        />
      )}

      <div className="mt-4">
        <Link to="/" className="btn btn-secondary">
          Go Back
        </Link>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { deleteBookingApi, fetchBookingsApi, updateStatusApi } from "../services/authAPI.jsx";
import { Link } from "react-router-dom";



export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Fetch bookings when page loads
  useEffect(() => {
    fetchBookings();
  }, []);

  // Fetch bookings from backend
  const fetchBookings = async () => {
    setLoading(true);
    const res = await fetchBookingsApi();

    if (res.status === "success") {
      setBookings(res.data || []);
    }
    setLoading(false);
  };

  // Approve or Decline
  const updateStatus = async (id, status) => {
    await updateStatusApi(id, status);
    fetchBookings();
    setSelectedBooking(null);
  };

  // Delete booking
  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    await deleteBookingApi(id);
    fetchBookings();
    setSelectedBooking(null);
  };

  return (
    <div>
      <h2 className="mb-4">All Bookings</h2>
      {loading ? (
        <div>Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div>No bookings found.</div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.name}</td>
                <td>{b.email}</td>
                <td>{b.date}</td>
                <td>{b.status}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => setSelectedBooking(b)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-sm btn-success me-2"
                    disabled={b.status === "approved"}
                    onClick={() => updateStatus(b._id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    disabled={b.status === "declined"}
                    onClick={() => updateStatus(b._id, "declined")}
                  >
                    Decline
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteBooking(b._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Booking Details Section (shows below the table) */}
      {selectedBooking && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,0.09)",
            padding: 24,
            margin: "24px auto",
            maxWidth: 400,
          }}
        >
          <h4>Booking Details</h4>
          <p><b>Name:</b> {selectedBooking.name}</p>
          <p><b>Email:</b> {selectedBooking.email}</p>
          <p><b>Phone:</b> {selectedBooking.phone}</p>
          <p><b>Guests:</b> {selectedBooking.guests}</p>
          <p><b>Date:</b> {selectedBooking.date}</p>
          <p><b>Time:</b> {selectedBooking.time}</p>
          <p><b>Status:</b> {selectedBooking.status}</p>
          <p><b>Requests:</b> {selectedBooking.specialRequests}</p>
          <button
            className="btn btn-secondary w-100"
            onClick={() => setSelectedBooking(null)}
          >
            Close
          </button>
        </div>
      )}
      <Link to='/' className="btn btn-secondary"> Go Back</Link>
    </div>
  );
}

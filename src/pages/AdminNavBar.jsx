import React from "react";
import { useNavigate } from "react-router-dom";

const AdminNavBar = () => {
  const navigate = useNavigate();

  //logiing out
  const handleOnLogout = () => {
    localStorage.removeItem("accessJWT");
    localStorage.removeItem("refreshJWT");
    // Optionally, if you stored tokens in sessionStorage:
    sessionStorage.removeItem("accessJWT");
    sessionStorage.removeItem("refreshJWT");

    navigate("login");
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Welcome, Admin!</h1>
        <button
          onClick={handleOnLogout}
          className="btn btn-outline-danger"
          style={{ fontWeight: 500 }}
          navigate
        >
          Logout
        </button>
      </div>
      {/* Navigation buttons */}
      <div className="d-flex gap-3 mb-4 mt-2 justify-content-center flex-wrap">
        <a href="/booking" className="btn btn-outline-dark px-5">
          View Bookings
        </a>
        <a href="/menu" className="btn btn-outline-dark px-5">
          Manage Menu
        </a>
        <a href="/events" className="btn btn-outline-dark px-5">
          Manage Events
        </a>
        <a href="/users" className="btn btn-outline-dark px-5">
          Manage Users
        </a>
        <a href="/admin-profile" className="btn btn-outline-dark px-5">
          Profile
        </a>
      </div>

      <hr className="mb-4" />
    </div>
  );
};

export default AdminNavBar;

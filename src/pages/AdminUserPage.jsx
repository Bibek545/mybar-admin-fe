import React from "react";
import { useSelector } from "react-redux";
import AdminNavBar from "./AdminNavBar.jsx";

const AdminUserPage = () => {
  // Assuming your user state is stored as state.user.user
  const user = useSelector((state) => state.user.user);

  // Fallback for missing info (optional)
  if (!user || !user.email) {
    return (
      <div>
        <AdminNavBar />
        <div className="container mt-5">Loading profile info...</div>
      </div>
    );
  }

  return (
    <div>
      <AdminNavBar />

      <div className="container mt-5" style={{ maxWidth: 450 }}>
        <div
          style={{
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: 12,
            boxShadow: "0 6px 24px rgba(0,0,0,0.07)",
            padding: 32,
            margin: "0 auto",
          }}
        >
          <h3 className="mb-3">Profile Information</h3>
          <div>
            <strong>Name:</strong> {user.name || `${user.fName} ${user.lName}`}
          </div>
          <div>
            <strong>Email:</strong> {user.email}
          </div>
          <div>
            <strong>Role:</strong> {user.role}
          </div>
          <div>
            <strong>Status:</strong>{" "}
            <span
              style={{
                color: user.status === "active" ? "green" : "red",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {user.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserPage;

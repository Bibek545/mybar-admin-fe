import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdminApi } from "../services/authAPI";
import "bootstrap/dist/css/bootstrap.min.css";

export default function LoginPage() {
  const navigate = useNavigate(); // <-- React Router navigation
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  
  e.preventDefault();
  setError("");
  setLoading(true);

  const res = await loginAdminApi({ email, password });
  console.log("LOGIN RESPONSE:", res);
  setLoading(false);

  console.log("LOGIN RESPONSE:", res);

  if (
    res.status === "success" &&
    res.data &&
    res.data.tokens &&
    res.data.tokens.accessJWT
  ) {
    localStorage.setItem("accessJWT", res.data.tokens.accessJWT);
    localStorage.setItem("refreshJWT", res.data.tokens.refreshJWT);
    console.log("Tokens saved:", res.data.tokens.accessJWT, res.data.tokens.refreshJWT);
    navigate("/");
  } else {
    setError(res.message || "Login failed. Please try again.");
    console.log("Login failed, res:", res);
  }
};

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{ background: "#f7f7f7" }}
    >
      <div
        className="p-4"
        style={{
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          minWidth: "350px",
        }}
      >
        <h1 className="mb-4 text-center"> Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              placeholder="Enter admin email"
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
            />
          </div>
          {error && <div className="text-danger mb-3 text-center">{error}</div>}
          <button
            type="submit"
            className="btn btn-dark w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

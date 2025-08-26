import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { renewAccessJWTApi } from "../services/authAPI";


export default function ProtectedRoute({ children }) {
  const [isChecking, setIsChecking] = useState(true);
  const [valid, setValid] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const accessJWT = localStorage.getItem("accessJWT");
      const refreshJWT = localStorage.getItem("refreshJWT");

      if (!accessJWT) {
        setValid(false);
        setIsChecking(false);
        return;
      }

      try {
        const decoded = jwtDecode(accessJWT);
        console.log("Decoded:", decoded);
        const now = Date.now() / 1000;

        if (decoded.exp > now) {
          setValid(true);
          setIsChecking(false);
          return;
        }

        if (refreshJWT) {
          const res = await renewAccessJWTApi({ refreshJWT });
          if (res.status === "success" && res.payload) {
            localStorage.setItem("accessJWT", res.payload);
            setValid(true);
            setIsChecking(false);
            return;
          }
        }

        localStorage.removeItem("accessJWT");
        localStorage.removeItem("refreshJWT");
        setValid(false);
        setIsChecking(false);
      } catch (error) {
        console.log(error)
        localStorage.removeItem("accessJWT");
        localStorage.removeItem("refreshJWT");
        setValid(false);
        setIsChecking(false);
      }
    };

    checkAuth();
  }, []);

  // Show spinner while checking authentication
  if (isChecking)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  return valid ? children : <Navigate to="/login" replace state={{ from: location }} />;
}

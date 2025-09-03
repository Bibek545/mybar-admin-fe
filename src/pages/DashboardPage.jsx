import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchReportStatsApi } from "../services/authAPI.jsx";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import AdminNavBar from "./AdminNavBar.jsx";

const COLORS = ["#D97B3F", "#10b981", "#3b82f6", "#f59e42", "#8884d8"]; // Brand & nice extras

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  // const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetchReportStatsApi();
      if (res.status === "success") setStats(res.data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  // Pie chart data
  const bookingsPie =
    stats?.bookingsByDay?.map((day) => ({
      name: day._id,
      value: day.count,
    })) || [];


  return (
    <div className="container py-4">

      <AdminNavBar />

      <hr className="mb-4" />

      {/* Loading/Error */}
      {loading && <div>Loading stats...</div>}
      {!loading && !stats && (
        <div className="text-danger">Failed to load stats.</div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="row mb-5 g-3 justify-content-center">
          <div className="col-sm-3">
            <div className="card shadow-sm text-center p-4 border-0">
              <div className="fs-3 fw-bold" style={{ color: COLORS[0] }}>
                {stats.totalBookings ?? "--"}
              </div>
              <div>Total Bookings</div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="card shadow-sm text-center p-4 border-0">
              <div className="fs-3 fw-bold" style={{ color: COLORS[1] }}>
                {stats.totalUsers ?? "--"}
              </div>
              <div>Total Users</div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="card shadow-sm text-center p-4 border-0">
              <div className="fs-3 fw-bold" style={{ color: COLORS[2] }}>
                {stats.bookingsThisWeek ?? "--"}
              </div>
              <div>Bookings This Week</div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="card shadow-sm text-center p-4 border-0">
              <div className="fs-3 fw-bold" style={{ color: COLORS[3] }}>
                {stats.newUsersThisWeek ?? "--"}
              </div>
              <div>New Users This Week</div>
            </div>
          </div>
        </div>
      )}

      {/* Bookings Breakdown Chart */}
      {stats && (
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-sm p-3 mb-3">
              <h5 className="text-center mb-3">Bookings Breakdown (per Day)</h5>
              {bookingsPie.length === 0 ? (
                <div className="text-muted text-center">
                  No booking data available.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={bookingsPie}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label
                    >
                      {bookingsPie.map((_, idx) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={COLORS[idx % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

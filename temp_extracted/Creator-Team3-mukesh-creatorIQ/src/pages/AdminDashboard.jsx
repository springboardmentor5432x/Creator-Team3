import React from "react";
import Navbar from "../components/layout/Navbar";
import AdminSidebar from "../components/layout/AdminSidebar";
import AdminPanel from "../components/analytics/AdminPanel";

export default function AdminDashboard() {
  const token = localStorage.getItem("token");

  return (
    <div className="admin-dashboard-view">
      <Navbar />

      <div className="admin-layout" style={{ display: "flex", minHeight: "calc(100vh - 70px)" }}>
        <AdminSidebar />

        <main className="admin-main" style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
          <AdminPanel token={token} />
        </main>
      </div>
    </div>
  );
}

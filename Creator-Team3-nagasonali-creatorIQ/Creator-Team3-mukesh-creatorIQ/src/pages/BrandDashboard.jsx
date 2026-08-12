import React from "react";
import Navbar from "../components/layout/Navbar";
import BrandSidebar from "../components/layout/BrandSidebar";
import BrandKPICards from "../components/dashboard/BrandKPICards";
import CampaignChart from "../components/analytics/CampaignChart";
import BrandEngagement from "../components/analytics/BrandEngagement";

export default function BrandDashboard() {
  return (
    <div className="brand-dashboard-view">
      <Navbar />

      <div className="brand-layout" style={{ display: "flex", minHeight: "calc(100vh - 70px)" }}>
        <BrandSidebar />

        <main className="brand-main-content" style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
          {/* Welcome Banner */}
          <section className="brand-welcome" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "1.875rem" }}>Welcome Back 👋</h1>
              <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "0.875rem" }}>Here's what's happening with your campaigns today.</p>
            </div>
            <button
              className="create-campaign-btn"
              style={{
                background: "#3b82f6",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "12px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(59, 130, 246, 0.25)"
              }}
            >
              + Create Campaign
            </button>
          </section>

          {/* Brand KPIs */}
          <section className="brand-kpi-section" style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: "0 0 1rem 0" }}>Brand Analytics</h2>
            <BrandKPICards />
          </section>

          {/* Charts Row */}
          <section className="brand-analytics-section" style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: "0 0 1rem 0" }}>Campaign Performance</h2>
            <div className="brand-chart-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div className="brand-chart-card" style={{ background: "rgba(30, 41, 59, 0.4)", border: "1px solid rgba(255,255,255,0.08)", padding: "1.5rem", borderRadius: "24px" }}>
                <CampaignChart />
              </div>
              <div className="brand-chart-card" style={{ background: "rgba(30, 41, 59, 0.4)", border: "1px solid rgba(255,255,255,0.08)", padding: "1.5rem", borderRadius: "24px" }}>
                <BrandEngagement />
              </div>
            </div>
          </section>

          {/* Campaigns Table */}
          <section className="brand-campaign-summary" style={{ background: "rgba(30, 41, 59, 0.4)", border: "1px solid rgba(255,255,255,0.08)", padding: "1.5rem", borderRadius: "20px" }}>
            <h2 style={{ fontSize: "1.25rem", margin: "0 0 1rem 0" }}>Recent Campaigns</h2>
            <div className="campaign-table-wrapper" style={{ overflowX: "auto" }}>
              <table className="brand-table" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <th style={{ padding: "12px 16px", color: "#94a3b8", fontSize: "0.75rem", textTransform: "uppercase" }}>Campaign</th>
                    <th style={{ padding: "12px 16px", color: "#94a3b8", fontSize: "0.75rem", textTransform: "uppercase" }}>Creators</th>
                    <th style={{ padding: "12px 16px", color: "#94a3b8", fontSize: "0.75rem", textTransform: "uppercase" }}>Reach</th>
                    <th style={{ padding: "12px 16px", color: "#94a3b8", fontSize: "0.75rem", textTransform: "uppercase" }}>Engagement</th>
                    <th style={{ padding: "12px 16px", color: "#94a3b8", fontSize: "0.75rem", textTransform: "uppercase" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <td style={{ padding: "14px 16px", fontSize: "0.875rem", fontWeight: "600" }}>Summer Product Launch</td>
                    <td style={{ padding: "14px 16px", fontSize: "0.875rem" }}>24</td>
                    <td style={{ padding: "14px 16px", fontSize: "0.875rem", fontWeight: "700" }}>2.4M</td>
                    <td style={{ padding: "14px 16px", fontSize: "0.875rem" }}>8.7%</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span className="status active-status" style={{ background: "rgba(16,185,129,0.12)", color: "#34d399", fontSize: "0.75rem", fontWeight: "700", padding: "2px 8px", borderRadius: "999px" }}>Active</span>
                    </td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <td style={{ padding: "14px 16px", fontSize: "0.875rem", fontWeight: "600" }}>Influencer Awareness</td>
                    <td style={{ padding: "14px 16px", fontSize: "0.875rem" }}>18</td>
                    <td style={{ padding: "14px 16px", fontSize: "0.875rem", fontWeight: "700" }}>1.8M</td>
                    <td style={{ padding: "14px 16px", fontSize: "0.875rem" }}>7.2%</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span className="status active-status" style={{ background: "rgba(16,185,129,0.12)", color: "#34d399", fontSize: "0.75rem", fontWeight: "700", padding: "2px 8px", borderRadius: "999px" }}>Active</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "14px 16px", fontSize: "0.875rem", fontWeight: "600" }}>New Product Campaign</td>
                    <td style={{ padding: "14px 16px", fontSize: "0.875rem" }}>12</td>
                    <td style={{ padding: "14px 16px", fontSize: "0.875rem", fontWeight: "700" }}>950K</td>
                    <td style={{ padding: "14px 16px", fontSize: "0.875rem" }}>5.8%</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span className="status completed-status" style={{ background: "rgba(59,130,246,0.12)", color: "#60a5fa", fontSize: "0.75rem", fontWeight: "700", padding: "2px 8px", borderRadius: "999px" }}>Completed</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

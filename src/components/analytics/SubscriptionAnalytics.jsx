import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function SubscriptionAnalytics({ token }) {
  const [plans, setPlans] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch(
      "http://127.0.0.1:8000/api/revenue/subscriptions"
    )
      .then((res) => res.json())
      .then((data) => setPlans(data))
      .catch((err) =>
        console.error("Subscription Plans Error:", err)
      );
  }, []);

  useEffect(() => {
    if (!token) return;

    fetch(
      "http://127.0.0.1:8000/api/revenue/forecast",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((data) => setForecast(data))
      .catch((err) =>
        console.error("Forecast Error:", err)
      );
  }, [token]);

  useEffect(() => {
    if (!token) return;

    fetch(
      "http://127.0.0.1:8000/api/revenue/health",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch((err) =>
        console.error("Health Score Error:", err)
      );
  }, [token]);

  const handleExportPDF = () => {
    window.open(
      "http://127.0.0.1:8000/api/revenue/export/pdf",
      "_blank"
    );
  };

  const kpis = {
    totalSubscribers: 8500,
    monthlyRevenue: 18500,
    newSubscribers: 620,
    churnRate: 2.8
  };

  const growthData = [
    {
      month: "Jan",
      subscribers: 4500,
      revenue: 8000
    },
    {
      month: "Feb",
      subscribers: 5000,
      revenue: 9200
    },
    {
      month: "Mar",
      subscribers: 5600,
      revenue: 10500
    },
    {
      month: "Apr",
      subscribers: 6400,
      revenue: 12800
    },
    {
      month: "May",
      subscribers: 7400,
      revenue: 15400
    },
    {
      month: "Jun",
      subscribers: 8500,
      revenue: 18500
    }
  ];

  return (
    <div className="revenue-dashboard">

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}
      >
        <h2>💎 Subscription Analytics</h2>

        <button
          onClick={handleExportPDF}
          className="export-btn"
        >
          Export PDF Report
        </button>
      </div>

      <div className="revenue-kpi-grid">

        <div className="kpi-summary-card">
          <span className="kpi-label">
            Total Subscribers
          </span>

          <span className="kpi-value">
            {kpis.totalSubscribers.toLocaleString()}
          </span>
        </div>

        <div className="kpi-summary-card">
          <span className="kpi-label">
            Monthly Revenue
          </span>

          <span className="kpi-value">
            ${kpis.monthlyRevenue.toLocaleString()}
          </span>
        </div>

        <div className="kpi-summary-card">
          <span className="kpi-label">
            Forecast Revenue
          </span>

          <span className="kpi-value">
            $
            {forecast?.nextMonthRevenue?.toLocaleString() ||
              0}
          </span>
        </div>

        <div className="kpi-summary-card">
          <span className="kpi-label">
            Revenue Health Score
          </span>

          <span className="kpi-value">
            {health?.score || 0}/100
          </span>

          <span
            style={{
              color: "#10b981",
              fontWeight: "700"
            }}
          >
            {health?.status || "Unknown"}
          </span>
        </div>

        <div className="kpi-summary-card">
          <span className="kpi-label">
            New Subscribers
          </span>

          <span className="kpi-value">
            {kpis.newSubscribers}
          </span>
        </div>

        <div className="kpi-summary-card">
          <span className="kpi-label">
            Churn Rate
          </span>

          <span className="kpi-value">
            {kpis.churnRate}%
          </span>
        </div>

      </div>

      <div className="revenue-charts-grid">

        <div className="revenue-chart-card">

          <h4 className="chart-card-title">
            📈 Subscriber Growth
          </h4>

          <div
            style={{
              width: "100%",
              height: 300
            }}
          >
            <ResponsiveContainer>
              <AreaChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="subscribers"
                  stroke="#8b5cf6"
                  fill="#8b5cf620"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </div>

        <div className="revenue-chart-card">

          <h4 className="chart-card-title">
            💰 Revenue Growth
          </h4>

          <div
            style={{
              width: "100%",
              height: 300
            }}
          >
            <ResponsiveContainer>
              <AreaChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  fill="#10b98120"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>

      <div className="table-card">

        <h4 className="chart-card-title">
          📋 Subscription Plans
        </h4>

        <table className="custom-table">

          <thead>
            <tr>
              <th>Plan</th>
              <th>Subscribers</th>
              <th>Revenue</th>
            </tr>
          </thead>

          <tbody>
            {(plans || []).map(
              (item, index) => (
                <tr key={index}>
                  <td>{item.plan}</td>

                  <td>
                    {(
                      item.subscribers || 0
                    ).toLocaleString()}
                  </td>

                  <td
                    style={{
                      color: "#10b981",
                      fontWeight: "700"
                    }}
                  >
                    $
                    {(
                      item.revenue || 0
                    ).toLocaleString()}
                  </td>
                </tr>
              )
            )}
          </tbody>

        </table>

      </div>

    </div>
  );
}
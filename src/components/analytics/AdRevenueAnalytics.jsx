import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
const [platformData, setPlatformData] =
  useState([]);
useEffect(() => {
  fetch(
    "http://127.0.0.1:8000/api/revenue/ads"
  )
    .then((res) => res.json())
    .then((data) =>
      setPlatformData(data)
    );
}, []);
export default function AdRevenueAnalytics() {
  const kpis = {
    totalRevenue: 32500,
    highestCPM: 12.5,
    highestPlatform: "YouTube",
    impressions: 2500000
  };

  const revenueTrend = [
    { month: "Jan", revenue: 3200 },
    { month: "Feb", revenue: 4100 },
    { month: "Mar", revenue: 4800 },
    { month: "Apr", revenue: 5500 },
    { month: "May", revenue: 6100 },
    { month: "Jun", revenue: 8800 }
  ];

  const platformData = [
    {
      platform: "YouTube",
      impressions: 1200000,
      cpm: 12.5,
      revenue: 15000
    },
    {
      platform: "Instagram",
      impressions: 650000,
      cpm: 8.2,
      revenue: 7200
    },
    {
      platform: "Facebook",
      impressions: 420000,
      cpm: 6.5,
      revenue: 5200
    },
    {
      platform: "TikTok",
      impressions: 230000,
      cpm: 4.8,
      revenue: 5100
    }
  ];

  return (
    <div className="revenue-dashboard">

      <h2>📢 Ad Revenue Analytics</h2>

      <div className="revenue-kpi-grid">

        <div className="kpi-summary-card">
          <span className="kpi-label">Total Ad Revenue</span>
          <span className="kpi-value">
            ${kpis.totalRevenue.toLocaleString()}
          </span>
        </div>

        <div className="kpi-summary-card">
          <span className="kpi-label">Highest CPM</span>
          <span className="kpi-value">
            ${kpis.highestCPM}
          </span>
        </div>

        <div className="kpi-summary-card">
          <span className="kpi-label">Top Platform</span>
          <span className="kpi-value">
            {kpis.highestPlatform}
          </span>
        </div>

        <div className="kpi-summary-card">
          <span className="kpi-label">Ad Impressions</span>
          <span className="kpi-value">
            {kpis.impressions.toLocaleString()}
          </span>
        </div>

      </div>

      <div className="revenue-charts-grid">

        <div className="revenue-chart-card">
          <h4 className="chart-card-title">
            Revenue Trend
          </h4>

          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  fill="#3b82f620"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="revenue-chart-card">
          <h4 className="chart-card-title">
            CPM Comparison
          </h4>

          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="cpm"
                  fill="#10b981"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <div className="table-card">

        <h4 className="chart-card-title">
          Platform Revenue Table
        </h4>

        <table className="custom-table">

          <thead>
            <tr>
              <th>Platform</th>
              <th>Impressions</th>
              <th>CPM</th>
              <th>Revenue</th>
            </tr>
          </thead>

          <tbody>
            {platformData.map((item, index) => (
              <tr key={index}>
                <td>{item.platform}</td>
                <td>{item.impressions.toLocaleString()}</td>
                <td>${item.cpm}</td>
                <td style={{ color: "#10b981" }}>
                  ${item.revenue.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}
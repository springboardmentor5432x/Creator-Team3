import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
const [affiliateData, setAffiliateData] =
  useState([]);
useEffect(() => {
  fetch(
    "http://127.0.0.1:8000/api/revenue/affiliate"
  )
    .then((res) => res.json())
    .then((data) =>
      setAffiliateData(data)
    );
}, []);
export default function AffiliateAnalytics() {
  const kpis = {
    totalRevenue: 18500,
    topPartner: "Amazon Associates",
    conversionRate: 6.8,
    clicks: 42500
  };

  const trendData = [
    { month: "Jan", revenue: 1200 },
    { month: "Feb", revenue: 1500 },
    { month: "Mar", revenue: 2100 },
    { month: "Apr", revenue: 2600 },
    { month: "May", revenue: 3200 },
    { month: "Jun", revenue: 4100 }
  ];

  const partners = [
    {
      partner: "Amazon Associates",
      clicks: 15000,
      conversions: 850,
      revenue: 6200
    },
    {
      partner: "Impact",
      clicks: 12000,
      conversions: 600,
      revenue: 4800
    },
    {
      partner: "ShareASale",
      clicks: 8500,
      conversions: 420,
      revenue: 3900
    },
    {
      partner: "CJ Affiliate",
      clicks: 7000,
      conversions: 320,
      revenue: 3600
    }
  ];

  return (
    <div className="revenue-dashboard">

      <h2>🔗 Affiliate Analytics</h2>

      <div className="revenue-kpi-grid">

        <div className="kpi-summary-card">
          <span className="kpi-label">Total Affiliate Revenue</span>
          <span className="kpi-value">
            ${kpis.totalRevenue.toLocaleString()}
          </span>
        </div>

        <div className="kpi-summary-card">
          <span className="kpi-label">Top Partner</span>
          <span className="kpi-value">
            {kpis.topPartner}
          </span>
        </div>

        <div className="kpi-summary-card">
          <span className="kpi-label">Conversion Rate</span>
          <span className="kpi-value">
            {kpis.conversionRate}%
          </span>
        </div>

        <div className="kpi-summary-card">
          <span className="kpi-label">Affiliate Clicks</span>
          <span className="kpi-value">
            {kpis.clicks.toLocaleString()}
          </span>
        </div>

      </div>

      <div className="revenue-chart-card">

        <h4 className="chart-card-title">
          Affiliate Revenue Trends
        </h4>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={trendData}>
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

      <div className="table-card">

        <h4 className="chart-card-title">
          Affiliate Partners
        </h4>

        <table className="custom-table">

          <thead>
            <tr>
              <th>Partner</th>
              <th>Clicks</th>
              <th>Conversions</th>
              <th>Revenue</th>
            </tr>
          </thead>

          <tbody>
            {partners.map((item, index) => (
              <tr key={index}>
                <td>{item.partner}</td>
                <td>{item.clicks.toLocaleString()}</td>
                <td>{item.conversions}</td>
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
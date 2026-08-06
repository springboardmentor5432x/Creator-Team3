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

export default function RevenueForecast() {
  const forecastData = [
    { month: "Jul", revenue: 18500 },
    { month: "Aug", revenue: 21000 },
    { month: "Sep", revenue: 23500 },
    { month: "Oct", revenue: 26000 },
    { month: "Nov", revenue: 29000 }
  ];

  return (
    <div className="revenue-dashboard">

      <h2>🔮 Revenue Forecast</h2>

      <div className="revenue-kpi-grid">

        <div className="kpi-summary-card">
          <span className="kpi-label">
            Next Month Revenue
          </span>
          <span className="kpi-value">
            $21,000
          </span>
        </div>

        <div className="kpi-summary-card">
          <span className="kpi-label">
            Quarterly Forecast
          </span>
          <span className="kpi-value">
            $68,500
          </span>
        </div>

        <div className="kpi-summary-card">
          <span className="kpi-label">
            Expected Growth
          </span>
          <span className="kpi-value">
            +13.5%
          </span>
        </div>

      </div>

      <div className="revenue-chart-card">

        <h4 className="chart-card-title">
          Revenue Prediction Trend
        </h4>

        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <AreaChart data={forecastData}>
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

    </div>
  );
}
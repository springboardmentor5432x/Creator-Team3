import React from "react";

export default function RevenueHealth() {

  const health = {
    score: 92,
    status: "Excellent",
    risk: "Low",
    growth: "Healthy"
  };

  return (
    <div className="revenue-dashboard">

      <h2>💚 Revenue Health Monitor</h2>

      <div className="revenue-kpi-grid">

        <div className="kpi-summary-card">
          <span className="kpi-label">
            Health Score
          </span>
          <span className="kpi-value">
            {health.score}/100
          </span>
        </div>

        <div className="kpi-summary-card">
          <span className="kpi-label">
            Status
          </span>
          <span className="kpi-value">
            {health.status}
          </span>
        </div>

        <div className="kpi-summary-card">
          <span className="kpi-label">
            Risk Level
          </span>
          <span className="kpi-value">
            {health.risk}
          </span>
        </div>

        <div className="kpi-summary-card">
          <span className="kpi-label">
            Growth Trend
          </span>
          <span className="kpi-value">
            {health.growth}
          </span>
        </div>

      </div>

      <div className="insights-box">

        <h3>AI Health Recommendation</h3>

        <ul className="insights-list">
          <li>Increase recurring subscription revenue.</li>
          <li>Maintain affiliate conversion rates.</li>
          <li>Focus on long-term sponsorships.</li>
          <li>Reduce dependency on a single platform.</li>
        </ul>

      </div>

    </div>
  );
}
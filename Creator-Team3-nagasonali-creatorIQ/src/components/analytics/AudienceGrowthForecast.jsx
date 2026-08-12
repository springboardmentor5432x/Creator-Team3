import React from "react";
import { TrendingUp, Calendar } from "lucide-react";

export default function AudienceGrowthForecast() {
  const currentFollowers = 1254300;
  const forecasts = [
    { period: "30 Days", monthlyGrowthPct: 4.8, expected: 1295400, netGain: 41100, growthPct: 3.3 },
    { period: "60 Days", monthlyGrowthPct: 5.2, expected: 1342100, netGain: 87800, growthPct: 7.0 },
    { period: "90 Days", monthlyGrowthPct: 5.6, expected: 1395800, netGain: 141500, growthPct: 11.3 }
  ];

  return (
    <div className="theme-card" style={{ padding: "20px", borderRadius: "16px", background: "var(--bg-card)", border: "1px solid var(--border-primary)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
            <TrendingUp size={18} color="var(--accent-primary)" />
            Audience Growth Forecasting
          </h3>
          <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--text-muted)" }}>Current Followers: {currentFollowers.toLocaleString()}</p>
        </div>
        <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: "rgba(16,185,129,0.15)", color: "#10b981" }}>
          FORECAST MODEL
        </span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-primary)", color: "var(--text-muted)" }}>
              <th style={{ padding: "8px 0" }}>Forecast Period</th>
              <th>Monthly Growth</th>
              <th>Expected Followers</th>
              <th>Net Gain</th>
              <th style={{ textAlign: "right" }}>Growth %</th>
            </tr>
          </thead>
          <tbody>
            {forecasts.map((f, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid var(--border-primary)" }}>
                <td style={{ padding: "10px 0", fontWeight: 700, color: "var(--accent-primary)" }}>{f.period}</td>
                <td style={{ color: "var(--text-secondary)" }}>+{f.monthlyGrowthPct}%</td>
                <td style={{ fontWeight: 700, color: "var(--text-primary)" }}>{f.expected.toLocaleString()}</td>
                <td style={{ color: "#10b981", fontWeight: 600 }}>+{f.netGain.toLocaleString()}</td>
                <td style={{ textAlign: "right", color: "#10b981", fontWeight: 700 }}>+{f.growthPct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from "react";
import { growthInsightsData } from "../../data/dummyAnalytics";

export default function GrowthInsights() {
  return (
    <div className="chart-card p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-4">Growth Insights & Recommendations</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "15px",
        }}
      >
        {growthInsightsData.map((item, index) => (
          <div
            key={index}
            style={{
              padding: "16px",
              borderRadius: "12px",
              background: "rgba(30, 41, 59, 0.7)",
              border: "1px solid rgba(51, 65, 85, 0.8)",
            }}
          >
            <h4 style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "6px", fontWeight: "600" }}>
              {item.title}
            </h4>
            <p style={{ color: "#f8fafc", fontSize: "1rem", fontWeight: "600" }}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

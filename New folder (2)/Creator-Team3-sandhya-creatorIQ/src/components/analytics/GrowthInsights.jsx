import React from "react";
import { growthInsightsData } from "../../data/dummyAnalytics";

export default function GrowthInsights() {
  return (
    <div className="chart-card">
      <h3>Growth Insights & Recommendations</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "15px",
        }}
      >
        {growthInsightsData.map((item, index) => (
          <div
            key={index}
            style={{
              padding: "15px",
              borderRadius: "10px",
              background: "#1e293b",
            }}
          >
            <h4>{item.title}</h4>
            <p>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
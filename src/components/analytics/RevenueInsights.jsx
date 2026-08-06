import React from "react";

export default function RevenueInsights() {

  const insights = [
    {
      title: "Instagram Growth",
      recommendation:
        "Increase sponsored content on Instagram by 15%."
    },
    {
      title: "Affiliate Revenue",
      recommendation:
        "Promote high-converting affiliate products."
    },
    {
      title: "Subscriptions",
      recommendation:
        "Launch Premium Membership tier."
    },
    {
      title: "YouTube Revenue",
      recommendation:
        "Focus on long-form videos for ad revenue."
    }
  ];

  return (
    <div className="revenue-dashboard">

      <h2>🤖 AI Revenue Insights</h2>

      <div className="revenue-kpi-grid">

        {insights.map((item, index) => (
          <div
            key={index}
            className="kpi-summary-card"
          >
            <span className="kpi-label">
              {item.title}
            </span>

            <p
              style={{
                marginTop: "10px",
                lineHeight: "1.6",
                color:
                  "var(--text-secondary)"
              }}
            >
              {item.recommendation}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
}
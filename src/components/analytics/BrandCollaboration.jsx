import React from "react";

export default function BrandCollaboration() {
  const stats = [
    {
      title: "Active Collaborations",
      value: 12,
      icon: "🤝"
    },
    {
      title: "Completed Collaborations",
      value: 34,
      icon: "✅"
    },
    {
      title: "Revenue Generated",
      value: "$48,500",
      icon: "💰"
    },
    {
      title: "Pending Payments",
      value: "$7,200",
      icon: "⏳"
    }
  ];

  return (
    <div>
      <h2
        style={{
          marginBottom: "1.5rem"
        }}
      >
        📢 Brand Collaboration Manager
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "1.5rem"
        }}
      >
        {stats.map((card, index) => (
          <div
            key={index}
            className="kpi-summary-card"
          >
            <div
              style={{
                fontSize: "2rem"
              }}
            >
              {card.icon}
            </div>

            <div
              style={{
                color: "var(--text-secondary)"
              }}
            >
              {card.title}
            </div>

            <div
              style={{
                fontSize: "1.8rem",
                fontWeight: "700"
              }}
            >
              {card.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
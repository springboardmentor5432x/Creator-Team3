import React from "react";

function formatNumber(value) {
  if (value === null || value === undefined) {
    return "0";
  }

  const number = Number(value);

  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  }

  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }

  return number.toLocaleString();
}

export default function BrandKPICards({ data = {} }) {
  const cards = [
    {
      title: "Active Campaigns",
      value: formatNumber(data.activeCampaigns),
      change: data.activeCampaignsChange,
      icon: "📢",
    },
    {
      title: "Total Reach",
      value: formatNumber(data.totalReach),
      change: data.totalReachChange,
      icon: "👁️",
    },
    {
      title: "Total Engagement",
      value: formatNumber(data.totalEngagement),
      change: data.totalEngagementChange,
      icon: "❤️",
    },
    {
      title: "Campaign Spend",
      value: `$${formatNumber(data.campaignSpend)}`,
      change: data.campaignSpendChange,
      icon: "💰",
    },
  ];

  return (
    <div className="brand-kpi-grid">
      {cards.map((card) => (
        <div
          className="brand-kpi-card"
          key={card.title}
        >
          <div className="brand-kpi-top">
            <span className="brand-kpi-title">
              {card.title}
            </span>

            <span className="brand-kpi-icon">
              {card.icon}
            </span>
          </div>

          <h2>
            {card.value}
          </h2>

          <p className="positive-change">
            ↑ {card.change || "0%"}
          </p>
        </div>
      ))}
    </div>
  );
}
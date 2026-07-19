import React from "react";

export default function BrandKPICards() {

  const cards = [

    {
      title: "Active Campaigns",
      value: "12",
      change: "+3 this month",
      icon: "📢",
      positive: true,
    },

    {
      title: "Total Reach",
      value: "24.8M",
      change: "+18.4%",
      icon: "👁️",
      positive: true,
    },

    {
      title: "Total Engagement",
      value: "1.84M",
      change: "+12.7%",
      icon: "❤️",
      positive: true,
    },

    {
      title: "Campaign Spend",
      value: "$84.2K",
      change: "+8.2%",
      icon: "💰",
      positive: true,
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
            ↑ {card.change}
          </p>

        </div>

      ))}

    </div>

  );
}
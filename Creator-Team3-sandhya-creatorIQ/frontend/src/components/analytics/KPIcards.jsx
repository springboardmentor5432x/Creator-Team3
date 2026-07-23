export default function KPICards() {
  const cards = [
    {
      title: "Total Followers",
      value: "1.25M",
      icon: "👥",
      change: "↑ 12.4%",
      positive: true,
    },
    {
      title: "Total Views",
      value: "8.43M",
      icon: "👁️",
      change: "↑ 8.2%",
      positive: true,
    },
    {
      title: "Total Likes",
      value: "1.24M",
      icon: "❤️",
      change: "↑ 5.1%",
      positive: true,
    },
    {
      title: "Total Comments",
      value: "89.3K",
      icon: "💬",
      change: "↓ 2.4%",
      positive: false,
    },
    {
      title: "Engagement Rate",
      value: "4.85%",
      icon: "📊",
      change: "↑ 0.6%",
      positive: true,
    },
  ];

  return (
    <section className="kpi-section">

      {cards.map((card, index) => (
        <div className="kpi-card" key={index}>

          <p className="kpi-title">
            {card.title}
          </p>

          <h2 className="kpi-value">
            {card.value}
          </h2>

          <div className="kpi-bottom">

            <span className="kpi-icon">
              {card.icon}
            </span>

            <span
              className={
                card.positive
                  ? "kpi-change positive"
                  : "kpi-change negative"
              }
            >
              {card.change}
            </span>

          </div>

        </div>
      ))}

    </section>
  );
}
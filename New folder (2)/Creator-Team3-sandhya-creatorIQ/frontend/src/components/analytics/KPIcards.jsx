function formatNumber(value) {
  if (value === null || value === undefined) {
    return "0";
  }

  const number = Number(value);

  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(2)}M`;
  }

  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }

  return number.toLocaleString();
}

function formatPercentage(value) {
  if (value === null || value === undefined) {
    return "0%";
  }

  return `${Number(value).toFixed(2)}%`;
}

export default function KPICards({ data = {} }) {
  const cards = [
    {
      title: "Total Followers",
      value: formatNumber(data.followers?.value),
      icon: "👥",
      change: data.followers?.change ?? 0,
      positive: data.followers?.status === "positive",
    },
    {
      title: "Total Views",
      value: formatNumber(data.views?.value),
      icon: "👁️",
      change: data.views?.change ?? 0,
      positive: data.views?.status === "positive",
    },
    {
      title: "Total Likes",
      value: formatNumber(data.likes?.value),
      icon: "❤️",
      change: data.likes?.change ?? 0,
      positive: data.likes?.status === "positive",
    },
    {
      title: "Total Comments",
      value: formatNumber(data.comments?.value),
      icon: "💬",
      change: data.comments?.change ?? 0,
      positive: data.comments?.status === "positive",
    },
    {
      title: "Engagement Rate",
      value: formatPercentage(
        data.engagementRate?.value
      ),
      icon: "📊",
      change: data.engagementRate?.change ?? 0,
      positive:
        data.engagementRate?.status === "positive",
    },
  ];

  return (
    <section className="kpi-section">
      {cards.map((card, index) => (
        <div
          className="kpi-card"
          key={index}
        >
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
              {card.positive ? "↑" : "↓"}{" "}
              {Number(card.change).toFixed(1)}%
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}
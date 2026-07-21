import React from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const formatNumber = (num) => {
  const value = Number(num);

  if (!Number.isFinite(value)) {
    return "0";
  }

  if (value >= 1000000) {
    return `${(value / 1000000)
      .toFixed(1)
      .replace(".0", "")}M`;
  }

  if (value >= 1000) {
    return `${(value / 1000)
      .toFixed(1)
      .replace(".0", "")}K`;
  }

  return value.toLocaleString();
};

function CustomTooltip({
  active,
  payload,
  label,
}) {
  if (
    !active ||
    !payload ||
    !payload.length
  ) {
    return null;
  }

  return (
    <div
      style={{
        background: "#0f172a",
        border:
          "1px solid rgba(255,255,255,0.15)",
        borderRadius: "10px",
        padding: "12px",
        color: "#fff",
      }}
    >
      <p
        style={{
          color: "#94a3b8",
          marginBottom: "8px",
          fontWeight: 600,
        }}
      >
        {label}
      </p>

      {payload.map((item) => (
        <p
          key={item.name}
          style={{
            color: item.color,
            margin: "5px 0",
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <span>{item.name}</span>

          <b>
            {Number(item.value).toLocaleString()}
          </b>
        </p>
      ))}
    </div>
  );
}

export default function EngagementBarChart({
  data = [],
}) {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
        }}
      >
        No engagement data available
      </div>
    );
  }

  return (
    <div className="chart-wrapper">
      <div
        style={{
          width: "100%",
          height: 300,
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />

            <XAxis
              dataKey="platform"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatNumber}
            />

            <Tooltip
              content={
                <CustomTooltip />
              }
            />

            <Legend
              verticalAlign="bottom"
              height={40}
            />

            <Bar
              name="Likes"
              dataKey="likes"
              fill="#ec4899"
              radius={[5, 5, 0, 0]}
            />

            <Bar
              name="Comments"
              dataKey="comments"
              fill="#06b6d4"
              radius={[5, 5, 0, 0]}
            />

            <Bar
              name="Shares"
              dataKey="shares"
              fill="#10b981"
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
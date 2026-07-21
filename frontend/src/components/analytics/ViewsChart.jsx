import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function ViewsChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="empty-chart">
        No views data available
      </div>
    );
  }

  const formattedData = data.map((item) => ({
    name:
      item.month ||
      item.name ||
      item.date,

    views:
      Number(
        item.views ||
        item.value ||
        0
      ),
  }));

  return (
    <div style={{ width: "100%", height: 280 }}>

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <LineChart data={formattedData}>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
          />

          <XAxis
            dataKey="name"
            stroke="#94a3b8"
          />

          <YAxis
            stroke="#94a3b8"
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="views"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}
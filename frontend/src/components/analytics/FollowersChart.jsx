import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function FollowersChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="empty-chart">
        No follower data available
      </div>
    );
  }

  const formattedData = data.map((item) => ({
    name:
      item.month ||
      item.name ||
      item.date,

    followers:
      Number(
        item.followers ||
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
            tickFormatter={(value) =>
              value.toLocaleString()
            }
          />

          <Tooltip
            formatter={(value) =>
              Number(value).toLocaleString()
            }
          />

          <Line
            type="monotone"
            dataKey="followers"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}
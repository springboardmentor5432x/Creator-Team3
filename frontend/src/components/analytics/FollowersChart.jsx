import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const followerData = [
  { month: "Jan", followers: 820000 },
  { month: "Feb", followers: 900000 },
  { month: "Mar", followers: 980000 },
  { month: "Apr", followers: 1080000 },
  { month: "May", followers: 1160000 },
  { month: "Jun", followers: 1250000 },
];

export default function FollowersChart() {
  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={followerData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis
            tickFormatter={(value) =>
              `${(value / 1000000).toFixed(1)}M`
            }
          />

          <Tooltip
            formatter={(value) =>
              [`${value.toLocaleString()}`, "Followers"]
            }
          />

          <Line
            type="monotone"
            dataKey="followers"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
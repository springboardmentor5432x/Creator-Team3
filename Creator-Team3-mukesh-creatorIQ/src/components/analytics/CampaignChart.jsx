import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", reach: 2.1 },
  { month: "Feb", reach: 3.4 },
  { month: "Mar", reach: 4.2 },
  { month: "Apr", reach: 5.8 },
  { month: "May", reach: 7.2 },
  { month: "Jun", reach: 8.6 },
];

export default function CampaignChart() {
  return (
    <div className="brand-chart-content">
      <div className="chart-header">
        <div>
          <h3>Campaign Performance</h3>
          <p>Campaign reach and growth</p>
        </div>
        <select defaultValue="6months">
          <option value="6months">Last 6 Months</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="brand-chart">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="reach"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", engagement: 6.2 },
  { month: "Feb", engagement: 7.1 },
  { month: "Mar", engagement: 6.8 },
  { month: "Apr", engagement: 8.4 },
  { month: "May", engagement: 7.9 },
  { month: "Jun", engagement: 9.1 },
];

export default function BrandEngagement() {
  return (
    <div className="brand-chart-content">
      <div className="chart-header">
        <div>
          <h3>Brand Engagement</h3>
          <p>Engagement performance over time</p>
        </div>
        <select defaultValue="6months">
          <option value="6months">Last 6 Months</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="brand-chart">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="engagement"
              fill="#06b6d4"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

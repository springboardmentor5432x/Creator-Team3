import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { contentGrowthData } from "../../data/dummyAnalytics";

export default function ContentGrowthTracking() {
  return (
    <div className="chart-card">
      <h3>Content Growth Tracking</h3>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={contentGrowthData}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            type="category"
            dataKey="content"
          />
          <Tooltip />

          <Bar
            dataKey="growth"
            fill="#8b5cf6"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
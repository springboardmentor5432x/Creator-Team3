import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { categoryPerformance } from "../../data/dummyAnalytics";

export default function TrendDetectionChart() {
  return (
    <div className="chart-card">
      <h3>Trend Detection</h3>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={categoryPerformance}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Bar dataKey="views" fill="#3b82f6" />
          <Bar dataKey="likes" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
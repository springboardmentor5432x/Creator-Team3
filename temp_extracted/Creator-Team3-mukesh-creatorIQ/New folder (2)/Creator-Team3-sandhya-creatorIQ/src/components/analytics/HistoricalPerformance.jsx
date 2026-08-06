import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

import { historicalPerformanceData } from "../../data/dummyAnalytics";

export default function HistoricalPerformance() {
  return (
    <div className="chart-card">
      <h3>Historical Performance</h3>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={historicalPerformanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Bar
            dataKey="views"
            fill="#3b82f6"
          />

          <Bar
            dataKey="engagement"
            fill="#10b981"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
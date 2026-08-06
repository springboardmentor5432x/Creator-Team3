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
    <div className="chart-card p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-4">Historical Performance</h3>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={historicalPerformanceData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="period" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
          />
          <Legend />

          <Bar
            dataKey="views"
            fill="#3b82f6"
            radius={[6, 6, 0, 0]}
            name="Views"
          />

          <Bar
            dataKey="engagement"
            fill="#10b981"
            radius={[6, 6, 0, 0]}
            name="Engagement %"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

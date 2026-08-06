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
    <div className="chart-card p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-4">Content Growth Tracking</h3>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={contentGrowthData}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis type="number" stroke="#94a3b8" />
          <YAxis
            type="category"
            dataKey="content"
            stroke="#94a3b8"
            tick={{ fill: '#cbd5e1', fontSize: 12 }}
            width={140}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
          />

          <Bar
            dataKey="growth"
            fill="#8b5cf6"
            radius={[0, 8, 8, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

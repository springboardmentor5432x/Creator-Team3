import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function GrowthMonitoringChart({ data }) {
  return (
    <div className="chart-card p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-4">Growth Monitoring</h3>

      <ResponsiveContainer width="100%" height={380}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

          <XAxis dataKey="month" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />

          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
          />
          <Legend />

          <Line
            type="monotone"
            dataKey="followers"
            stroke="#3b82f6"
            strokeWidth={3}
            name="Followers"
          />

          <Line
            type="monotone"
            dataKey="subscribers"
            stroke="#10b981"
            strokeWidth={3}
            name="Subscribers"
          />

          <Line
            type="monotone"
            dataKey="views"
            stroke="#f59e0b"
            strokeWidth={3}
            name="Views"
          />

          <Line
            type="monotone"
            dataKey="watchTime"
            stroke="#8b5cf6"
            strokeWidth={3}
            name="Watch Time"
          />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#ef4444"
            strokeWidth={3}
            name="Revenue"
          />

          <Line
            type="monotone"
            dataKey="engagement"
            stroke="#06b6d4"
            strokeWidth={3}
            name="Engagement"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

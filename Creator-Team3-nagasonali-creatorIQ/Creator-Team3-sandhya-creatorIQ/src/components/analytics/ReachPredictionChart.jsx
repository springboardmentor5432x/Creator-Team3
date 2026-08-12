import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", reach: 120000 },
  { month: "Feb", reach: 140000 },
  { month: "Mar", reach: 180000 },
  { month: "Apr", reach: 220000 },
  { month: "May", reach: 260000 },
];

export default function ReachPrediction() {
  return (
    <div className="growth-card">
      <h3>Reach Prediction</h3>

      <div style={{ height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              dataKey="reach"
              stroke="#8b5cf6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
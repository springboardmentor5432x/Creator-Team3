import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { name: "#React", value: 40 },
  { name: "#Coding", value: 30 },
  { name: "#AI", value: 20 },
  { name: "#Tech", value: 10 },
];

const colors = ["#3b82f6", "#10b981", "#ec4899", "#f59e0b"];

export default function HashtagAnalysisChart() {
  return (
    <div className="growth-card">
      <h3>Hashtag Analysis</h3>

      <div style={{ height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={100}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={colors[index]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Target, TrendingUp } from "lucide-react";

const predictionData = [
  { period: "Previous", reach: 180000, avgReach: 210000, predictedViews: 650000, estimatedEng: "4.5%" },
  { period: "Current", reach: 240000, avgReach: 210000, predictedViews: 820000, estimatedEng: "4.8%" },
  { period: "+30 Days", reach: 290000, avgReach: 210000, predictedViews: 980000, estimatedEng: "5.2%" },
  { period: "+60 Days", reach: 350000, avgReach: 210000, predictedViews: 1150000, estimatedEng: "5.6%" },
  { period: "+90 Days", reach: 420000, avgReach: 210000, predictedViews: 1380000, estimatedEng: "6.0%" }
];

export default function ReachPredictionChart() {
  return (
    <div className="theme-card" style={{ padding: "20px", borderRadius: "16px", background: "var(--bg-card)", border: "1px solid var(--border-primary)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
          <Target size={18} color="var(--accent-primary)" />
          Algorithmic Reach & Engagement Prediction
        </h3>
        <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: "rgba(59,130,246,0.15)", color: "var(--accent-primary)" }}>
          OLS REGRESSION
        </span>
      </div>

      {/* Metric Cards Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "16px" }}>
        <div style={{ padding: "10px", borderRadius: "8px", background: "var(--bg-input)" }}>
          <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>Previous Reach</div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>180,000</div>
        </div>
        <div style={{ padding: "10px", borderRadius: "8px", background: "var(--bg-input)" }}>
          <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>Average Reach</div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>210,000</div>
        </div>
        <div style={{ padding: "10px", borderRadius: "8px", background: "var(--bg-input)" }}>
          <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>Predicted (+90d)</div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#10b981" }}>420,000</div>
        </div>
        <div style={{ padding: "10px", borderRadius: "8px", background: "var(--bg-input)" }}>
          <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>Est. Engagement</div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#10b981" }}>6.0%</div>
        </div>
      </div>

      <div style={{ height: 210 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={predictionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
            <XAxis dataKey="period" stroke="var(--text-secondary)" style={{ fontSize: "11px" }} />
            <YAxis stroke="var(--text-secondary)" style={{ fontSize: "11px" }} />
            <Tooltip contentStyle={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)", color: "var(--text-primary)", borderRadius: "8px" }} />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Line dataKey="reach" name="Predicted Reach" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
            <Line dataKey="avgReach" name="Historical Average" stroke="var(--text-muted)" strokeDasharray="5 5" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

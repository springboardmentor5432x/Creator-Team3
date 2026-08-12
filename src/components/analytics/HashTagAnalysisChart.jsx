import React from "react";
import { Hash, TrendingUp } from "lucide-react";

const hashtagMetrics = [
  { tag: "#AIAutomation", reach: 450000, impressions: 820000, engagement: "9.2%", isBest: true },
  { tag: "#React19", reach: 380000, impressions: 640000, engagement: "8.5%", isBest: true },
  { tag: "#Fullstack", reach: 290000, impressions: 480000, engagement: "7.1%", isBest: false },
  { tag: "#FastAPI", reach: 210000, impressions: 350000, engagement: "6.8%", isBest: false }
];

export default function HashTagAnalysisChart() {
  return (
    <div className="theme-card" style={{ padding: "20px", borderRadius: "16px", background: "var(--bg-card)", border: "1px solid var(--border-primary)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
          <Hash size={18} color="var(--accent-primary)" />
          Hashtag Virality & Reach Analysis
        </h3>
        <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: "rgba(16,185,129,0.15)", color: "#10b981" }}>
          TOP TAGS
        </span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-primary)", color: "var(--text-muted)" }}>
              <th style={{ padding: "8px 0" }}>Hashtag</th>
              <th>Reach</th>
              <th>Impressions</th>
              <th>Engagement</th>
              <th style={{ textAlign: "right" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {hashtagMetrics.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid var(--border-primary)" }}>
                <td style={{ padding: "10px 0", fontWeight: 700, color: "var(--accent-primary)" }}>{item.tag}</td>
                <td style={{ color: "var(--text-primary)" }}>{item.reach.toLocaleString()}</td>
                <td style={{ color: "var(--text-secondary)" }}>{item.impressions.toLocaleString()}</td>
                <td style={{ color: "#10b981", fontWeight: 700 }}>{item.engagement}</td>
                <td style={{ textAlign: "right" }}>
                  {item.isBest ? (
                    <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "8px", background: "rgba(16,185,129,0.15)", color: "#10b981" }}>
                      ⭐ BEST HASHTAG
                    </span>
                  ) : (
                    <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>Standard</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Scale, CheckSquare, BarChart2, Table } from "lucide-react";

export default function CompareContent() {
  const [allItems, setAllItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [viewMode, setViewMode] = useState("chart"); // 'chart', 'table', 'cards'

  useEffect(() => {
    const fetchCompare = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:8000/api/analytics/compare", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          const items = data.allItems || [];
          setAllItems(items);
          if (items.length >= 2) {
            setSelectedIds([items[0].id, items[1].id]);
          } else if (items.length === 1) {
            setSelectedIds([items[0].id]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch content comparison data:", error);
      }
    };
    fetchCompare();
  }, []);

  const handleToggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter(i => i !== id));
      }
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedItems = allItems.filter(item => selectedIds.includes(item.id));

  // Chart data formatting
  const chartMetrics = [
    { metric: "Views (k)", key: "views", scale: 0.001 },
    { metric: "Likes", key: "likes", scale: 1 },
    { metric: "Comments", key: "comments", scale: 1 },
    { metric: "Shares", key: "shares", scale: 1 },
    { metric: "Saves", key: "saves", scale: 1 },
    { metric: "Watch Time (hrs)", key: "watchTimeHours", scale: 1 },
    { metric: "Reach (k)", key: "reach", scale: 0.001 }
  ];

  const chartData = chartMetrics.map(m => {
    const row = { metric: m.metric };
    selectedItems.forEach((item, idx) => {
      row[`Item ${idx + 1}: ${item.title.substring(0, 15)}...`] = Math.round((item[m.key] || 0) * m.scale);
    });
    return row;
  });

  const colors = ["#3b82f6", "#10b981", "#ec4899", "#f59e0b", "#8b5cf6"];

  return (
    <div className="theme-card" style={{ padding: "22px", borderRadius: "16px", background: "var(--bg-card)", border: "1px solid var(--border-primary)" }}>
      {/* Title & Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
            <Scale size={18} color="var(--accent-primary)" />
            Multi-Content Performance Comparison
          </h3>
          <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text-muted)" }}>
            Compare views, likes, comments, shares, saves, watch time, reach, and engagement across posts
          </p>
        </div>

        {/* View Mode Switcher */}
        <div style={{ display: "flex", background: "var(--bg-input)", padding: "4px", borderRadius: "8px", border: "1px solid var(--border-primary)", gap: "4px" }}>
          <button
            onClick={() => setViewMode("chart")}
            style={{
              padding: "5px 12px", borderRadius: "6px", border: "none",
              background: viewMode === "chart" ? "var(--accent-primary)" : "transparent",
              color: viewMode === "chart" ? "#fff" : "var(--text-secondary)", fontSize: "12px", fontWeight: 600, cursor: "pointer"
            }}
          >
            Chart
          </button>
          <button
            onClick={() => setViewMode("table")}
            style={{
              padding: "5px 12px", borderRadius: "6px", border: "none",
              background: viewMode === "table" ? "var(--accent-primary)" : "transparent",
              color: viewMode === "table" ? "#fff" : "var(--text-secondary)", fontSize: "12px", fontWeight: 600, cursor: "pointer"
            }}
          >
            Table
          </button>
          <button
            onClick={() => setViewMode("cards")}
            style={{
              padding: "5px 12px", borderRadius: "6px", border: "none",
              background: viewMode === "cards" ? "var(--accent-primary)" : "transparent",
              color: viewMode === "cards" ? "#fff" : "var(--text-secondary)", fontSize: "12px", fontWeight: 600, cursor: "pointer"
            }}
          >
            Side-by-Side Cards
          </button>
        </div>
      </div>

      {/* Multi-Select Item Pills */}
      <div style={{ marginBottom: "20px" }}>
        <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "8px" }}>
          Select Content Items to Compare:
        </span>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {allItems.map(item => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleToggleSelect(item.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "20px",
                  border: isSelected ? "1px solid var(--accent-primary)" : "1px solid var(--border-primary)",
                  background: isSelected ? "rgba(59, 130, 246, 0.15)" : "var(--bg-input)",
                  color: isSelected ? "var(--accent-primary)" : "var(--text-secondary)",
                  fontSize: "12px", fontWeight: 600, cursor: "pointer"
                }}
              >
                <CheckSquare size={14} color={isSelected ? "var(--accent-primary)" : "var(--text-muted)"} />
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode 1: Chart Comparison */}
      {viewMode === "chart" && (
        <div style={{ width: "100%", height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="metric" stroke="var(--text-secondary)" style={{ fontSize: "11px" }} />
              <YAxis stroke="var(--text-secondary)" style={{ fontSize: "11px" }} />
              <Tooltip contentStyle={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)", color: "var(--text-primary)", borderRadius: "8px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              {selectedItems.map((item, idx) => (
                <Bar key={item.id} dataKey={`Item ${idx + 1}: ${item.title.substring(0, 15)}...`} fill={colors[idx % colors.length]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Mode 2: Table Matrix Comparison */}
      {viewMode === "table" && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-primary)", color: "var(--text-muted)" }}>
                <th style={{ padding: "10px" }}>Metric</th>
                {selectedItems.map((item, idx) => (
                  <th key={item.id} style={{ padding: "10px", color: colors[idx % colors.length] }}>
                    {item.title} ({item.platform})
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Views", key: "views", fmt: v => v.toLocaleString() },
                { label: "Likes", key: "likes", fmt: v => v.toLocaleString() },
                { label: "Comments", key: "comments", fmt: v => v.toLocaleString() },
                { label: "Shares", key: "shares", fmt: v => v.toLocaleString() },
                { label: "Saves", key: "saves", fmt: v => v.toLocaleString() },
                { label: "Watch Time (Hours)", key: "watchTimeHours", fmt: v => `${v}h` },
                { label: "Reach", key: "reach", fmt: v => v.toLocaleString() },
                { label: "Engagement Rate", key: "engagement", fmt: v => `${v}%` }
              ].map(row => (
                <tr key={row.key} style={{ borderBottom: "1px solid var(--border-primary)" }}>
                  <td style={{ padding: "10px", fontWeight: 600, color: "var(--text-primary)" }}>{row.label}</td>
                  {selectedItems.map(item => (
                    <td key={item.id} style={{ padding: "10px", color: "var(--text-secondary)" }}>
                      {row.fmt(item[row.key] || 0)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mode 3: Side-by-Side Cards */}
      {viewMode === "cards" && (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))`, gap: "16px" }}>
          {selectedItems.map((item, idx) => (
            <div key={item.id} style={{ padding: "16px", borderRadius: "12px", background: "var(--bg-input)", border: `1px solid ${colors[idx % colors.length]}` }}>
              <h4 style={{ margin: "0 0 10px", fontSize: "14px", fontWeight: 700, color: colors[idx % colors.length] }}>
                {item.title}
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: "var(--text-secondary)" }}>
                <div>Views: <strong style={{ color: "var(--text-primary)" }}>{(item.views || 0).toLocaleString()}</strong></div>
                <div>Likes: <strong>{(item.likes || 0).toLocaleString()}</strong></div>
                <div>Comments: <strong>{(item.comments || 0).toLocaleString()}</strong></div>
                <div>Shares: <strong>{(item.shares || 0).toLocaleString()}</strong></div>
                <div>Saves: <strong>{(item.saves || 0).toLocaleString()}</strong></div>
                <div>Watch Time: <strong>{item.watchTimeHours || 0} hrs</strong></div>
                <div>Reach: <strong>{(item.reach || 0).toLocaleString()}</strong></div>
                <div>Engagement: <strong style={{ color: "#10b981" }}>{item.engagement}%</strong></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

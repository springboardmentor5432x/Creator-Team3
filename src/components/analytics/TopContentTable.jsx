import React, { useEffect, useState } from "react";
import { Search, Filter, Calendar, ArrowUpDown, Eye, Heart, MessageSquare, Share2, Bookmark, Clock, Target, Activity } from "lucide-react";

export default function TopContentTable() {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState("views");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchTopContent = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = `http://127.0.0.1:8000/api/analytics/top-content?sortBy=${sortBy}&sortOrder=${sortOrder}&platform=${selectedPlatform}&search=${encodeURIComponent(searchQuery)}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch top content:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopContent();
  }, [sortBy, sortOrder, selectedPlatform, searchQuery, dateFilter]);

  const handleSort = (metric) => {
    if (sortBy === metric) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(metric);
      setSortOrder("desc");
    }
  };

  return (
    <div className="theme-card" style={{ padding: "22px", borderRadius: "16px", background: "var(--bg-card)", border: "1px solid var(--border-primary)" }}>
      {/* Header & Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
            📊 Content Performance Dashboard
          </h3>
          <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text-muted)" }}>
            Granular content performance metrics, thumbnails, publish dates, and engagement analytics
          </p>
        </div>

        {/* Controls: Search, Platform & Date Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* Search Bar */}
          <div style={{ display: "flex", alignItems: "center", background: "var(--bg-input)", border: "1px solid var(--border-primary)", borderRadius: "8px", padding: "6px 12px", gap: "8px" }}>
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search content title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: "transparent", border: "none", outline: "none", color: "var(--text-primary)", fontSize: "12px", width: "160px" }}
            />
          </div>

          {/* Platform Filter */}
          <div style={{ display: "flex", alignItems: "center", background: "var(--bg-input)", border: "1px solid var(--border-primary)", borderRadius: "8px", padding: "6px 10px", gap: "6px" }}>
            <Filter size={14} color="var(--text-muted)" />
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              style={{ background: "transparent", border: "none", outline: "none", color: "var(--text-primary)", fontSize: "12px", cursor: "pointer" }}
            >
              <option value="All">All Platforms</option>
              <option value="YouTube">YouTube</option>
              <option value="Instagram">Instagram</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Twitter">Twitter / X</option>
              <option value="Twitch">Twitch</option>
            </select>
          </div>

          {/* Date Filter */}
          <div style={{ display: "flex", alignItems: "center", background: "var(--bg-input)", border: "1px solid var(--border-primary)", borderRadius: "8px", padding: "6px 10px", gap: "6px" }}>
            <Calendar size={14} color="var(--text-muted)" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{ background: "transparent", border: "none", outline: "none", color: "var(--text-primary)", fontSize: "12px", cursor: "pointer" }}
            >
              <option value="all">All Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-primary)", color: "var(--text-muted)", background: "rgba(255,255,255,0.02)" }}>
              <th style={{ padding: "10px" }}>#</th>
              <th style={{ padding: "10px" }}>Content Item</th>
              <th style={{ padding: "10px" }}>Platform</th>
              <th style={{ padding: "10px" }}>Publish Date</th>
              <th onClick={() => handleSort("views")} style={{ padding: "10px", cursor: "pointer", userSelect: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: sortBy === "views" ? "var(--accent-primary)" : "inherit" }}>
                  <Eye size={12} /> Views <ArrowUpDown size={10} />
                </div>
              </th>
              <th onClick={() => handleSort("likes")} style={{ padding: "10px", cursor: "pointer", userSelect: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: sortBy === "likes" ? "var(--accent-primary)" : "inherit" }}>
                  <Heart size={12} /> Likes <ArrowUpDown size={10} />
                </div>
              </th>
              <th onClick={() => handleSort("comments")} style={{ padding: "10px", cursor: "pointer", userSelect: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: sortBy === "comments" ? "var(--accent-primary)" : "inherit" }}>
                  <MessageSquare size={12} /> Comments <ArrowUpDown size={10} />
                </div>
              </th>
              <th onClick={() => handleSort("shares")} style={{ padding: "10px", cursor: "pointer", userSelect: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: sortBy === "shares" ? "var(--accent-primary)" : "inherit" }}>
                  <Share2 size={12} /> Shares <ArrowUpDown size={10} />
                </div>
              </th>
              <th onClick={() => handleSort("saves")} style={{ padding: "10px", cursor: "pointer", userSelect: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: sortBy === "saves" ? "var(--accent-primary)" : "inherit" }}>
                  <Bookmark size={12} /> Saves <ArrowUpDown size={10} />
                </div>
              </th>
              <th onClick={() => handleSort("watch_time")} style={{ padding: "10px", cursor: "pointer", userSelect: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: sortBy === "watch_time" ? "var(--accent-primary)" : "inherit" }}>
                  <Clock size={12} /> Watch Time <ArrowUpDown size={10} />
                </div>
              </th>
              <th onClick={() => handleSort("reach")} style={{ padding: "10px", cursor: "pointer", userSelect: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: sortBy === "reach" ? "var(--accent-primary)" : "inherit" }}>
                  <Target size={12} /> Reach <ArrowUpDown size={10} />
                </div>
              </th>
              <th onClick={() => handleSort("engagement")} style={{ padding: "10px", cursor: "pointer", userSelect: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: sortBy === "engagement" ? "var(--accent-primary)" : "inherit" }}>
                  <Activity size={12} /> Engagement <ArrowUpDown size={10} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={12} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                  Loading content telemetry...
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={12} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                  No content items match your current filter criteria.
                </td>
              </tr>
            ) : (
              posts.map((post, index) => (
                <tr key={post.id || index} style={{ borderBottom: "1px solid var(--border-primary)", transition: "background 0.15s ease" }}>
                  <td style={{ padding: "12px 10px", fontWeight: 700, color: "var(--text-muted)" }}>{post.rank || index + 1}</td>
                  <td style={{ padding: "12px 10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <img
                        src={post.thumbnail}
                        alt="Thumbnail"
                        style={{ width: "42px", height: "42px", borderRadius: "6px", objectFit: "cover", flexShrink: 0, border: "1px solid var(--border-primary)" }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "13px", lineHeight: "1.3" }}>{post.title}</div>
                        <a href={post.url} target="_blank" rel="noreferrer" style={{ fontSize: "11px", color: "var(--accent-primary)", textDecoration: "none" }}>
                          View Post →
                        </a>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 10px" }}>
                    <span style={{
                      padding: "3px 8px",
                      borderRadius: "10px",
                      background: post.platform === "YouTube" ? "rgba(255,0,0,0.15)" : post.platform === "Instagram" ? "rgba(225,48,108,0.15)" : "rgba(59,130,246,0.15)",
                      color: post.platform === "YouTube" ? "#ff4d4d" : post.platform === "Instagram" ? "#e1306c" : "#3b82f6",
                      fontSize: "11px",
                      fontWeight: 700
                    }}>
                      {post.platform}
                    </span>
                  </td>
                  <td style={{ padding: "12px 10px", color: "var(--text-secondary)" }}>{post.publishDate}</td>
                  <td style={{ padding: "12px 10px", fontWeight: 700, color: "var(--text-primary)" }}>{(post.views || 0).toLocaleString()}</td>
                  <td style={{ padding: "12px 10px", color: "var(--text-secondary)" }}>{(post.likes || 0).toLocaleString()}</td>
                  <td style={{ padding: "12px 10px", color: "var(--text-secondary)" }}>{(post.comments || 0).toLocaleString()}</td>
                  <td style={{ padding: "12px 10px", color: "var(--text-secondary)" }}>{(post.shares || 0).toLocaleString()}</td>
                  <td style={{ padding: "12px 10px", color: "var(--text-secondary)" }}>{(post.saves || 0).toLocaleString()}</td>
                  <td style={{ padding: "12px 10px", color: "var(--text-secondary)" }}>{post.watchTimeHours || 0}h</td>
                  <td style={{ padding: "12px 10px", color: "var(--text-secondary)" }}>{(post.reach || 0).toLocaleString()}</td>
                  <td style={{ padding: "12px 10px", fontWeight: 700, color: "#10b981" }}>{post.engagement}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

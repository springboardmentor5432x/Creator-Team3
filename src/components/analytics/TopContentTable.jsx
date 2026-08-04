import React, { useEffect, useState } from "react";
import { Search, Filter, ArrowUpDown, RefreshCw, Film, Eye, Heart, MessageSquare, Share2, Bookmark, Clock, Target } from "lucide-react";

export default function TopContentTable({ token: propToken }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [sortBy, setSortBy] = useState("views");
  const [sortOrder, setSortOrder] = useState("desc");

  const token = propToken || localStorage.getItem("token");

  const fetchTopContent = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        search: search.trim(),
        platform: platformFilter,
        dateFilter: dateFilter,
        sortBy: sortBy,
        sortOrder: sortOrder
      });

      const response = await fetch(
        `http://127.0.0.1:8000/api/analytics/top-content?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.ok) {
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching top content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopContent();
  }, [search, platformFilter, dateFilter, sortBy, sortOrder]);

  const handleHeaderClick = (columnKey) => {
    if (sortBy === columnKey) {
      setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortBy(columnKey);
      setSortOrder('desc');
    }
  };

  return (
    <div className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
            📊 Top Performing Content Performance Matrix
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
            Ranked content items across 8 engagement telemetry metrics with real-time API sorting and filtering
          </p>
        </div>

        {/* Filters & Search Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Search Input */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-primary)',
            padding: '6px 12px',
            borderRadius: '10px',
            fontSize: '13px'
          }}>
            <Search size={14} color="var(--text-secondary)" />
            <input
              type="text"
              placeholder="Search title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '130px', fontSize: '12px' }}
            />
          </div>

          {/* Platform Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)', padding: '6px 10px', borderRadius: '10px' }}>
            <Filter size={14} color="var(--text-secondary)" />
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
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
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
              padding: '6px 12px',
              borderRadius: '10px',
              fontSize: '12px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="All Time">All Time</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 90 Days">Last 90 Days</option>
          </select>

        </div>
      </div>

      {/* Table Container */}
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border-primary)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
              <th style={{ padding: '12px 14px', width: '50px' }}>#</th>
              <th style={{ padding: '12px 14px' }}>Content Title & Thumbnail</th>
              <th style={{ padding: '12px 14px' }}>Platform</th>
              <th style={{ padding: '12px 14px' }}>Publish Date</th>
              
              <th onClick={() => handleHeaderClick('views')} style={{ padding: '12px 14px', cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: sortBy === 'views' ? 'var(--accent-primary)' : 'inherit' }}>
                  <Eye size={13} /> Views {sortBy === 'views' ? (sortOrder === 'desc' ? '↓' : '↑') : <ArrowUpDown size={11} />}
                </div>
              </th>

              <th onClick={() => handleHeaderClick('likes')} style={{ padding: '12px 14px', cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: sortBy === 'likes' ? 'var(--accent-primary)' : 'inherit' }}>
                  <Heart size={13} /> Likes {sortBy === 'likes' ? (sortOrder === 'desc' ? '↓' : '↑') : <ArrowUpDown size={11} />}
                </div>
              </th>

              <th onClick={() => handleHeaderClick('comments')} style={{ padding: '12px 14px', cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: sortBy === 'comments' ? 'var(--accent-primary)' : 'inherit' }}>
                  <MessageSquare size={13} /> Comments {sortBy === 'comments' ? (sortOrder === 'desc' ? '↓' : '↑') : <ArrowUpDown size={11} />}
                </div>
              </th>

              <th onClick={() => handleHeaderClick('shares')} style={{ padding: '12px 14px', cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: sortBy === 'shares' ? 'var(--accent-primary)' : 'inherit' }}>
                  <Share2 size={13} /> Shares {sortBy === 'shares' ? (sortOrder === 'desc' ? '↓' : '↑') : <ArrowUpDown size={11} />}
                </div>
              </th>

              <th onClick={() => handleHeaderClick('saves')} style={{ padding: '12px 14px', cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: sortBy === 'saves' ? 'var(--accent-primary)' : 'inherit' }}>
                  <Bookmark size={13} /> Saves {sortBy === 'saves' ? (sortOrder === 'desc' ? '↓' : '↑') : <ArrowUpDown size={11} />}
                </div>
              </th>

              <th onClick={() => handleHeaderClick('watch_time')} style={{ padding: '12px 14px', cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: sortBy === 'watch_time' ? 'var(--accent-primary)' : 'inherit' }}>
                  <Clock size={13} /> Watch Time {sortBy === 'watch_time' ? (sortOrder === 'desc' ? '↓' : '↑') : <ArrowUpDown size={11} />}
                </div>
              </th>

              <th onClick={() => handleHeaderClick('reach')} style={{ padding: '12px 14px', cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: sortBy === 'reach' ? 'var(--accent-primary)' : 'inherit' }}>
                  <Target size={13} /> Reach {sortBy === 'reach' ? (sortOrder === 'desc' ? '↓' : '↑') : <ArrowUpDown size={11} />}
                </div>
              </th>

              <th onClick={() => handleHeaderClick('engagement')} style={{ padding: '12px 14px', cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: sortBy === 'engagement' ? 'var(--accent-primary)' : 'inherit' }}>
                  Eng. Rate {sortBy === 'engagement' ? (sortOrder === 'desc' ? '↓' : '↑') : <ArrowUpDown size={11} />}
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={12} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <RefreshCw className="animate-spin" size={24} style={{ margin: '0 auto 8px' }} />
                  <div>Loading content telemetry...</div>
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={12} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No content items match your current filter criteria.
                </td>
              </tr>
            ) : (
              posts.map((post, index) => (
                <tr key={post.id || index} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-muted)' }}>
                    #{post.rank || index + 1}
                  </td>

                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={post.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100"}
                        alt={post.title}
                        style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-primary)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '13px' }}>
                          {post.title}
                        </div>
                        {post.url && (
                          <a href={post.url} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: 'var(--accent-primary)', textDecoration: 'none' }}>
                            View Post ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-primary)',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--text-secondary)'
                    }}>
                      {post.platform}
                    </span>
                  </td>

                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                    {post.publishDate || '2026-07-29'}
                  </td>

                  <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {typeof post.views === 'number' ? post.views.toLocaleString() : (post.views || '0')}
                  </td>

                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                    {typeof post.likes === 'number' ? post.likes.toLocaleString() : (post.likes || '0')}
                  </td>

                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                    {typeof post.comments === 'number' ? post.comments.toLocaleString() : (post.comments || '0')}
                  </td>

                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                    {typeof post.shares === 'number' ? post.shares.toLocaleString() : (post.shares || '0')}
                  </td>

                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                    {typeof post.saves === 'number' ? post.saves.toLocaleString() : (post.saves || '0')}
                  </td>

                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                    {post.watchTimeHours ? `${post.watchTimeHours}h` : (post.watchTime || 'N/A')}
                  </td>

                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                    {typeof post.reach === 'number' ? post.reach.toLocaleString() : (post.reach || 'N/A')}
                  </td>

                  <td style={{ padding: '12px 14px', fontWeight: 800, color: '#10b981' }}>
                    {post.engagementRate ? `${post.engagementRate}%` : (post.engagement || '0.0%')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

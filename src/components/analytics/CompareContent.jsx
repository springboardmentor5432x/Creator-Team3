import React, { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { RefreshCw, BarChart2, Table, LayoutGrid, CheckCircle2 } from "lucide-react";

export default function CompareContent({ token: propToken }) {
  const [compareData, setCompareData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([1, 2]);
  const [viewMode, setViewMode] = useState("chart"); // 'chart' | 'table' | 'cards'

  const token = propToken || localStorage.getItem("token");

  const fetchCompare = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/api/analytics/compare", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCompareData(data);
      }
    } catch (error) {
      console.error('Error fetching compare data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompare();
  }, []);

  const allItems = compareData?.allItems || (compareData?.left && compareData?.right ? [compareData.left, compareData.right] : []);
  const selectedItems = allItems.filter(item => selectedIds.includes(item.id));

  const toggleItemSelection = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter(i => i !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  // Format chart data for Recharts grouped bar chart
  const chartData = [
    { metric: "Views", ...Object.fromEntries(selectedItems.map(i => [i.title, i.views || 0])) },
    { metric: "Likes", ...Object.fromEntries(selectedItems.map(i => [i.title, i.likes || 0])) },
    { metric: "Comments", ...Object.fromEntries(selectedItems.map(i => [i.title, i.comments || 0])) },
    { metric: "Shares", ...Object.fromEntries(selectedItems.map(i => [i.title, i.shares || 0])) },
    { metric: "Saves", ...Object.fromEntries(selectedItems.map(i => [i.title, i.saves || 0])) }
  ];

  const BAR_COLORS = ['#3b82f6', '#10b981', '#ec4899', '#8b5cf6'];

  if (loading) {
    return (
      <div className="theme-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <RefreshCw className="animate-spin" size={28} style={{ margin: '0 auto 12px' }} />
        <div>Loading multi-content comparison matrix...</div>
      </div>
    );
  }

  return (
    <div className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
            ⚖️ Multi-Content Performance Comparison
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
            Compare up to 4 posts side-by-side across engagement, views, watch time, reach, and virality metrics
          </p>
        </div>

        {/* View Switcher Toggle */}
        <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-primary)' }}>
          <button
            onClick={() => setViewMode('chart')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: viewMode === 'chart' ? 'var(--badge-bg)' : 'transparent',
              color: viewMode === 'chart' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              border: viewMode === 'chart' ? '1px solid var(--border-hover)' : '1px solid transparent',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <BarChart2 size={14} /> Grouped Chart
          </button>

          <button
            onClick={() => setViewMode('table')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: viewMode === 'table' ? 'var(--badge-bg)' : 'transparent',
              color: viewMode === 'table' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              border: viewMode === 'table' ? '1px solid var(--border-hover)' : '1px solid transparent',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Table size={14} /> Matrix Table
          </button>

          <button
            onClick={() => setViewMode('cards')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: viewMode === 'cards' ? 'var(--badge-bg)' : 'transparent',
              color: viewMode === 'cards' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              border: viewMode === 'cards' ? '1px solid var(--border-hover)' : '1px solid transparent',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <LayoutGrid size={14} /> Side-by-Side Cards
          </button>
        </div>
      </div>

      {/* Multi-Item Selection Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Select Content Items:</span>
        {allItems.map(item => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggleItemSelection(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '20px',
                background: isSelected ? 'var(--badge-bg)' : 'var(--bg-tertiary)',
                color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-primary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {isSelected && <CheckCircle2 size={12} />}
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>

      {/* CHART VIEW */}
      {viewMode === 'chart' && (
        <div style={{ width: '100%', height: 320, marginTop: '10px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" opacity={0.4} />
              <XAxis dataKey="metric" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-hover)', borderRadius: '12px', color: 'var(--text-primary)' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              {selectedItems.map((item, idx) => (
                <Bar key={item.id} dataKey={item.title} fill={BAR_COLORS[idx % BAR_COLORS.length]} radius={[6, 6, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* MATRIX TABLE VIEW */}
      {viewMode === 'table' && (
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border-primary)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
                <th style={{ padding: '12px 14px' }}>Metric</th>
                {selectedItems.map(item => (
                  <th key={item.id} style={{ padding: '12px 14px', color: 'var(--accent-primary)', fontWeight: 700 }}>
                    {item.title} ({item.platform})
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Views', key: 'views' },
                { label: 'Likes', key: 'likes' },
                { label: 'Comments', key: 'comments' },
                { label: 'Shares', key: 'shares' },
                { label: 'Saves', key: 'saves' },
                { label: 'Watch Time (hrs)', key: 'watchTimeHours' },
                { label: 'Unique Reach', key: 'reach' },
                { label: 'Engagement Rate', key: 'engagementRate', suffix: '%' }
              ].map((m, idx) => (
                <tr key={m.key} style={{ borderBottom: '1px solid var(--border-primary)', background: idx % 2 === 0 ? 'transparent' : 'var(--bg-tertiary)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-secondary)' }}>{m.label}</td>
                  {selectedItems.map(item => {
                    const raw = item[m.key];
                    const formatted = typeof raw === 'number' ? raw.toLocaleString() : (raw || 'N/A');
                    return (
                      <td key={item.id} style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {formatted}{m.suffix || ''}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CARDS VIEW */}
      {viewMode === 'cards' && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(selectedItems.length, 3)}, 1fr)`, gap: '16px' }}>
          {selectedItems.map((item, idx) => (
            <div key={item.id} style={{
              background: 'var(--bg-tertiary)',
              border: `1px solid ${BAR_COLORS[idx % BAR_COLORS.length]}44`,
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                  src={item.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100"}
                  alt={item.title}
                  style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>{item.title}</h4>
                  <span style={{ fontSize: '11px', color: BAR_COLORS[idx % BAR_COLORS.length], fontWeight: 700 }}>{item.platform}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', marginTop: '8px' }}>
                <div style={{ background: 'var(--bg-card)', padding: '8px 10px', borderRadius: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Views: </span>
                  <strong style={{ color: 'var(--text-primary)' }}>{typeof item.views === 'number' ? item.views.toLocaleString() : (item.views || '0')}</strong>
                </div>
                <div style={{ background: 'var(--bg-card)', padding: '8px 10px', borderRadius: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Likes: </span>
                  <strong style={{ color: 'var(--text-primary)' }}>{typeof item.likes === 'number' ? item.likes.toLocaleString() : (item.likes || '0')}</strong>
                </div>
                <div style={{ background: 'var(--bg-card)', padding: '8px 10px', borderRadius: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Comments: </span>
                  <strong style={{ color: 'var(--text-primary)' }}>{typeof item.comments === 'number' ? item.comments.toLocaleString() : (item.comments || '0')}</strong>
                </div>
                <div style={{ background: 'var(--bg-card)', padding: '8px 10px', borderRadius: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Eng. Rate: </span>
                  <strong style={{ color: '#10b981' }}>{item.engagementRate ? `${item.engagementRate}%` : (item.engagement || '0.0%')}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

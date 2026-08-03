import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const GENDER_COLORS = {
  'Female': 'var(--accent-secondary, #ec4899)',       
  'Male': 'var(--accent-primary, #3b82f6)',         
  'Non-binary / Other': '#10b981', 
  'Other': '#10b981'
};

const DEVICE_COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

// Custom Tooltip for Pies
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <span className="tooltip-indicator" style={{ backgroundColor: data.fill || data.color }}></span>
        <span className="tooltip-label">{data.name || data.range || data.country}:</span>
        <span className="tooltip-value">{data.value || data.percentage}%</span>
        <style>{`
          .custom-tooltip {
            display: flex;
            align-items: center;
            gap: 8px;
            background: var(--bg-secondary, #1e293b);
            border: 1px solid var(--border-color, rgba(255,255,255,0.08));
            padding: 8px 12px;
            border-radius: 6px;
            font-family: 'Inter', sans-serif;
            font-size: 13px;
            font-weight: 600;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(8px);
          }
          .tooltip-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }
          .tooltip-label {
            color: var(--text-secondary, #94a3b8);
          }
          .tooltip-value {
            color: var(--text-primary, #f8fafc);
            font-weight: 700;
          }
        `}</style>
      </div>
    );
  }
  return null;
};

export default function AudiencePieChart({ data: initialData, setActiveTab, isWidget, token }) {
  const [selectedPlatform, setSelectedPlatform] = useState('overall');
  const [audData, setAudData] = useState(initialData);

  useEffect(() => {
    if (token) {
      fetch(`http://127.0.0.1:8000/api/analytics/audience?platform=${selectedPlatform}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(json => setAudData(json))
        .catch(err => console.error(err));
    }
  }, [token, selectedPlatform]);

  const activeData = audData || initialData;

  // Gracefully handle compatibility with older flat gender lists
  const isDetailed = activeData && !Array.isArray(activeData) && activeData.gender;
  const genderSource = isDetailed ? activeData.gender : (Array.isArray(activeData) ? activeData : []);
  const ageSource = isDetailed ? activeData.age : [];
  const locationSource = isDetailed ? activeData.location : [];
  const deviceSource = isDetailed ? activeData.device : [];

  const genderChartData = genderSource.map((item) => ({
    ...item,
    color: GENDER_COLORS[item.name] || '#64748b'
  }));

  const deviceChartData = deviceSource.map((item, idx) => ({
    ...item,
    color: DEVICE_COLORS[idx % DEVICE_COLORS.length]
  }));

  if (activeData && activeData.available === false) {
    return (
      <div style={{
        background: 'var(--bg-secondary, #1e293b)',
        border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
        borderRadius: '20px',
        padding: '3rem 2rem',
        textAlign: 'center',
        color: 'var(--text-secondary, #94a3b8)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '540px',
        margin: '2rem auto'
      }}>
        <div style={{ fontSize: '32px' }}>🔒</div>
        <h3 style={{ margin: 0, color: 'var(--text-primary, #fff)', fontSize: '16px', fontWeight: 700 }}>
          Metric Unavailable
        </h3>
        <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5' }}>
          {activeData?.message || "This metric is not provided by the connected platform."}
        </p>
      </div>
    );
  }

  return (
    <div className="audience-dashboard-container">
      {/* Platform Switcher Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'overall', label: 'Overall', icon: '🌐' },
          { id: 'instagram', label: 'Instagram', icon: '📸' },
          { id: 'youtube', label: 'YouTube', icon: '🔴' },
          { id: 'twitter', label: 'Twitter / X', icon: '🐦' },
          { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
          { id: 'twitch', label: 'Twitch', icon: '👾' }
        ].map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedPlatform(p.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              border: selectedPlatform === p.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
              background: selectedPlatform === p.id ? 'var(--badge-bg)' : 'var(--bg-secondary)',
              color: selectedPlatform === p.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>
      <style>{`
        .audience-dashboard-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          font-family: 'Inter', sans-serif;
        }

        .audience-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
          width: 100%;
        }

        .demographics-card {
          background: var(--bg-secondary, #111827);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .card-header h3 {
          font-size: 1.05rem;
          font-weight: 700;
          margin: 0;
          color: var(--text-primary, #f8fafc);
        }

        .card-header span {
          font-size: 0.75rem;
          color: var(--text-secondary, #94a3b8);
        }

        .chart-flex {
          display: flex;
          align-items: center;
          gap: 1rem;
          height: 200px;
        }

        .chart-render {
          flex: 1;
          height: 100%;
        }

        .audience-legend {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 110px;
        }

        .legend-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--text-secondary, #94a3b8);
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 6px;
        }
      `}</style>

      <div className="audience-grid">
        {/* Gender Card */}
        {genderChartData.length > 0 && (
          <div className="demographics-card">
            <div className="card-header">
              <h3>Audience Gender Distribution</h3>
              <span>Percentage share by viewer category</span>
            </div>
            <div className="chart-flex">
              <div className="chart-render">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomTooltip />} />
                    <Pie
                      data={genderChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {genderChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: 'none' }} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="audience-legend">
                {genderChartData.map((d, i) => (
                  <div key={i} className="legend-row">
                    <div>
                      <span className="legend-dot" style={{ backgroundColor: d.color }}></span>
                      <span>{d.name.split(' ')[0]}</span>
                    </div>
                    <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Device Split Card */}
        {deviceChartData.length > 0 && (
          <div className="demographics-card">
            <div className="card-header">
              <h3>Device Platforms Split</h3>
              <span>Access channels used by subscribers</span>
            </div>
            <div className="chart-flex">
              <div className="chart-render">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomTooltip />} />
                    <Pie
                      data={deviceChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {deviceChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: 'none' }} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="audience-legend">
                {deviceChartData.map((d, i) => (
                  <div key={i} className="legend-row">
                    <div>
                      <span className="legend-dot" style={{ backgroundColor: d.color }}></span>
                      <span>{d.name}</span>
                    </div>
                    <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="audience-grid">
        {/* Age Brackets Card */}
        {ageSource.length > 0 && (
          <div className="demographics-card" style={{ flex: 1 }}>
            <div className="card-header">
              <h3>Age Bracket Segmentation</h3>
              <span>Viewer age distribution percentages</span>
            </div>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageSource} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color, rgba(255,255,255,0.08))" />
                  <XAxis dataKey="range" stroke="var(--text-secondary)" fontSize={11} />
                  <YAxis stroke="var(--text-secondary)" fontSize={11} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="percentage" fill="var(--accent-primary, #3b82f6)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Geographic Countries Card */}
        {locationSource.length > 0 && (
          <div className="demographics-card" style={{ flex: 1 }}>
            <div className="card-header">
              <h3>Top Geographic Locations</h3>
              <span>Subscribers locations by country share</span>
            </div>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationSource} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color, rgba(255,255,255,0.08))" />
                  <XAxis type="number" stroke="var(--text-secondary)" fontSize={11} tickFormatter={(v) => `${v}%`} />
                  <YAxis dataKey="country" type="category" stroke="var(--text-secondary)" fontSize={11} width={80} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="var(--accent-secondary, #ec4899)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

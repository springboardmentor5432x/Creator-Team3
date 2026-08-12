import React from 'react';
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

export default function AudiencePieChart({ data, setActiveTab, isWidget }) {
  // Gracefully handle compatibility with older flat gender lists
  const isDetailed = data && !Array.isArray(data) && data.gender;
  const genderSource = isDetailed ? data.gender : (Array.isArray(data) ? data : []);
  const ageSource = isDetailed ? data.age : [];
  const locationSource = isDetailed ? data.location : [];
  const deviceSource = isDetailed ? data.device : [];

  const genderChartData = genderSource.map((item) => ({
    ...item,
    color: GENDER_COLORS[item.name] || '#64748b'
  }));

  const deviceChartData = deviceSource.map((item, idx) => ({
    ...item,
    color: DEVICE_COLORS[idx % DEVICE_COLORS.length]
  }));

  if (!genderSource || genderSource.length === 0) {
    if (isWidget) {
      return (
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          padding: '2.5rem',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: '0.85rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: '10px',
          width: '100%',
          minHeight: '200px'
        }}>
          <span>👥 Audience Demographics</span>
          <span style={{ fontSize: '0.75rem' }}>No connected accounts found. Link your socials to view audience traits.</span>
        </div>
      );
    }
    return (
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        padding: '4rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        maxWidth: '600px',
        margin: '2rem auto',
        fontFamily: 'Inter, sans-serif',
        color: 'var(--text-primary)'
      }}>
        <div style={{ fontSize: '3.5rem' }}>👥</div>
        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>No Connected Accounts</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0, lineHeight: '1.5', maxWidth: '400px' }}>
          No connected social media accounts found. Please connect your YouTube, Instagram, or LinkedIn account in Settings to view audience demographics.
        </p>
        <button 
          type="button" 
          onClick={() => setActiveTab('settings')}
          style={{
            background: 'var(--accent-primary)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 20px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          Go to Connected Accounts Settings
        </button>
      </div>
    );
  }

  return (
    <div className="audience-dashboard-container">
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

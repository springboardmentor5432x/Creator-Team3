import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIME_BLOCKS = ['5-8am', '8-11am', '11am-2pm', '2-5pm', '5-8pm', '8-11pm'];

const getIntensityColor = (intensity) => {
  const alpha = Math.max(0.08, intensity / 100 * 0.85);
  return `rgba(139, 92, 246, ${alpha})`;
};

const PostingHeatmap = ({ heatmapData }) => {
  const [hoveredCell, setHoveredCell] = useState(null);

  if (!heatmapData || heatmapData.length === 0) {
    return (
      <div className="theme-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '280px', color: 'var(--text-secondary)' }}>
        Posting heatmap data unavailable
      </div>
    );
  }

  // Build lookup map
  const cellMap = {};
  let maxIntensity = 0;
  heatmapData.forEach(cell => {
    const key = `${cell.day}-${cell.time}`;
    cellMap[key] = cell.intensity;
    if (cell.intensity > maxIntensity) maxIntensity = cell.intensity;
  });

  return (
    <div className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} color="#8b5cf6" />
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif' }}>
            Optimal Posting Times
          </h3>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontStyle: 'italic', marginLeft: '26px' }}>
          CreatorIQ AI Model — based on audience activity patterns
        </span>
      </div>

      {/* Heatmap Grid */}
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '50px repeat(6, 1fr)', gap: '3px', minWidth: '400px' }}>
          {/* Header row */}
          <div /> {/* empty corner */}
          {TIME_BLOCKS.map(time => (
            <div key={time} style={{
              textAlign: 'center', fontSize: '10px', fontWeight: 600,
              color: 'var(--text-secondary)', padding: '6px 2px',
              letterSpacing: '0.3px'
            }}>
              {time}
            </div>
          ))}

          {/* Data rows */}
          {DAYS.map(day => (
            <React.Fragment key={day}>
              <div style={{
                display: 'flex', alignItems: 'center', fontSize: '11px',
                fontWeight: 700, color: 'var(--text-secondary)', paddingRight: '8px'
              }}>
                {day}
              </div>
              {TIME_BLOCKS.map(time => {
                const key = `${day}-${time}`;
                const intensity = cellMap[key] || 0;
                const isMax = intensity === maxIntensity;
                const isHovered = hoveredCell === key;
                
                return (
                  <div
                    key={key}
                    style={{
                      position: 'relative',
                      height: '38px',
                      borderRadius: '6px',
                      background: getIntensityColor(intensity),
                      border: isMax ? '1.5px solid rgba(139, 92, 246, 0.7)' : '1px solid rgba(255,255,255,0.04)',
                      boxShadow: isMax ? '0 0 12px rgba(139, 92, 246, 0.3)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                      zIndex: isHovered ? 10 : 1
                    }}
                    onMouseEnter={() => setHoveredCell(key)}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    {isHovered && (
                      <div style={{
                        position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)',
                        background: 'var(--bg-secondary, #1e1b2e)',
                        border: '1px solid rgba(139, 92, 246, 0.4)',
                        borderRadius: '8px', padding: '6px 10px',
                        fontSize: '11px', fontWeight: 700, color: '#8b5cf6',
                        whiteSpace: 'nowrap', zIndex: 20,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                      }}>
                        {day} {time}: {intensity}% activity
                      </div>
                    )}
                    {isMax && (
                      <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        fontSize: '12px'
                      }}>
                        🔥
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
        <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>Low</span>
        <div style={{
          width: '120px', height: '8px', borderRadius: '4px',
          background: 'linear-gradient(90deg, rgba(139,92,246,0.08), rgba(139,92,246,0.85))'
        }} />
        <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>High</span>
      </div>
    </div>
  );
};

export default PostingHeatmap;

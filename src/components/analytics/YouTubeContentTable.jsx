import React, { useState } from 'react';
import { Play, Filter } from 'lucide-react';

export function YouTubeContentTable({ recentVideos, color = "#ff0000", platformName = "YouTube" }) {
  const [filterType, setFilterType] = useState('All');

  if (!recentVideos || recentVideos.length === 0) return null;

  const filteredVideos = recentVideos.filter(v => {
    if (filterType === 'All') return true;
    return v.content_type === filterType;
  });

  return (
    <div className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Play size={20} color={color} /> Recent {platformName} Performance
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setFilterType('All')}
            style={{ 
              background: filterType === 'All' ? 'rgba(255,255,255,0.1)' : 'transparent', 
              color: filterType === 'All' ? 'var(--text-primary)' : 'var(--text-secondary)', 
              border: filterType === 'All' ? '1px solid var(--border-color)' : '1px solid transparent', 
              padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' 
            }}>
            All
          </button>
          <button 
            onClick={() => setFilterType('Shorts')}
            style={{ 
              background: filterType === 'Shorts' ? 'rgba(255,255,255,0.1)' : 'transparent', 
              color: filterType === 'Shorts' ? 'var(--text-primary)' : 'var(--text-secondary)', 
              border: filterType === 'Shorts' ? '1px solid var(--border-color)' : '1px solid transparent', 
              padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' 
            }}>
            Shorts
          </button>
          <button 
            onClick={() => setFilterType('Long Form')}
            style={{ 
              background: filterType === 'Long Form' ? 'rgba(255,255,255,0.1)' : 'transparent', 
              color: filterType === 'Long Form' ? 'var(--text-primary)' : 'var(--text-secondary)', 
              border: filterType === 'Long Form' ? '1px solid var(--border-color)' : '1px solid transparent', 
              padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' 
            }}>
            Long Form
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <th style={{ padding: '12px', fontWeight: 600 }}>Video</th>
              <th style={{ padding: '12px', fontWeight: 600 }}>Type</th>
              <th style={{ padding: '12px', fontWeight: 600 }}>Views</th>
              <th style={{ padding: '12px', fontWeight: 600 }}>Velocity</th>
              <th style={{ padding: '12px', fontWeight: 600 }}>Engagement</th>
              <th style={{ padding: '12px', fontWeight: 600 }}>Performance</th>
            </tr>
          </thead>
          <tbody>
            {filteredVideos.map(video => (
              <tr key={video.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={video.thumbnail_url} style={{ width: '80px', borderRadius: '6px', aspectRatio: '16/9', objectFit: 'cover' }} />
                  <div style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {video.title}
                  </div>
                </td>
                <td style={{ padding: '12px', fontSize: '0.85rem' }}>
                  <span style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>{video.content_type || 'Unknown'}</span>
                </td>
                <td style={{ padding: '12px', fontSize: '0.95rem', fontWeight: 600 }}>{video.views}</td>
                <td style={{ padding: '12px', fontSize: '0.9rem', color: '#3b82f6' }}>{video.velocity_per_hour?.toLocaleString() || 0}/hr</td>
                <td style={{ padding: '12px', fontSize: '0.9rem', color: '#10b981' }}>{video.engagement_rate}%</td>
                <td style={{ padding: '12px', fontSize: '0.85rem' }}>
                  <span style={{ 
                    color: video.performance_score > 120 ? '#22c55e' : (video.performance_score < 80 ? '#ef4444' : 'var(--text-secondary)'),
                    background: video.performance_score > 120 ? 'rgba(34, 197, 94, 0.1)' : (video.performance_score < 80 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.1)'),
                    padding: '4px 8px',
                    borderRadius: '12px'
                  }}>
                    {video.momentum || 'Average'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

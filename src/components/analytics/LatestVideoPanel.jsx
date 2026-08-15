import React from 'react';
import { Play, TrendingUp, TrendingDown, Clock, MessageSquare, Heart } from 'lucide-react';

export function LatestVideoPanel({ video, channelAvgViews, color = "#3b82f6", platformName = "Platform" }) {
  if (!video) return null;

  const isExploding = video.performance_score > 120;
  const isUnderperforming = video.performance_score < 80;

  return (
    <div className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Play size={20} color={color} /> Latest {platformName} Performance
        </h3>
        <div style={{ 
          background: isExploding ? 'rgba(34, 197, 94, 0.1)' : (isUnderperforming ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.1)'),
          color: isExploding ? '#22c55e' : (isUnderperforming ? '#ef4444' : 'var(--text-secondary)'),
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '0.85rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          {isExploding ? <TrendingUp size={16} /> : (isUnderperforming ? <TrendingDown size={16} /> : <TrendingUp size={16} />)}
          {video.momentum || 'Average Performance'}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        <img 
          src={video.thumbnail_url} 
          alt={video.title}
          style={{ width: '240px', borderRadius: '12px', border: '1px solid var(--border-color)', objectFit: 'cover', aspectRatio: '16/9' }}
        />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
            {video.title}
          </h4>
          
          <div style={{ display: 'flex', gap: '24px', marginTop: '8px' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Total Views</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{video.views}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Velocity</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#3b82f6', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                {video.velocity_per_hour?.toLocaleString() || 0} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>/hr</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>vs Average</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isExploding ? '#22c55e' : (isUnderperforming ? '#ef4444' : 'var(--text-secondary)') }}>
                {video.performance_score || 100}%
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '8px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <Heart size={16} /> {video.likes}
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <MessageSquare size={16} /> {video.comments}
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#10b981', marginLeft: 'auto' }}>
                <TrendingUp size={16} /> {video.engagement_rate}% ER
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

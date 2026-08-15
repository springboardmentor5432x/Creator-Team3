import React from 'react';
import { Bookmark } from 'lucide-react';

const SavesSharesIntel = ({ savesSharesIntel }) => {
  if (!savesSharesIntel || savesSharesIntel.length === 0) {
    return (
      <div className="theme-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', color: 'var(--text-secondary)' }}>
        Saves & Shares intelligence unavailable
      </div>
    );
  }

  return (
    <div className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bookmark size={18} color="#f59e0b" />
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif' }}>
            Saves & Shares Intelligence
          </h3>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontStyle: 'italic', marginLeft: '26px' }}>
          Deep dive into your most viral content signals
        </span>
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {savesSharesIntel.map((item, idx) => {
          const isShareable = item.label === 'Highly Shareable';
          const badgeColor = isShareable ? '#10b981' : '#f59e0b';

          return (
            <div key={item.id || idx} style={{
              display: 'flex', flexDirection: 'column', gap: '12px',
              padding: '16px', borderRadius: '14px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              transition: 'all 0.3s ease',
              cursor: 'default'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.01)'; e.currentTarget.style.borderColor = `${badgeColor}40`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
            >
              {/* Top row: thumbnail + stats + badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {/* Thumbnail */}
                <div style={{
                  width: '72px', height: '72px', borderRadius: '12px', overflow: 'hidden',
                  background: 'rgba(255,255,255,0.05)', flexShrink: 0
                }}>
                  {item.thumbnail_url ? (
                    <img src={item.thumbnail_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📷</div>
                  )}
                </div>

                {/* Middle: Caption + stat pills */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>
                  <span style={{
                    fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {item.caption || 'Instagram Post'}
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {[
                      { emoji: '🔖', label: 'Saves', val: item.saves },
                      { emoji: '🔄', label: 'Shares', val: item.shares },
                      { emoji: '❤️', label: 'Likes', val: item.likes },
                      { emoji: '💬', label: 'Comments', val: item.comments }
                    ].map(s => (
                      <span key={s.label} style={{
                        fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)',
                        background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '6px'
                      }}>
                        {s.emoji} {s.val?.toLocaleString() || 0}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: Badge + ratios */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                  <span style={{
                    fontSize: '10px', fontWeight: 700, color: badgeColor,
                    background: `${badgeColor}15`, padding: '4px 10px', borderRadius: '8px',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.label}
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{
                      fontSize: '10px', fontWeight: 600, color: '#f59e0b',
                      background: 'rgba(245,158,11,0.08)', padding: '2px 6px', borderRadius: '4px'
                    }}>
                      Save {item.save_ratio}%
                    </span>
                    <span style={{
                      fontSize: '10px', fontWeight: 600, color: '#10b981',
                      background: 'rgba(16,185,129,0.08)', padding: '2px 6px', borderRadius: '4px'
                    }}>
                      Share {item.share_ratio}%
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Commentary */}
              <div style={{
                fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic',
                borderLeft: '3px solid #8b5cf6', paddingLeft: '12px',
                background: 'rgba(139,92,246,0.04)', padding: '10px 12px 10px 14px',
                borderRadius: '0 8px 8px 0', lineHeight: '1.5'
              }}>
                💡 {item.commentary}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavesSharesIntel;

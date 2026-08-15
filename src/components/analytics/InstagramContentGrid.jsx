import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, PlaySquare, Layers, Lock as LockIcon, Image as ImageIcon } from 'lucide-react';

export default function InstagramContentGrid({ recentMedia, isOAuth }) {
  const [activeTab, setActiveTab] = useState('ALL');

  if (!recentMedia || recentMedia.length === 0) return null;

  const filteredMedia = recentMedia.filter(m => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'REELS' && m.media_type === 'VIDEO') return true;
    if (activeTab === 'POSTS' && m.media_type === 'IMAGE') return true;
    if (activeTab === 'CAROUSELS' && m.media_type === 'CAROUSEL_ALBUM') return true;
    return false;
  });

  const getMediaIcon = (type) => {
    if (type === 'VIDEO') return <PlaySquare size={20} color="white" />;
    if (type === 'CAROUSEL_ALBUM') return <Layers size={20} color="white" />;
    return null; // Images don't typically have an icon on Instagram grid
  };

  const formatNumber = (num) => {
    if (typeof num === 'string') return num; // For public mode strings like "12,000"
    if (!num) return '0';
    return num >= 1000000 ? (num / 1000000).toFixed(1) + 'M' : num >= 1000 ? (num / 1000).toFixed(1) + 'K' : num.toString();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Content Performance</h3>
        
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-primary)' }}>
          {['ALL', 'POSTS', 'REELS', 'CAROUSELS'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'transparent',
                color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: 'none',
                borderBottom: `2px solid ${activeTab === tab ? '#e1306c' : 'transparent'}`,
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {filteredMedia.map((media, idx) => (
          <div key={idx} style={{
            background: 'rgba(15, 23, 42, 0.4)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'transform 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {/* Thumbnail Header */}
            <div style={{ position: 'relative', paddingTop: '100%', background: 'rgba(255,255,255,0.02)', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.1)' }}>
                <ImageIcon size={48} />
              </div>
              <img 
                src={media.thumbnail_url || media.media_url} 
                alt="Post thumbnail" 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
                onError={(e) => { e.target.style.opacity = '0'; }}
              />
              
              {/* Top Right Media Type Icon */}
              {getMediaIcon(media.media_type) && (
                <div style={{ position: 'absolute', top: '12px', right: '12px', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))', zIndex: 2 }}>
                  {getMediaIcon(media.media_type)}
                </div>
              )}

              {/* Bottom Metrics Overlay (Instagram Style) */}
              <div style={{ 
                position: 'absolute', bottom: 0, left: 0, right: 0, 
                padding: '40px 16px 12px', 
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                display: 'flex', gap: '16px', color: 'white', fontWeight: 600, fontSize: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Heart size={16} fill="white" /> {formatNumber(media.like_count || media.likes)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MessageCircle size={16} fill="white" /> {formatNumber(media.comments_count || media.comments)}
                </div>
              </div>
            </div>

            {/* Extra Analytics (Below Image) */}
            <div style={{ padding: '16px' }}>
              <p style={{ 
                margin: '0 0 16px 0', 
                fontSize: '13px', 
                color: 'var(--text-secondary)',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {media.caption || 'Instagram Post'}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Bookmark size={14} color="var(--text-secondary)" />
                    {!isOAuth ? <LockIcon size={12} color="var(--text-secondary)" /> : formatNumber(media.saved || 0)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Share2 size={14} color="var(--text-secondary)" />
                    {!isOAuth ? <LockIcon size={12} color="var(--text-secondary)" /> : formatNumber(media.shares || 0)}
                  </div>
                </div>

                {isOAuth && media.performance_score && (
                  <div style={{ 
                    background: media.performance_score > 100 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)', 
                    color: media.performance_score > 100 ? '#10b981' : 'var(--text-secondary)', 
                    padding: '4px 8px', 
                    borderRadius: '6px', 
                    fontSize: '11px', 
                    fontWeight: 700 
                  }}>
                    Perf: {media.performance_score}/100
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

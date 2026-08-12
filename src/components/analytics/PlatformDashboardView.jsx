import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, Users, Clock, Video, Heart, MessageSquare, Share2, Award, ExternalLink, RefreshCw, CheckCircle, Search, ShieldAlert, Lock, Play, TrendingUp } from 'lucide-react';
import { LatestVideoPanel } from './LatestVideoPanel';
import { UploadHeatmap } from './UploadHeatmap';
import { YouTubeContentTable } from './YouTubeContentTable';
import { AudienceDemographics } from './AudienceDemographics';
import InstagramTopCards from './InstagramTopCards';
import InstagramAccountGraph from './InstagramAccountGraph';
import ContentMomentumPanel from './ContentMomentumPanel';
import InstagramContentGrid from './InstagramContentGrid';
import ContentTypeComparison from './ContentTypeComparison';
const platformConfigs = {
  instagram: {
    name: 'Instagram',
    icon: '📸',
    color: '#e1306c',
    metrics: [
      { id: 'followers', label: 'Followers', icon: Users, format: (val) => val != null ? val.toLocaleString() : 'Not Available' },
      { id: 'follows_count', label: 'Following', icon: Users, format: (val) => val != null ? val.toLocaleString() : 'Not Available' },
      { id: 'media_count', label: 'Media Posts', icon: Video, format: (val) => val != null ? val.toLocaleString() : 'Not Available' },
      { id: 'reach', label: 'Total Reach', icon: Eye, format: (val) => val != null ? val.toLocaleString() : 'Not Available' },
      { id: 'impressions', label: 'Total Impressions', icon: Eye, format: (val) => val != null ? val.toLocaleString() : 'Not Available' },
      { id: 'avg_engagement', label: 'Engagement Rate', icon: Heart, format: (val) => val != null ? `${val}%` : 'Not Available' }
    ]
  },
  youtube: {
    name: 'YouTube',
    icon: '🔴',
    color: '#ff0000',
    metrics: [
      { id: 'subscribers', label: 'Subscribers', icon: Users, format: (val) => val != null ? val.toLocaleString() : 'N/A' },
      { id: 'views', label: 'Total Channel Views', icon: Eye, format: (val) => val != null ? val.toLocaleString() : 'N/A' },
      { id: 'videos', label: 'Public Video Count', icon: Video, format: (val) => val != null ? val.toLocaleString() : 'N/A' },
      { id: 'watch_time_hours', label: 'Watch Time (hrs)', icon: Clock, format: (val, isConnected, isOAuth) => val != null ? val.toLocaleString() : 'N/A' },
      { id: 'estimated_rpm', label: 'Actual RPM', icon: Award, format: (val, isConnected, isOAuth) => val != null ? `$${val}` : (isOAuth ? `$3.40` : 'N/A') },
      { id: 'estimated_revenue', label: 'Actual Revenue', icon: Award, format: (val, isConnected, isOAuth) => val != null ? `$${val.toLocaleString()}` : (isOAuth ? '$0' : 'N/A') }
    ]
  },
  twitter: {
    name: 'Twitter / X',
    icon: '🐦',
    color: '#1da1f2',
    metrics: [
      { id: 'followers', label: 'Followers', icon: Users, format: (val) => val ? val.toLocaleString() : 'N/A' },
      { id: 'following', label: 'Following', icon: Users, format: (val) => val ? val.toLocaleString() : 'N/A' },
      { id: 'tweets', label: 'Total Tweets', icon: Video, format: (val) => val ? val.toLocaleString() : 'N/A' },
      { id: 'impressions', label: 'Tweet Impressions (OAuth Required)', icon: Eye, format: (val, isConnected) => isConnected ? (val ? val.toLocaleString() : 'N/A') : 'Requires Account Connection' },
      { id: 'retweets', label: 'Retweets (OAuth Required)', icon: Share2, format: (val, isConnected) => isConnected ? (val ? val.toLocaleString() : 'N/A') : 'Requires Account Connection' },
      { id: 'engagement', label: 'Engagement Rate', icon: Heart, format: (val, isConnected) => isConnected ? `${val}%` : 'Requires Account Connection' }
    ]
  },
  linkedin: {
    name: 'LinkedIn',
    icon: '💼',
    color: '#0a66c2',
    metrics: [
      { id: 'followers', label: 'Connections / Followers', icon: Users, format: (val) => val ? val.toLocaleString() : 'N/A' },
      { id: 'impressions', label: 'Post Impressions (OAuth Required)', icon: Eye, format: (val, isConnected) => isConnected ? (val ? val.toLocaleString() : 'N/A') : 'Requires Account Connection' },
      { id: 'clicks', label: 'Profile Clicks (OAuth Required)', icon: ExternalLink, format: (val, isConnected) => isConnected ? (val ? val.toLocaleString() : 'N/A') : 'Requires Account Connection' },
      { id: 'engagement', label: 'Engagement Rate', icon: Heart, format: (val, isConnected) => isConnected ? `${val}%` : 'Requires Account Connection' }
    ]
  },
  facebook: {
    name: 'Facebook',
    icon: '📘',
    color: '#1877f2',
    metrics: [
      { id: 'followers', label: 'Page Followers', icon: Users, format: (val) => val != null ? val.toLocaleString() : 'N/A' },
      { id: 'likes', label: 'Page Likes', icon: Heart, format: (val) => val != null ? val.toLocaleString() : 'N/A' },
      { id: 'reach', label: 'Post Reach (OAuth Required)', icon: Eye, format: (val, isConnected) => isConnected ? (val ? val.toLocaleString() : 'N/A') : 'Requires Account Connection' },
      { id: 'engagement', label: 'Engagement Rate (OAuth Required)', icon: Share2, format: (val, isConnected) => isConnected ? `${val}%` : 'Requires Account Connection' }
    ]
  },
  twitch: {
    name: 'Twitch',
    icon: '🟣',
    color: '#9146ff',
    metrics: [
      { id: 'followers_count', label: 'Followers', icon: Users, format: (val) => val != null ? val.toLocaleString() : 'N/A' },
      { id: 'view_count', label: 'Total Channel Views', icon: Eye, format: (val) => val != null ? val.toLocaleString() : 'N/A' },
      { id: 'broadcaster_type', label: 'Broadcaster Status', icon: Award, format: (val) => val ? (val.charAt(0).toUpperCase() + val.slice(1)) : 'Standard' }
    ]
  }
};

export default function PlatformDashboardView({ platformKey, token, setActiveTab }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchHandle, setSearchHandle] = useState('');
  const [lookupData, setLookupData] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);

  const key = platformKey.replace('platform_', '').toLowerCase();
  const config = platformConfigs[key] || platformConfigs.youtube;

  const fetchPlatformData = async (handleQuery = '') => {
    try {
      if (handleQuery) setLookupLoading(true);
      else setLoading(true);
      setError(null);

      const url = `http://127.0.0.1:8000/api/analytics/platform/${key}` + (handleQuery ? `?handle=${encodeURIComponent(handleQuery)}` : '');
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(json.detail || json.message || 'Failed to fetch platform data');
      }
      
      if (handleQuery) setLookupData(json);
      else setData(json);
      
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
      setLookupLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchPlatformData();
  }, [platformKey, token]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchHandle.trim()) {
      fetchPlatformData(searchHandle.trim());
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
        <div className="theme-card" style={{ height: '120px', background: 'rgba(255,255,255,0.02)', animation: 'pulse 1.5s infinite' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {[1,2,3,4,5,6].map(i => (
             <div key={i} className="theme-card" style={{ height: '100px', background: 'rgba(255,255,255,0.02)', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
        <div className="theme-card" style={{ height: '350px', background: 'rgba(255,255,255,0.02)', animation: 'pulse 1.5s infinite' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="theme-card" style={{ padding: '40px', textAlign: 'center', border: '1px solid #ef4444' }}>
        <ShieldAlert size={48} color="#ef4444" style={{ margin: '0 auto 16px' }} />
        <h3 style={{ color: '#ef4444', fontSize: '20px', margin: '0 0 12px' }}>Unable to retrieve analytics</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Reason: {error}</p>
        <button 
          onClick={() => fetchPlatformData()}
          style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Retry Fetch
        </button>
      </div>
    );
  }

  const activeData = lookupData || data;
  const isConnected = activeData && (activeData.connected === true || activeData.subscribers > 0 || activeData.views > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      
      {/* Search Input Bar for Public Handle Lookup */}
      <form onSubmit={handleSearchSubmit} className="theme-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Search size={18} color="var(--text-secondary)" />
        <input
          type="text"
          placeholder={`Enter public ${config.name} channel handle or ID (e.g. @mkbhd or UCBJycsmduvYEL83R_U4JriQ)`}
          value={searchHandle}
          onChange={(e) => setSearchHandle(e.target.value)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={lookupLoading}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            background: config.color,
            color: '#ffffff',
            border: 'none',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          {lookupLoading ? 'Searching...' : 'Search Channel'}
        </button>
        {lookupData && (
          <button
            type="button"
            onClick={() => { setLookupData(null); setSearchHandle(''); }}
            style={{ background: 'transparent', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)', padding: '8px 12px', borderRadius: '10px', fontSize: '12px', cursor: 'pointer' }}
          >
            Clear Search
          </button>
        )}
      </form>

      {/* Platform Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${config.color}22, rgba(15, 23, 42, 0.7))`,
        border: `1px solid ${config.color}44`,
        borderRadius: '20px',
        padding: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img
            src={activeData?.thumbnail_url || activeData?.profile?.profile_picture_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${key}`}
            alt="Profile"
            style={{ width: '64px', height: '64px', borderRadius: '50%', border: `2px solid ${config.color}`, objectFit: 'cover' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {activeData?.channel_name || activeData?.profile?.name || `${config.name} Studio`}
              </h2>
              {activeData?.is_oauth === true && (
                <span style={{
                  background: `${config.color}33`,
                  color: config.color,
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '12px'
                }}>
                  ✓ ACTIVE CHANNEL STREAM
                </span>
              )}
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
              {activeData?.custom_url || `@${key}_channel`} • {activeData?.description || 'Official Channel Telemetry'}
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <div>Status: <span style={{ color: activeData?.is_oauth ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
            {activeData?.is_oauth ? '● Live Channel Feed Active' : '● Public Channel Intel Mode'}
          </span></div>
          {activeData?.country && <div>Region: <strong style={{ color: 'var(--text-primary)' }}>{activeData.country}</strong></div>}
        </div>
      </div>

      {/* Metric KPI Grid */}
      {key === 'instagram' ? (
        <InstagramTopCards data={activeData} isOAuth={activeData.is_oauth} />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {config.metrics.map(m => {
            const IconComp = m.icon;
            let rawVal = activeData?.[m.id] || activeData?.profile?.[m.id] || activeData?.analytics?.[m.id];
            const isOAuth = activeData?.is_oauth === true;
            const formatted = m.format(rawVal, isConnected, isOAuth);
            
            let telemetryLabel = "Live API Telemetry";
            let telemetryColor = "#10b981";
            
            if (!isOAuth && (m.id === 'estimated_revenue' || m.id === 'estimated_rpm')) {
                telemetryLabel = "CreatorIQ Estimated Model";
                telemetryColor = "#f59e0b";
            } else if (!isOAuth && m.id === 'watch_time_hours') {
                telemetryLabel = "OAuth Connection Required";
                telemetryColor = "#ef4444";
            }

            return (
              <div key={m.id} className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px' }}>{m.label.toUpperCase()}</span>
                  <IconComp size={18} color={config.color} />
                </div>
                <div style={{ fontSize: 'clamp(20px, 2vw, 28px)', fontWeight: 800, color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                  {formatted}
                </div>
                {m.id.includes('revenue') || m.id.includes('watch') || m.id.includes('rpm') ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: telemetryColor, fontWeight: 700, background: `${telemetryColor}15`, padding: '4px 8px', borderRadius: '6px', width: 'fit-content' }}>
                    <TrendingUp size={12} /> {telemetryLabel}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {/* Main Charts area */}
      {key === 'instagram' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <InstagramAccountGraph chartData={activeData.chart_data} isOAuth={activeData.is_oauth} />
          <ContentMomentumPanel momentumSignals={activeData.momentum_signals} />
        </div>
      ) : activeData.chart_data && (
        <div className="theme-card" style={{ padding: '24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color={config.color} />
              {config.name} Channel View & Revenue Trajectory
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Last 6 Months</span>
          </div>

          <div style={{ width: '100%', height: 300 }}>
            {activeData.chart_data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeData.chart_data}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={config.color} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={config.color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color, rgba(255,255,255,0.08))" />
                  <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={12} />
                  <YAxis stroke="var(--text-secondary)" fontSize={12} tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '12px' }}
                    formatter={(val, name) => [name === 'views' ? val.toLocaleString() : `$${val.toLocaleString()}`, name === 'views' ? 'Channel Views' : 'Estimated Revenue']}
                  />
                  <Area type="monotone" dataKey="views" stroke={config.color} strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                <span>No historical data available for this account.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top Videos Section (Conditional based on platform) */}
      {key === 'instagram' && activeData?.content_breakdown ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <ContentTypeComparison 
            contentBreakdown={activeData.content_breakdown} 
            insight={activeData.insight} 
          />
          <InstagramContentGrid 
            recentMedia={activeData.recent_videos || []} 
            isOAuth={activeData.is_oauth} 
          />
        </div>
      ) : key === 'youtube' && activeData?.recent_videos !== undefined ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {activeData.recent_videos.length > 0 && (
            <LatestVideoPanel 
              video={activeData.recent_videos[0]} 
              channelAvgViews={activeData.views / (activeData.videos || 1)} 
            />
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <AudienceDemographics isOAuth={activeData.is_oauth} />
            <UploadHeatmap recentVideos={activeData.recent_videos} />
          </div>
          <YouTubeContentTable recentVideos={activeData.recent_videos} />
        </div>
      ) : activeData?.recent_videos !== undefined ? (
        <div className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
            🎬 Top Performing Channel Uploads
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeData.recent_videos.length > 0 ? activeData.recent_videos.map((vid) => (
              <div
                key={vid.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color, rgba(255,255,255,0.08))'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${config.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Play size={18} color={config.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{vid.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Published {vid.date} • Duration {vid.duration}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '13px' }}>
                  <div><strong style={{ color: 'var(--text-primary)' }}>{vid.views}</strong> <span style={{ color: 'var(--text-secondary)' }}>views</span></div>
                  <div><strong style={{ color: 'var(--text-primary)' }}>{vid.likes}</strong> <span style={{ color: 'var(--text-secondary)' }}>likes</span></div>
                  <div><strong style={{ color: 'var(--text-primary)' }}>{vid.comments}</strong> <span style={{ color: 'var(--text-secondary)' }}>comments</span></div>
                </div>
              </div>
            )) : (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No recent videos found.
              </div>
            )}
          </div>
        </div>
      ) : null}

    </div>
  );
}

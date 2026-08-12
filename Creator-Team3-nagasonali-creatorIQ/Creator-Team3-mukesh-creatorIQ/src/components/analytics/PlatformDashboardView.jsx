import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, Users, Clock, Video, Heart, MessageSquare, Share2, Award, ExternalLink, RefreshCw, CheckCircle, Search, ShieldAlert, Lock } from 'lucide-react';

const platformConfigs = {
  instagram: {
    name: 'Instagram',
    icon: '📸',
    color: '#e1306c',
    metrics: [
      { id: 'followers', label: 'Followers', icon: Users, format: (val) => val ? val.toLocaleString() : 'N/A' },
      { id: 'follows_count', label: 'Following', icon: Users, format: (val) => val ? val.toLocaleString() : 'N/A' },
      { id: 'media_count', label: 'Media Posts', icon: Video, format: (val) => val ? val.toLocaleString() : 'N/A' },
      { id: 'reach', label: 'Total Reach (OAuth Required)', icon: Eye, format: (val, isConnected) => isConnected ? (val ? val.toLocaleString() : 'N/A') : 'Requires Account Connection' },
      { id: 'impressions', label: 'Impressions (OAuth Required)', icon: Eye, format: (val, isConnected) => isConnected ? (val ? val.toLocaleString() : 'N/A') : 'Requires Account Connection' },
      { id: 'avg_engagement', label: 'Engagement Rate', icon: Heart, format: (val, isConnected) => isConnected ? `${val}%` : 'Requires Account Connection' }
    ]
  },
  youtube: {
    name: 'YouTube',
    icon: '🔴',
    color: '#ff0000',
    metrics: [
      { id: 'subscribers', label: 'Subscribers', icon: Users, format: (val) => val ? val.toLocaleString() : '0' },
      { id: 'views', label: 'Total Channel Views', icon: Eye, format: (val) => val ? val.toLocaleString() : '0' },
      { id: 'videos', label: 'Channel Videos', icon: Video, format: (val) => val ? val.toLocaleString() : '0' },
      { id: 'watch_time_hours', label: 'Watch Time (hrs)', icon: Clock, format: (val) => val ? val.toLocaleString() : '0' },
      { id: 'estimated_rpm', label: 'Estimated RPM', icon: Award, format: (val) => `$${val || 2.80}` },
      { id: 'estimated_revenue', label: 'Estimated Revenue', icon: Award, format: (val) => `$${(val || 0).toLocaleString()}` }
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
  twitch: {
    name: 'Twitch',
    icon: '👾',
    color: '#9146ff',
    metrics: [
      { id: 'followers', label: 'Followers', icon: Users, format: (val) => val ? val.toLocaleString() : 'N/A' },
      { id: 'subscribers', label: 'Subscribers (OAuth Required)', icon: Award, format: (val, isConnected) => isConnected ? (val ? val.toLocaleString() : 'N/A') : 'Requires Account Connection' },
      { id: 'hours_watched', label: 'Stream Hours Watched', icon: Clock, format: (val, isConnected) => isConnected ? (val ? val.toLocaleString() : 'N/A') : 'Requires Account Connection' },
      { id: 'peak_viewers', label: 'Peak Viewers', icon: Eye, format: (val, isConnected) => isConnected ? (val ? val.toLocaleString() : 'N/A') : 'Requires Account Connection' }
    ]
  }
};

export default function PlatformDashboardView({ platformKey, token, setActiveTab }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchHandle, setSearchHandle] = useState('');
  const [lookupData, setLookupData] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);

  const key = platformKey.replace('platform_', '').toLowerCase();
  const config = platformConfigs[key] || platformConfigs.instagram;

  const fetchPlatformData = async (handleQuery = '') => {
    try {
      if (handleQuery) setLookupLoading(true);
      else setLoading(true);

      const url = `http://127.0.0.1:8000/api/analytics/platform/${key}` + (handleQuery ? `?handle=${encodeURIComponent(handleQuery)}` : '');
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        if (handleQuery) setLookupData(json);
        else setData(json);
      }
    } catch (err) {
      console.error(err);
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
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <RefreshCw className="animate-spin" size={32} style={{ margin: '0 auto 16px', color: config.color }} />
        <h3>Fetching {config.name} Telemetry Feed...</h3>
      </div>
    );
  }

  const activeData = lookupData || data;
  const isConnected = activeData && activeData.connected === true;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      
      {/* Search Input Bar for Mode A – Public Handle Lookup */}
      <form onSubmit={handleSearchSubmit} className="theme-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Search size={18} color="var(--text-secondary)" />
        <input
          type="text"
          placeholder={`Public Lookup Mode: Enter public ${config.name} handle or channel ID (e.g. @mkbhd)`}
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
            padding: '8px 16px',
            borderRadius: '10px',
            background: config.color,
            color: '#ffffff',
            border: 'none',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          {lookupLoading ? 'Searching...' : 'Public Lookup'}
        </button>
        {lookupData && (
          <button
            type="button"
            onClick={() => { setLookupData(null); setSearchHandle(''); }}
            style={{ background: 'transparent', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)', padding: '8px 12px', borderRadius: '10px', fontSize: '12px', cursor: 'pointer' }}
          >
            Clear Lookup
          </button>
        )}
      </form>

      {/* Connection Notice / Banner */}
      {!isConnected && (
        <div style={{
          background: `linear-gradient(135deg, ${config.color}15, rgba(15, 23, 42, 0.6))`,
          border: `1px solid ${config.color}33`,
          borderRadius: '16px',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Lock size={24} color={config.color} />
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {searchHandle ? `Public Lookup Mode (@${searchHandle})` : `${config.name} Account Disconnected`}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Connect your official {config.name} account to unlock real-time private reach, impressions, reels, and audience insights.
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab && setActiveTab('settings')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              background: config.color,
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Connect {config.name} in Settings ➔
          </button>
        </div>
      )}

      {/* Platform Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${config.color}22, rgba(15, 23, 42, 0.6))`,
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
            style={{ width: '60px', height: '60px', borderRadius: '50%', border: `2px solid ${config.color}`, objectFit: 'cover' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {activeData?.channel_name || activeData?.profile?.name || `${config.name} Dashboard`}
              </h2>
              <span style={{
                background: isConnected ? `${config.color}33` : 'rgba(255,255,255,0.08)',
                color: isConnected ? config.color : 'var(--text-secondary)',
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 10px',
                borderRadius: '12px'
              }}>
                {isConnected ? '✓ CONNECTED (OAuth Active)' : 'PUBLIC LOOKUP MODE'}
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
              {activeData?.custom_url || `@${key}_creator`}
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <div>Status: <span style={{ color: isConnected ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
            {isConnected ? '● Connected via Official OAuth' : '● Public Data Only'}
          </span></div>
        </div>
      </div>

      {/* Metric KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {config.metrics.map(m => {
          const IconComp = m.icon;
          let rawVal = activeData?.profile?.[m.id] || activeData?.analytics?.[m.id] || activeData?.[m.id];
          const formatted = m.format(rawVal, isConnected);

          return (
            <div key={m.id} className="theme-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>{m.label}</span>
                <IconComp size={18} color={config.color} />
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: typeof formatted === 'number' || !formatted.includes('Requires') ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {formatted}
              </div>
              <div style={{ fontSize: '11px', color: isConnected ? '#10b981' : 'var(--text-muted)', fontWeight: 600 }}>
                {isConnected ? '↑ Official API Stream' : 'Public Profile Endpoint'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

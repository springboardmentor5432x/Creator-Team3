import React, { useState, useEffect } from 'react';
import { ShieldAlert, RefreshCw, CheckCircle, AlertTriangle, Database, Activity, Key, Server } from 'lucide-react';

export default function DebugView({ token }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDebugStatus = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('http://127.0.0.1:8000/api/debug/status', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch debug status from backend.');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchDebugStatus();
  }, [token]);

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <RefreshCw className="animate-spin" size={32} style={{ margin: '0 auto 16px', color: '#3b82f6' }} />
        <h3>Running System & OAuth Diagnostics Audit...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="theme-card" style={{ padding: '32px', textAlign: 'center', borderColor: '#ef4444' }}>
        <ShieldAlert size={42} color="#ef4444" style={{ margin: '0 auto 16px' }} />
        <h3 style={{ margin: 0, color: '#ef4444' }}>Diagnostic Endpoint Error</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px' }}>{error}</p>
      </div>
    );
  }

  const devApps = data?.developer_apps || {};
  const dbSessions = data?.database_sessions || {};
  const health = data?.api_health || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(15, 23, 42, 0.6))',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '20px',
        padding: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Activity size={36} color="#3b82f6" />
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
              System Debug & OAuth Audit Center
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Truthful real-time audit of Developer Credentials, DB Sessions, API Rate Limits, and OAuth Expiries.
            </p>
          </div>
        </div>

        <button
          onClick={fetchDebugStatus}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '12px',
            background: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={14} /> Re-Audit Configuration
        </button>
      </div>

      {/* Developer Apps Credential Checklist */}
      <div className="theme-card" style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Key size={18} color="#3b82f6" /> Phase 10 — Developer App Credentials Status
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {Object.entries(devApps).map(([key, app]) => {
            const isOk = app.configured;
            return (
              <div key={key} style={{
                background: 'var(--bg-input)',
                border: `1px solid ${isOk ? '#10b98144' : '#ef444444'}`,
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                    {key.replace('_', ' ')}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: isOk ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                    color: isOk ? '#10b981' : '#f87171'
                  }}>
                    {isOk ? '✓ CONFIGURED' : '❌ MISSING'}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  App ID / Client ID: <code style={{ color: '#60a5fa' }}>{app.app_id || app.client_id || 'None'}</code>
                </div>
                <div style={{ fontSize: '11px', color: isOk ? '#10b981' : '#f87171', fontWeight: 600, marginTop: '4px' }}>
                  {app.message}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DB Sessions & Snapshot Audit */}
      <div className="theme-card" style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={18} color="#10b981" /> Database Sessions & Historical Snapshots
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {Object.entries(dbSessions).map(([key, sess]) => (
            <div key={key} style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-primary)',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                {key.replace('_', ' ')}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Session Status: <strong style={{ color: sess.connected ? '#10b981' : '#f87171' }}>{sess.connected ? 'Connected' : 'Disconnected'}</strong>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Handle: <span style={{ color: '#60a5fa' }}>@{sess.username}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Last Synced: {sess.last_synced}
              </div>
              <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 700, marginTop: '4px' }}>
                Historical Snapshots: {sess.snapshots_count} entries
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Health & Background Engine */}
      <div className="theme-card" style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Server size={18} color="#8b5cf6" /> Live API Health & Background Engines
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Rate Limits Status</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>{health.rate_limits}</div>
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Background Sync Service</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#3b82f6', marginTop: '4px' }}>{health.background_sync}</div>
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Audit Verification Mode</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#8b5cf6', marginTop: '4px' }}>{health.environment}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

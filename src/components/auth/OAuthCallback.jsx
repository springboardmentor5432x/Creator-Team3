import React, { useEffect, useState } from 'react';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';

const OAuthCallback = () => {
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Connecting your account...');

  useEffect(() => {
    const processCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state') || '';
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');

      if (error) {
        setStatus('error');
        setMessage(errorDescription || 'OAuth authorization was denied or failed.');
        return;
      }

      if (!code) {
        setStatus('error');
        setMessage('No authorization code provided in the URL.');
        return;
      }

      // Determine platform from state since redirect URIs are shared
      let platform = '';
      if (state.includes('ig') || state.includes('instagram')) platform = 'instagram';
      else if (state.includes('linkedin')) platform = 'linkedin';
      else if (state.includes('twitter') || state.includes('x_')) platform = 'twitter';
      else if (state.includes('twitch')) platform = 'twitch';

      if (!platform) {
        setStatus('error');
        setMessage('Unknown OAuth state parameter. Cannot determine platform.');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('User not authenticated. Please log in first.');

        const res = await fetch(`http://127.0.0.1:8000/api/auth/${platform}/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ code })
        });

        const data = await res.json();
        
        if (!res.ok || data.status === 'error') {
          throw new Error(data.error || data.detail || `Failed to connect ${platform} account.`);
        }

        setStatus('success');
        setMessage(`${platform.charAt(0).toUpperCase() + platform.slice(1)} account connected successfully!`);
        
        // Redirect back to dashboard
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);

      } catch (err) {
        console.error('OAuth Callback Error:', err);
        setStatus('error');
        setMessage(err.message);
      }
    };

    processCallback();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-primary)',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        boxShadow: 'var(--shadow-card)'
      }}>
        {status === 'processing' && (
          <>
            <RefreshCw className="animate-spin" size={48} color="var(--accent-primary)" style={{ margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: 700 }}>Processing Connection</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{message}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: 700 }}>Success!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '24px' }}>{message}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Redirecting back to your dashboard...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle size={48} color="#ef4444" style={{ margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: 700 }}>Connection Failed</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '24px' }}>{message}</p>
            <button 
              onClick={() => window.location.href = '/'}
              style={{
                background: 'var(--accent-primary)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Return to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;

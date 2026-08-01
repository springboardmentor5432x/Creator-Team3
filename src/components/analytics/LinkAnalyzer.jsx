import React, { useState, useEffect } from 'react';

export default function LinkAnalyzer({ token }) {
  const [url, setUrl] = useState('');
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Detect platform based on input URL
  const getDetectedPlatform = (val) => {
    const v = val.toLowerCase();
    if (v.includes('youtube.com') || v.includes('youtu.be')) return 'YouTube';
    if (v.includes('instagram.com')) return 'Instagram';
    if (v.includes('linkedin.com')) return 'LinkedIn';
    if (v.includes('twitch.tv')) return 'Twitch';
    return '';
  };

  const detectedPlatform = getDetectedPlatform(url);

  const fetchLinks = async () => {
    try {
      setListLoading(true);
      const res = await fetch('http://127.0.0.1:8000/api/links', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setLinks(data);
      }
    } catch (err) {
      console.error('Error fetching link history:', err);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLinks();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!url.trim()) {
      setError('Please paste a valid content URL.');
      return;
    }

    if (!detectedPlatform) {
      setError('URL platform not supported. Please paste a link from YouTube, Instagram, LinkedIn, or Twitch.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('http://127.0.0.1:8000/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url: url.trim() })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Failed to analyze URL');
      }

      setSuccess(`URL analyzed successfully! Added to your history.`);
      setLinks(prev => [data, ...prev]);
      setUrl('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this link from your history?')) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/links/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setLinks(prev => prev.filter(l => l.id !== id));
      } else {
        alert('Failed to delete link');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'YouTube':
        return <span style={{ color: '#ef4444' }}>🔴 YouTube</span>;
      case 'Instagram':
        return <span style={{ color: '#ec4899' }}>📸 Instagram</span>;
      case 'LinkedIn':
        return <span style={{ color: '#3b82f6' }}>💼 LinkedIn</span>;
      case 'Twitch':
        return <span style={{ color: '#8b5cf6' }}>👾 Twitch</span>;
      default:
        return <span>🔗 Web Link</span>;
    }
  };

  return (
    <div className="link-analyzer">
      <style>{`
        .link-analyzer {
          font-family: 'Inter', sans-serif;
          color: var(--text-primary);
          display: flex;
          flex-direction: column;
          gap: 2rem;
          width: 100%;
        }

        .analyzer-input-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 2rem;
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .analyzer-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
        }

        .analyzer-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .analyzer-input {
          width: 100%;
          background: var(--input-bg, rgba(15, 23, 42, 0.6));
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 14px 16px;
          padding-right: 140px;
          color: var(--text-primary);
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.25s ease;
        }

        .analyzer-input:focus {
          border-color: var(--accent-primary);
        }

        .platform-detector {
          position: absolute;
          right: 16px;
          font-size: 0.8125rem;
          font-weight: 700;
          pointer-events: none;
          background: rgba(255, 255, 255, 0.05);
          padding: 4px 10px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        .analyzer-submit-btn {
          background: var(--accent-primary);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          padding: 14px 20px;
          font-weight: 700;
          font-size: 0.9375rem;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px var(--accent-glow);
        }

        .analyzer-submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px var(--accent-glow);
        }

        .analyzer-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Banner Messages */
        .analyzer-banner {
          font-size: 0.8125rem;
          padding: 10px 14px;
          border-radius: 10px;
          font-weight: 500;
        }

        .analyzer-banner.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
        }

        .analyzer-banner.success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: #34d399;
        }

        /* History Table Section */
        .history-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 1.5rem;
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
          overflow-x: auto;
        }

        .history-title {
          font-size: 1.15rem;
          font-weight: 700;
          margin: 0 0 1.25rem 0;
        }

        .history-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .history-table th {
          padding: 12px 16px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--border-color);
        }

        .history-table td {
          padding: 14px 16px;
          font-size: 0.875rem;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border-color);
        }

        .history-table tr:last-child td {
          border-bottom: none;
        }

        .history-table tr:hover td {
          background: rgba(255, 255, 255, 0.01);
        }

        .url-link {
          color: var(--accent-primary);
          text-decoration: none;
          font-weight: 600;
          transition: opacity 0.2s ease;
        }

        .url-link:hover {
          text-decoration: underline;
          opacity: 0.9;
        }

        .metrics-grid-td {
          display: flex;
          gap: 16px;
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        .metric-badge {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .metric-value-span {
          font-weight: 700;
          color: var(--text-primary);
        }

        .delete-link-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .delete-link-btn:hover {
          background: rgba(239, 68, 68, 0.12);
          color: #ef4444;
        }

        .history-loading {
          text-align: center;
          padding: 2.5rem;
          color: var(--text-secondary);
        }
      `}</style>

      <div className="analyzer-input-card">
        <h3 className="analyzer-title">Analyze Social Media Link</h3>
        
        {error && <div className="analyzer-banner error">{error}</div>}
        {success && <div className="analyzer-banner success">{success}</div>}

        <form className="analyzer-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <input 
              type="text" 
              className="analyzer-input"
              placeholder="Paste YouTube, Instagram, LinkedIn, or Twitch content URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
            {detectedPlatform && (
              <div className="platform-detector">
                {getPlatformIcon(detectedPlatform)}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="analyzer-submit-btn"
            disabled={loading || !url}
          >
            {loading ? 'Analyzing Content Link...' : 'Analyze Content'}
          </button>
        </form>
      </div>

      <div className="history-card">
        <h4 className="history-title">Analyzed Content History</h4>
        
        {listLoading ? (
          <div className="history-loading">Retrieving link history...</div>
        ) : links.length === 0 ? (
          <div className="history-loading">No content links analyzed yet. Try pasting a link above!</div>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Platform</th>
                <th>Content Title</th>
                <th>Performance Metrics</th>
                <th>Date Added</th>
                <th style={{ width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link.id}>
                  <td style={{ fontWeight: '600' }}>
                    {getPlatformIcon(link.platform)}
                  </td>
                  <td>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="url-link">
                      {link.title}
                    </a>
                  </td>
                  <td>
                    <div className="metrics-grid-td">
                      <div className="metric-badge" title="Views">
                        👁️ <span className="metric-value-span">{link.views.toLocaleString()}</span>
                      </div>
                      <div className="metric-badge" title="Likes">
                        ❤️ <span className="metric-value-span">{link.likes.toLocaleString()}</span>
                      </div>
                      <div className="metric-badge" title="Comments">
                        💬 <span className="metric-value-span">{link.comments.toLocaleString()}</span>
                      </div>
                      <div className="metric-badge" title="Shares">
                        🔄 <span className="metric-value-span">{link.shares.toLocaleString()}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                    {new Date(link.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td>
                    <button 
                      type="button" 
                      className="delete-link-btn"
                      title="Remove from history"
                      onClick={() => handleDelete(link.id)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

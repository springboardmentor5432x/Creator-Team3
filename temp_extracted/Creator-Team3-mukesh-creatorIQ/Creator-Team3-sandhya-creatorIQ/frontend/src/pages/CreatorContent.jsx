import React, { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

export default function CreatorContent() {
  const [links, setLinks] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:8000/api/links", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLinks(data);
      } else {
        // Mock fallback if user hasn't added links yet
        setLinks([
          { id: 1, title: "Summer Product Unboxing Video", platform: "YouTube", views: 245000, likes: 18400, comments: 1200, shares: 850, url: "https://youtube.com/watch?v=demo1" },
          { id: 2, title: "Behind the Scenes Reel", platform: "Instagram", views: 480000, likes: 52000, comments: 3400, shares: 2900, url: "https://instagram.com/p/demo2" },
          { id: 3, title: "Creator Strategy Tech Stack Share", platform: "LinkedIn", views: 95000, likes: 4200, comments: 610, shares: 320, url: "https://linkedin.com/posts/demo3" }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/links", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: urlInput.trim() })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to submit link");

      setLinks((prev) => [data, ...prev]);
      setUrlInput("");
      setMessage("Content link added & metrics imported successfully!");
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/links/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setLinks((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLinks = filter === "All"
    ? links
    : links.filter((l) => l.platform.toLowerCase() === filter.toLowerCase());

  const totalViews = links.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalLikes = links.reduce((acc, curr) => acc + (curr.likes || 0), 0);

  return (
    <div className="creator-dashboard">
      <Navbar />
      <div className="creator-layout">
        <Sidebar />
        <main className="creator-main">
          
          <header style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Content Library & Analyzer</h1>
            <p style={{ color: '#94a3b8', margin: '4px 0 0' }}>Track, organize, and inspect video metrics across platforms.</p>
          </header>

          {/* ADD LINK FORM */}
          <section style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '18px' }}>🔗 Analyze & Add New Content Link</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 16px' }}>Paste a YouTube, Instagram, LinkedIn, or Twitch video/post link to analyze metrics.</p>

            {message && <div style={{ background: '#064e3b', color: '#6ee7b7', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>{message}</div>}
            {error && <div style={{ background: '#451a1a', color: '#fca5a5', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}

            <form onSubmit={handleAddLink} style={{ display: 'flex', gap: '12px' }}>
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=... or https://instagram.com/p/..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', border: '1px solid #334155', background: '#1e293b', color: '#fff', outline: 'none' }}
                required
              />
              <button
                type="submit"
                disabled={submitting}
                style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {submitting ? "Analyzing..." : "+ Import Link"}
              </button>
            </form>
          </section>

          {/* METRIC OVERVIEW */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>Tracked Posts</span>
              <h2 style={{ margin: '8px 0 0', fontSize: '24px' }}>{links.length}</h2>
            </div>
            <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>Cumulative Views</span>
              <h2 style={{ margin: '8px 0 0', fontSize: '24px', color: '#60a5fa' }}>{totalViews.toLocaleString()}</h2>
            </div>
            <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>Total Likes</span>
              <h2 style={{ margin: '8px 0 0', fontSize: '24px', color: '#f472b6' }}>{totalLikes.toLocaleString()}</h2>
            </div>
          </div>

          {/* FILTER TABS */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {["All", "YouTube", "Instagram", "LinkedIn", "Twitch"].map((p) => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: filter === p ? '#2563eb' : '#1e293b',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: filter === p ? 'bold' : 'normal'
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* CONTENT LIST */}
          <section style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px' }}>Published Content Items</h3>
            {loading ? (
              <div style={{ color: '#94a3b8', padding: '20px 0' }}>Loading content links...</div>
            ) : filteredLinks.length === 0 ? (
              <div style={{ color: '#94a3b8', padding: '20px 0' }}>No content items found for this platform filter.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredLinks.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#1f2937', borderRadius: '12px', border: '1px solid #374151' }}>
                    <div style={{ flex: 1, marginRight: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', background: item.platform === 'YouTube' ? '#ef4444' : item.platform === 'Instagram' ? '#ec4899' : '#3b82f6', color: '#fff' }}>
                          {item.platform}
                        </span>
                        <h4 style={{ margin: 0, fontSize: '16px' }}>{item.title || item.url}</h4>
                      </div>
                      <a href={item.url} target="_blank" rel="noreferrer" style={{ color: '#60a5fa', fontSize: '13px', display: 'inline-block', marginTop: '6px' }}>
                        {item.url}
                      </a>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', textAlign: 'right' }}>
                      <div>
                        <span style={{ display: 'block', fontSize: '11px', color: '#9ca3af' }}>Views</span>
                        <strong style={{ fontSize: '15px' }}>{Number(item.views || 0).toLocaleString()}</strong>
                      </div>
                      <div>
                        <span style={{ display: 'block', fontSize: '11px', color: '#9ca3af' }}>Likes</span>
                        <strong style={{ fontSize: '15px' }}>{Number(item.likes || 0).toLocaleString()}</strong>
                      </div>
                      <div>
                        <span style={{ display: 'block', fontSize: '11px', color: '#9ca3af' }}>Comments</span>
                        <strong style={{ fontSize: '15px' }}>{Number(item.comments || 0).toLocaleString()}</strong>
                      </div>

                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #7f1d1d', background: '#451a1a', color: '#fca5a5', cursor: 'pointer', fontSize: '13px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}
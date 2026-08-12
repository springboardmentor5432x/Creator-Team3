import React, { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import BrandSidebar from "../components/layout/BrandSidebar";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const role = (localStorage.getItem("role") || "").toLowerCase().trim();
  const isBrand = role === "brand" || role === "brand agency";

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:8000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      } else {
        // Mock fallback
        setNotifications([
          { id: 1, title: "🎉 Welcome to CreatorIQ!", message: "Explore multi-platform analytics, track sponsorship deals, and monitor audience growth.", type: "system", read: false, created_at: new Date().toISOString() },
          { id: 2, title: "📈 Milestone: Views Hit 8.4M!", message: "Your combined audience views crossed 8.4M overall views this month.", type: "milestone", read: false, created_at: new Date().toISOString() },
          { id: 3, title: "💼 New Sponsorship Proposal", message: "Logitech G sent a new sponsorship offer for your YouTube channel.", type: "alert", read: true, created_at: new Date().toISOString() }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:8000/api/notifications/${id}/read`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:8000/api/notifications/read-all", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:8000/api/notifications/clear", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotifications = filter === "All"
    ? notifications
    : filter === "Unread"
    ? notifications.filter((n) => !n.read)
    : notifications.filter((n) => n.type.toLowerCase() === filter.toLowerCase());

  return (
    <div className={isBrand ? "brand-dashboard" : "creator-dashboard"}>
      <Navbar />
      <div className={isBrand ? "brand-dashboard-body" : "creator-layout"}>
        {isBrand ? <BrandSidebar /> : <Sidebar />}
        <main className={isBrand ? "brand-main-content" : "creator-main"}>
          
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Notifications Center</h1>
              <p style={{ color: '#94a3b8', margin: '4px 0 0' }}>Stay updated on milestones, campaigns, and system alerts.</p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleMarkAllRead}
                style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff', cursor: 'pointer', fontSize: '13px' }}
              >
                ✓ Mark All Read
              </button>
              <button
                onClick={handleClearAll}
                style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #7f1d1d', background: '#451a1a', color: '#fca5a5', cursor: 'pointer', fontSize: '13px' }}
              >
                Clear All
              </button>
            </div>
          </header>

          {/* FILTER TABS */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {["All", "Unread", "System", "Milestone", "Alert"].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: filter === t ? '#2563eb' : '#111827',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: filter === t ? 'bold' : 'normal'
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* NOTIFICATION LIST */}
          <section style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
            {loading ? (
              <div style={{ color: '#94a3b8', padding: '20px 0' }}>Loading notifications...</div>
            ) : filteredNotifications.length === 0 ? (
              <div style={{ color: '#94a3b8', padding: '20px 0', textAlign: 'center' }}>No notifications found.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredNotifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center',
                      padding: '16px 20px',
                      borderRadius: '12px',
                      background: n.read ? '#111827' : '#1f2937',
                      border: n.read ? '1px solid #1e293b' : '1px solid #3b82f6'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: n.read ? 'normal' : 'bold' }}>{n.title}</h4>
                        {!n.read && (
                          <span style={{ background: '#2563eb', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>NEW</span>
                        )}
                      </div>
                      <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>{n.message}</p>
                    </div>

                    {!n.read && (
                      <button
                        onClick={() => handleMarkRead(n.id)}
                        style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '12px' }}
                      >
                        Mark Read
                      </button>
                    )}
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
import React, { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

export default function CreatorEarnings() {
  const [records, setRecords] = useState([]);
  const [source, setSource] = useState("Sponsorship");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:8000/api/revenue", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      } else {
        // Fallback default mock records
        setRecords([
          { id: 1, source: "Sponsorship", amount: 6200.00, description: "Tech Sponsorship Integration", date: "2026-07-20" },
          { id: 2, source: "AdSense", amount: 3850.00, description: "Monthly YouTube AdSense Payout", date: "2026-07-15" },
          { id: 3, source: "Merch", amount: 1200.00, description: "Summer Apparel Merchandise Sales", date: "2026-07-10" },
          { id: 4, source: "Affiliate", amount: 610.00, description: "Amazon Gear Affiliate Links", date: "2026-07-05" }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRevenue = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/revenue", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          source,
          amount: parseFloat(amount),
          description
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to log revenue");

      setRecords((prev) => [data, ...prev]);
      setAmount("");
      setDescription("");
      setMessage("Revenue payout recorded successfully!");
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
      const res = await fetch(`http://localhost:8000/api/revenue/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setRecords((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalEarnings = records.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const sponsorshipTotal = records.filter(r => r.source === "Sponsorship").reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const adsenseTotal = records.filter(r => r.source === "AdSense").reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  return (
    <div className="creator-dashboard">
      <Navbar />
      <div className="creator-layout">
        <Sidebar />
        <main className="creator-main">
          
          <header style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Earnings & Revenue Tracker</h1>
            <p style={{ color: '#94a3b8', margin: '4px 0 0' }}>Monitor multi-channel revenue, payouts, sponsorships, and affiliate income.</p>
          </header>

          {/* KPI STAT CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(139,92,246,0.2))', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '16px', padding: '20px' }}>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>💰 Total Gross Revenue</span>
              <h2 style={{ margin: '8px 0 0', fontSize: '28px', color: '#60a5fa' }}>${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
            </div>
            <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>🤝 Sponsorship Payouts</span>
              <h2 style={{ margin: '8px 0 0', fontSize: '24px', color: '#34d399' }}>${sponsorshipTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
            </div>
            <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>▶️ AdSense Revenue</span>
              <h2 style={{ margin: '8px 0 0', fontSize: '24px', color: '#f472b6' }}>${adsenseTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
            </div>
          </div>

          {/* LOG REVENUE FORM */}
          <section style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '18px' }}>➕ Record New Payout or Sponsorship</h3>
            
            {message && <div style={{ background: '#064e3b', color: '#6ee7b7', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>{message}</div>}
            {error && <div style={{ background: '#451a1a', color: '#fca5a5', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}

            <form onSubmit={handleAddRevenue} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Revenue Source</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }}
                >
                  <option value="Sponsorship">Sponsorship Deal</option>
                  <option value="AdSense">AdSense / Platform Ad Share</option>
                  <option value="Affiliate">Affiliate Link Commissions</option>
                  <option value="Merch">Merchandise Drop</option>
                  <option value="Other">Other Payout</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Amount ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 2500.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }}
                  required
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Description / Brand Name</label>
                <input
                  type="text"
                  placeholder="e.g. Q3 Brand Integration or Monthly Payout"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ width: '100%', padding: '12px 20px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {submitting ? "Saving..." : "+ Save Record"}
                </button>
              </div>
            </form>
          </section>

          {/* REVENUE HISTORY TABLE */}
          <section style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px' }}>Payout Transaction History</h3>
            {loading ? (
              <div style={{ color: '#94a3b8', padding: '20px 0' }}>Loading revenue records...</div>
            ) : records.length === 0 ? (
              <div style={{ color: '#94a3b8', padding: '20px 0' }}>No revenue records found. Use the form above to log payouts.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#f8fafc' }}>
                  <thead>
                    <tr style={{ background: '#1f2937', borderBottom: '1px solid #374151', color: '#9ca3af', fontSize: '13px', textTransform: 'uppercase' }}>
                      <th style={{ padding: '14px 16px' }}>Source</th>
                      <th style={{ padding: '14px 16px' }}>Description</th>
                      <th style={{ padding: '14px 16px' }}>Date Recorded</th>
                      <th style={{ padding: '14px 16px' }}>Amount</th>
                      <th style={{ padding: '14px 16px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r) => (
                      <tr key={r.id} style={{ borderBottom: '1px solid #1f2937' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            background: r.source === 'Sponsorship' ? '#065f46' : r.source === 'AdSense' ? '#1e3a8a' : '#581c87',
                            color: '#fff'
                          }}>
                            {r.source}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>{r.description || "N/A"}</td>
                        <td style={{ padding: '14px 16px', color: '#9ca3af' }}>{r.date ? new Date(r.date).toLocaleDateString() : "Recent"}</td>
                        <td style={{ padding: '14px 16px', fontWeight: 'bold', color: '#34d399' }}>
                          +${Number(r.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <button
                            onClick={() => handleDelete(r.id)}
                            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #7f1d1d', background: '#451a1a', color: '#fca5a5', cursor: 'pointer', fontSize: '12px' }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}
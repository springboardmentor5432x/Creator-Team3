import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RevenueTracker({ token }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ source: 'AdSense', amount: '', description: '', date: '' });

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://127.0.0.1:8000/api/revenue', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      } else {
        throw new Error('Failed to load revenue details');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRevenue();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const amt = parseFloat(form.amount);
    if (isNaN(amt) || amt <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }

    try {
      setActionLoading(true);
      const res = await fetch('http://127.0.0.1:8000/api/revenue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          source: form.source,
          amount: amt,
          description: form.description.trim(),
          date: form.date ? new Date(form.date).toISOString() : null
        })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || 'Failed to log transaction');

      setRecords(prev => [data, ...prev]);
      setForm({ source: 'AdSense', amount: '', description: '', date: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction record?')) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/revenue/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setRecords(prev => prev.filter(r => r.id !== id));
      } else {
        alert('Failed to delete transaction record');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Aggregated values
  const totalOverall = records.reduce((acc, r) => acc + r.amount, 0);
  const adsenseTotal = records.filter(r => r.source === 'AdSense').reduce((acc, r) => acc + r.amount, 0);
  const sponsorshipTotal = records.filter(r => r.source === 'Sponsorship').reduce((acc, r) => acc + r.amount, 0);
  const affiliateTotal = records.filter(r => r.source === 'Affiliate' || r.source === 'Merch').reduce((acc, r) => acc + r.amount, 0);

  // Group by Month for Chart
  const getChartData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlySum = {};

    records.forEach(r => {
      const d = new Date(r.date);
      const mLabel = `${months[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`;
      monthlySum[mLabel] = (monthlySum[mLabel] || 0) + r.amount;
    });

    // Sort monthly labels chronologically
    return Object.keys(monthlySum).map(key => ({
      month: key,
      earnings: monthlySum[key]
    })).reverse(); // Reverse to keep timeline running left-to-right
  };

  const chartData = getChartData();

  return (
    <div className="revenue-tracker">
      <style>{`
        .revenue-tracker {
          font-family: 'Inter', sans-serif;
          color: var(--text-primary);
          display: flex;
          flex-direction: column;
          gap: 2rem;
          width: 100%;
        }

        .revenue-title-row {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .revenue-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }

        .revenue-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0;
        }

        /* KPI Cards Grid */
        .revenue-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        .revenue-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 1.5rem;
          backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
        }

        .revenue-card-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .revenue-card-value {
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        /* Chart section */
        .revenue-chart-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 1.75rem;
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .chart-title {
          font-size: 1.125rem;
          font-weight: 700;
          margin: 0;
        }

        /* Two columns layout */
        .revenue-split-row {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 1.5rem;
        }

        @media (max-width: 1024px) {
          .revenue-split-row {
            grid-template-columns: 1fr;
          }
        }

        /* Form Card */
        .revenue-form-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 1.5rem;
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          height: fit-content;
        }

        .form-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0;
        }

        .revenue-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .form-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
        }

        .form-input, .form-select {
          background: var(--input-bg, rgba(15, 23, 42, 0.6));
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 10px 12px;
          color: var(--text-primary);
          outline: none;
          font-size: 0.875rem;
          transition: border-color 0.2s ease;
        }

        .form-input:focus, .form-select:focus {
          border-color: var(--accent-primary);
        }

        .form-select option {
          background: #1e293b;
          color: #ffffff;
        }

        .submit-btn {
          background: var(--accent-primary);
          color: #ffffff;
          border: none;
          border-radius: 10px;
          padding: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px var(--accent-glow);
          margin-top: 0.5rem;
        }

        .submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px var(--accent-glow);
        }

        /* Ledger Table Card */
        .ledger-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 1.5rem;
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
          overflow-x: auto;
        }

        .ledger-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .ledger-table th {
          padding: 12px 16px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--border-color);
        }

        .ledger-table td {
          padding: 14px 16px;
          font-size: 0.875rem;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border-color);
        }

        .ledger-table tr:last-child td {
          border-bottom: none;
        }

        .source-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .source-badge.adsense {
          background: rgba(59, 130, 246, 0.12);
          color: #60a5fa;
        }

        .source-badge.sponsorship {
          background: rgba(139, 92, 246, 0.12);
          color: #a78bfa;
        }

        .source-badge.affiliate {
          background: rgba(236, 72, 153, 0.12);
          color: #f472b6;
        }

        .source-badge.merch {
          background: rgba(16, 185, 129, 0.12);
          color: #34d399;
        }

        .delete-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.12);
          color: #ef4444;
        }

        .ledger-empty {
          text-align: center;
          padding: 3rem;
          color: var(--text-secondary);
        }
      `}</style>

      <div className="revenue-title-row">
        <h2 className="revenue-title">Revenue Tracking Center</h2>
        <p className="revenue-subtitle">Monitor and log earnings from sponsorships, ads, and merchandise.</p>
      </div>

      {error && <div className="analyzer-banner error" style={{ marginBottom: 0 }}>{error}</div>}

      {loading ? (
        <div className="ledger-empty">Loading earnings metrics...</div>
      ) : (
        <>
          {/* KPI Earnings Cards */}
          <div className="revenue-cards-grid">
            <div className="revenue-card">
              <span className="revenue-card-label">Total Earnings</span>
              <span className="revenue-card-value">${totalOverall.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="revenue-card">
              <span className="revenue-card-label">AdSense Revenue</span>
              <span className="revenue-card-value">${adsenseTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="revenue-card">
              <span className="revenue-card-label">Sponsorship Deals</span>
              <span className="revenue-card-value">${sponsorshipTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="revenue-card">
              <span className="revenue-card-label">Affiliate & Merch</span>
              <span className="revenue-card-value">${affiliateTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>



          {/* Split Row for Form and Ledger */}
          <div className="revenue-split-row">
            {/* Form */}
            <div className="revenue-form-card">
              <h4 className="form-title">Log New Payout</h4>
              <form className="revenue-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Source</label>
                  <select 
                    className="form-select"
                    value={form.source}
                    onChange={(e) => setForm(prev => ({ ...prev, source: e.target.value }))}
                  >
                    <option value="AdSense">AdSense</option>
                    <option value="Sponsorship">Sponsorship</option>
                    <option value="Affiliate">Affiliate</option>
                    <option value="Merch">Merch</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Amount ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="form-input"
                    placeholder="e.g. 1500.00"
                    value={form.amount}
                    onChange={(e) => setForm(prev => ({ ...prev, amount: e.target.value }))}
                    required
                    disabled={actionLoading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Date (Optional)</label>
                  <input 
                    type="date" 
                    className="form-input"
                    value={form.date}
                    onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
                    disabled={actionLoading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="e.g. May AdSense payout"
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    disabled={actionLoading}
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={actionLoading}>
                  {actionLoading ? 'Logging...' : 'Add Record'}
                </button>
              </form>
            </div>

            {/* Ledger Table */}
            <div className="ledger-card">
              <h4 className="form-title" style={{ marginBottom: '1.25rem' }}>Transaction Ledger</h4>
              {records.length === 0 ? (
                <div className="ledger-empty" style={{ padding: '2rem' }}>No transaction records found.</div>
              ) : (
                <table className="ledger-table">
                  <thead>
                    <tr>
                      <th>Source</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th style={{ width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <span className={`source-badge ${r.source.toLowerCase()}`}>
                            {r.source}
                          </span>
                        </td>
                        <td style={{ fontWeight: '500' }}>{r.description || 'N/A'}</td>
                        <td style={{ fontWeight: '700' }}>
                          ${r.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                          {new Date(r.date).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td>
                          <button 
                            type="button" 
                            className="delete-btn"
                            title="Delete transaction record"
                            onClick={() => handleDelete(r.id)}
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
        </>
      )}
    </div>
  );
}

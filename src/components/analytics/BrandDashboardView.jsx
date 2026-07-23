import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const initialReachData = [
  { month: "Jan", reach: 2.1 },
  { month: "Feb", reach: 3.4 },
  { month: "Mar", reach: 4.2 },
  { month: "Apr", reach: 5.8 },
  { month: "May", reach: 7.2 },
  { month: "Jun", reach: 8.6 }
];

const initialEngagementData = [
  { month: "Jan", engagement: 6.2 },
  { month: "Feb", engagement: 7.1 },
  { month: "Mar", engagement: 6.8 },
  { month: "Apr", engagement: 8.4 },
  { month: "May", engagement: 7.9 },
  { month: "Jun", engagement: 9.1 }
];

export default function BrandDashboardView({ token }) {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/campaigns", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setCampaigns(data);
        }
      } catch (err) {
        console.error("Error loading campaigns:", err);
      }
    };
    if (token) {
      fetchCampaigns();
    }
  }, [token]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', creators: '', reach: '', engagement: '', status: 'Active' });

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const payload = {
      name: form.name.trim(),
      creators: parseInt(form.creators) || 0,
      reach: form.reach || "0",
      engagement: form.engagement || "0.0%",
      status: form.status
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setCampaigns(prev => [data, ...prev]);
        setForm({ name: '', creators: '', reach: '', engagement: '', status: 'Active' });
        setShowModal(false);
      }
    } catch (err) {
      console.error("Error creating campaign:", err);
    }
  };

  const totalCreators = campaigns.reduce((acc, c) => acc + c.creators, 0);

  return (
    <div className="brand-dashboard-view">
      <style>{`
        .brand-dashboard-view {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          font-family: 'Inter', sans-serif;
          color: var(--text-primary);
        }

        .brand-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .brand-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }

        .brand-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0.25rem 0 0 0;
        }

        .create-btn {
          background: var(--accent-primary);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          padding: 12px 20px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px var(--accent-glow);
        }

        .create-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px var(--accent-glow);
        }

        /* KPI Cards Grid */
        .brand-kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        .brand-kpi-card {
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

        .brand-kpi-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .brand-kpi-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .brand-kpi-icon {
          font-size: 1.25rem;
        }

        .brand-kpi-card h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin: 0;
        }

        .brand-kpi-card p {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #34d399;
          margin: 0;
        }

        /* Chart section */
        .brand-chart-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 900px) {
          .brand-chart-grid {
            grid-template-columns: 1fr;
          }
        }

        .brand-chart-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 1.5rem;
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chart-title {
          font-size: 1.125rem;
          font-weight: 700;
          margin: 0;
        }

        .chart-subtitle {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          margin: 0.25rem 0 0 0;
        }

        /* Table section */
        .brand-table-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 1.5rem;
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
          overflow-x: auto;
        }

        .brand-table-title {
          font-size: 1.15rem;
          font-weight: 700;
          margin: 0 0 1.25rem 0;
        }

        .brand-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .brand-table th {
          padding: 12px 16px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--border-color);
        }

        .brand-table td {
          padding: 14px 16px;
          font-size: 0.875rem;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border-color);
        }

        .brand-table tr:last-child td {
          border-bottom: none;
        }

        .campaign-status {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .campaign-status.active {
          background: rgba(16, 185, 129, 0.12);
          color: #34d399;
        }

        .campaign-status.completed {
          background: rgba(59, 130, 246, 0.12);
          color: #60a5fa;
        }

        /* Modal styling */
        .brand-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .brand-modal {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 2rem;
          width: 90%;
          max-width: 450px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .modal-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .cancel-btn {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 10px 18px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
        }
      `}</style>

      <div className="brand-header-row">
        <div>
          <h2 className="brand-title">Campaign Dashboard</h2>
          <p className="brand-subtitle">Monitor your brand campaigns, creator counts, and performance metrics.</p>
        </div>
        <button className="create-btn" onClick={() => setShowModal(true)}>
          + Create Campaign
        </button>
      </div>

      {/* Brand KPI cards */}
      <div className="brand-kpi-grid">
        <div className="brand-kpi-card">
          <div className="brand-kpi-top">
            <span className="brand-kpi-title">Active Campaigns</span>
            <span className="brand-kpi-icon">📢</span>
          </div>
          <h2>{campaigns.filter(c => c.status === 'Active').length}</h2>
          <p>Live campaigns running</p>
        </div>
        <div className="brand-kpi-card">
          <div className="brand-kpi-top">
            <span className="brand-kpi-title">Collaborating Creators</span>
            <span className="brand-kpi-icon">👥</span>
          </div>
          <h2>{totalCreators}</h2>
          <p>Total creators hired</p>
        </div>
        <div className="brand-kpi-card">
          <div className="brand-kpi-top">
            <span className="brand-kpi-title">Total Campaign Reach</span>
            <span className="brand-kpi-icon">👁️</span>
          </div>
          <h2>5.1M</h2>
          <p>↑ +18.4% reach gain</p>
        </div>
        <div className="brand-kpi-card">
          <div className="brand-kpi-top">
            <span className="brand-kpi-title">Total Campaign Spend</span>
            <span className="brand-kpi-icon">💰</span>
          </div>
          <h2>$84,200</h2>
          <p>↑ +8.2% budget allocation</p>
        </div>
      </div>

      {/* Two columns of charts */}
      <div className="brand-chart-grid">
        <div className="brand-chart-card">
          <div className="chart-header">
            <div>
              <h4 className="chart-title">Campaign Reach Growth</h4>
              <p className="chart-subtitle">Monthly cumulative reach trajectory</p>
            </div>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={initialReachData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={11} />
                <YAxis stroke="var(--text-secondary)" fontSize={11} tickFormatter={(val) => `${val}M`} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-secondary)', 
                    borderColor: 'var(--border-color)',
                    borderRadius: '12px',
                    color: 'var(--text-primary)'
                  }}
                  formatter={(value) => [`${value} Million`, 'Reach']}
                />
                <Line type="monotone" dataKey="reach" stroke="var(--accent-primary)" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="brand-chart-card">
          <div className="chart-header">
            <div>
              <h4 className="chart-title">Brand Engagement Trends</h4>
              <p className="chart-subtitle">Average collaboration engagement percentages</p>
            </div>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={initialEngagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={11} />
                <YAxis stroke="var(--text-secondary)" fontSize={11} tickFormatter={(val) => `${val}%`} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-secondary)', 
                    borderColor: 'var(--border-color)',
                    borderRadius: '12px',
                    color: 'var(--text-primary)'
                  }}
                  formatter={(value) => [`${value}%`, 'Engagement']}
                />
                <Bar dataKey="engagement" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Campaigns Ledger table */}
      <div className="brand-table-card">
        <h4 className="brand-table-title">Recent Campaigns</h4>
        <table className="brand-table">
          <thead>
            <tr>
              <th>Campaign Name</th>
              <th>Creators Hired</th>
              <th>Total Reach</th>
              <th>Engagement Rate</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id}>
                <td style={{ fontWeight: '600' }}>{c.name}</td>
                <td>{c.creators} creators</td>
                <td style={{ fontWeight: '700' }}>{c.reach}</td>
                <td>{c.engagement}</td>
                <td>
                  <span className={`campaign-status ${c.status.toLowerCase()}`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="brand-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="brand-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Create Brand Campaign</h3>
            <form className="modal-form" onSubmit={handleCreateCampaign}>
              <div className="form-group">
                <label className="form-label">Campaign Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="e.g. Autumn Sweater Launch"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Creators Hired</label>
                <input 
                  type="number" 
                  className="form-input"
                  placeholder="e.g. 15"
                  value={form.creators}
                  onChange={(e) => setForm(prev => ({ ...prev, creators: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Estimated Reach</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="e.g. 1.2M"
                  value={form.reach}
                  onChange={(e) => setForm(prev => ({ ...prev, reach: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Engagement Rate (%)</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="e.g. 6.4%"
                  value={form.engagement}
                  onChange={(e) => setForm(prev => ({ ...prev, engagement: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select 
                  className="form-select"
                  value={form.status}
                  onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn" style={{ marginTop: 0 }}>Add Campaign</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

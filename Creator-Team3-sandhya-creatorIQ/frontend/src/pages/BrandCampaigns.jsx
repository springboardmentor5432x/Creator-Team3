import React, { useState } from "react";
import Navbar from "../components/layout/Navbar";
import BrandSidebar from "../components/layout/BrandSidebar";

export default function BrandCampaigns() {
  const [showModal, setShowModal] = useState(false);
  const [campaigns, setCampaigns] = useState([
    { id: 1, title: "Summer Product Launch", platform: "YouTube", creators: 24, reach: "2.4M", budget: "$45,000", status: "Active" },
    { id: 2, title: "Influencer Awareness Drive", platform: "Instagram", creators: 18, reach: "1.8M", budget: "$30,000", status: "Active" },
    { id: 3, title: "Q2 Tech Hardware Benchmarks", platform: "LinkedIn", creators: 12, reach: "950K", budget: "$22,000", status: "Completed" }
  ]);

  const [form, setForm] = useState({
    title: "",
    platform: "YouTube",
    creators: "",
    budget: "",
    reach: "500K"
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.title || !form.budget) return;

    const newCampaign = {
      id: Date.now(),
      title: form.title,
      platform: form.platform,
      creators: Number(form.creators) || 5,
      reach: form.reach || "500K",
      budget: `$${Number(form.budget).toLocaleString()}`,
      status: "Active"
    };

    setCampaigns([newCampaign, ...campaigns]);
    setShowModal(false);
    setForm({ title: "", platform: "YouTube", creators: "", budget: "", reach: "500K" });
  };

  return (
    <div className="brand-dashboard">
      <Navbar />
      <div className="brand-dashboard-body">
        <BrandSidebar />
        <main className="brand-main-content">
          
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Brand Campaign Management</h1>
              <p style={{ color: '#94a3b8', margin: '4px 0 0' }}>Launch, manage, and inspect influencer sponsorship campaigns.</p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
            >
              + Create Campaign
            </button>
          </header>

          {/* CREATE MODAL */}
          {showModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '30px', width: '90%', maxWidth: '500px', color: '#fff' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '20px' }}>Create New Brand Campaign</h3>
                <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Campaign Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Fall Tech Review Sponsorship"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Target Platform</label>
                      <select
                        value={form.platform}
                        onChange={(e) => setForm({ ...form, platform: e.target.value })}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }}
                      >
                        <option value="YouTube">YouTube</option>
                        <option value="Instagram">Instagram</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Twitch">Twitch</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Budget ($ USD)</label>
                      <input
                        type="number"
                        placeholder="25000"
                        value={form.budget}
                        onChange={(e) => setForm({ ...form, budget: e.target.value })}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Target Creator Count</label>
                    <input
                      type="number"
                      placeholder="10"
                      value={form.creators}
                      onChange={(e) => setForm({ ...form, creators: e.target.value })}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Launch Campaign
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* CAMPAIGNS GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {campaigns.map((c) => (
              <div key={c.id} style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', background: c.platform === 'YouTube' ? '#ef4444' : '#ec4899', color: '#fff' }}>
                    {c.platform}
                  </span>
                  <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', background: c.status === 'Active' ? '#065f46' : '#374151', color: c.status === 'Active' ? '#34d399' : '#9ca3af' }}>
                    {c.status}
                  </span>
                </div>

                <h3 style={{ margin: '0 0 8px', fontSize: '18px' }}>{c.title}</h3>
                <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0 0 16px' }}>👥 {c.creators} creators partnered • {c.reach} reach</p>

                <div style={{ background: '#1f2937', padding: '12px 16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#9ca3af', fontSize: '13px' }}>Allocated Budget</span>
                  <strong style={{ fontSize: '16px', color: '#60a5fa' }}>{c.budget}</strong>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
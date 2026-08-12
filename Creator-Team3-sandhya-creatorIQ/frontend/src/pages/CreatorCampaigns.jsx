import React, { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

export default function CreatorCampaigns() {
  const [activeTab, setActiveTab] = useState("Active");
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      brand: "Logitech G",
      title: "Pro Gaming Gear Showcase",
      payout: "$4,500",
      deliverable: "1 Dedicated YouTube Video & 2 Shorts",
      deadline: "Aug 18, 2026",
      status: "Active",
      progress: "In Progress"
    },
    {
      id: 2,
      brand: "NordVPN",
      title: "Cyber Security Awareness Sponsorship",
      payout: "$6,200",
      deliverable: "60-second Mid-roll Integration",
      deadline: "Aug 25, 2026",
      status: "Active",
      progress: "Draft Review"
    },
    {
      id: 3,
      brand: "Squarespace",
      title: "Creator Portfolio Builder Campaign",
      payout: "$3,800",
      deliverable: "1 Instagram Reel & Story Link",
      deadline: "Sep 02, 2026",
      status: "Pending",
      progress: "Invitation Received"
    },
    {
      id: 4,
      brand: "Intel",
      title: "Core Ultra Laptop Benchmarks",
      payout: "$8,000",
      deliverable: "YouTube Review + Tech Blog Link",
      deadline: "Jul 15, 2026",
      status: "Completed",
      progress: "Paid & Archived"
    }
  ]);

  const handleAccept = (id) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Active", progress: "In Progress" } : c))
    );
  };

  const filteredCampaigns = campaigns.filter((c) => c.status === activeTab);

  return (
    <div className="creator-dashboard">
      <Navbar />
      <div className="creator-layout">
        <Sidebar />
        <main className="creator-main">
          
          <header style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Brand Sponsorship Campaigns</h1>
            <p style={{ color: '#94a3b8', margin: '4px 0 0' }}>Review, manage, and track brand sponsorship deals and deliverables.</p>
          </header>

          {/* TABS */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            {["Active", "Pending", "Completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: activeTab === tab ? 'linear-gradient(135deg, #2563eb, #8b5cf6)' : '#111827',
                  color: '#fff',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {tab} Campaigns ({campaigns.filter(c => c.status === tab).length})
              </button>
            ))}
          </div>

          {/* CAMPAIGN CARDS GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {filteredCampaigns.length === 0 ? (
              <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '30px', color: '#94a3b8', gridColumn: '1 / -1' }}>
                No {activeTab.toLowerCase()} campaigns found.
              </div>
            ) : (
              filteredCampaigns.map((c) => (
                <div key={c.id} style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.brand}</span>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        background: c.status === 'Active' ? '#065f46' : c.status === 'Pending' ? '#854d0e' : '#374151',
                        color: c.status === 'Active' ? '#34d399' : c.status === 'Pending' ? '#fde047' : '#9ca3af'
                      }}>
                        {c.progress}
                      </span>
                    </div>

                    <h3 style={{ margin: '0 0 8px', fontSize: '18px' }}>{c.title}</h3>
                    <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0 0 16px' }}>📝 {c.deliverable}</p>

                    <div style={{ background: '#1f2937', padding: '12px 16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: '#9ca3af', display: 'block' }}>Payout</span>
                        <strong style={{ fontSize: '18px', color: '#34d399' }}>{c.payout}</strong>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '11px', color: '#9ca3af', display: 'block' }}>Deadline</span>
                        <strong style={{ fontSize: '14px', color: '#f8fafc' }}>{c.deadline}</strong>
                      </div>
                    </div>
                  </div>

                  {c.status === "Pending" ? (
                    <button
                      onClick={() => handleAccept(c.id)}
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Accept Deal & Start
                    </button>
                  ) : c.status === "Active" ? (
                    <button
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #3b82f6', background: '#1e293b', color: '#60a5fa', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Upload Deliverable Draft
                    </button>
                  ) : (
                    <button
                      disabled
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: '#1f2937', color: '#6b7280', fontWeight: 'bold' }}
                    >
                      Campaign Completed
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
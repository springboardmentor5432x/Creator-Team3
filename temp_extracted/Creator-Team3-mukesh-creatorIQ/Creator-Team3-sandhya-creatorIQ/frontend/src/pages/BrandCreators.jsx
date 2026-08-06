import React, { useState } from "react";
import Navbar from "../components/layout/Navbar";
import BrandSidebar from "../components/layout/BrandSidebar";

export default function BrandCreators() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [inviteSent, setInviteSent] = useState("");

  const creatorsList = [
    { id: 1, name: "Alex Smith", category: "Technology", platform: "YouTube", followers: "520K", engagement: "5.6%", avatar: "AS", bio: "Hardware reviews, benchmarks & AI software." },
    { id: 2, name: "Jamie Miller", category: "Fashion", platform: "Instagram", followers: "450K", engagement: "4.2%", avatar: "JM", bio: "Sustainable style, streetwear & apparel lookbooks." },
    { id: 3, name: "Ryan Kumar", category: "Fitness", platform: "TikTok", followers: "234K", engagement: "7.8%", avatar: "RK", bio: "High performance athletic training & nutrition." },
    { id: 4, name: "Sarah Vance", category: "Gaming", platform: "Twitch", followers: "310K", engagement: "6.4%", avatar: "SV", bio: "Live esports streams, gaming setups & gear." },
    { id: 5, name: "David Chen", category: "Technology", platform: "YouTube", followers: "890K", engagement: "8.1%", avatar: "DC", bio: "Consumer electronics, gadgets & mobile teardowns." }
  ];

  const handleInvite = (name) => {
    setInviteSent(`Campaign invitation successfully sent to ${name}!`);
    setTimeout(() => setInviteSent(""), 4000);
  };

  const filteredCreators = creatorsList.filter((c) => {
    const matchesCategory = category === "All" || c.category === category;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="brand-dashboard">
      <Navbar />
      <div className="brand-dashboard-body">
        <BrandSidebar />
        <main className="brand-main-content">
          
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Creator & Influencer Discovery</h1>
              <p style={{ color: '#94a3b8', margin: '4px 0 0' }}>Search, filter, and partner with top verified creators.</p>
            </div>
          </header>

          {inviteSent && (
            <div style={{ background: '#064e3b', color: '#6ee7b7', padding: '14px 20px', borderRadius: '10px', marginBottom: '20px' }}>
              ✓ {inviteSent}
            </div>
          )}

          {/* SEARCH & FILTERS */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="🔍 Search creators by name or niche..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: '240px', padding: '12px 16px', borderRadius: '10px', border: '1px solid #334155', background: '#111827', color: '#fff', outline: 'none' }}
            />

            <div style={{ display: 'flex', gap: '8px' }}>
              {["All", "Technology", "Fashion", "Fitness", "Gaming"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    background: category === cat ? '#2563eb' : '#111827',
                    color: '#fff',
                    fontWeight: category === cat ? 'bold' : 'normal',
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* CREATOR GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {filteredCreators.map((c) => (
              <div key={c.id} style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', color: '#fff' }}>
                      {c.avatar}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '18px' }}>{c.name}</h3>
                      <span style={{ fontSize: '12px', color: '#60a5fa', fontWeight: 'bold' }}>{c.category} • {c.platform}</span>
                    </div>
                  </div>

                  <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0 0 16px' }}>{c.bio}</p>

                  <div style={{ background: '#1f2937', padding: '12px', borderRadius: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', textAlign: 'center' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#9ca3af', display: 'block' }}>Followers</span>
                      <strong style={{ fontSize: '16px' }}>{c.followers}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: '#9ca3af', display: 'block' }}>Engagement</span>
                      <strong style={{ fontSize: '16px', color: '#34d399' }}>{c.engagement}</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleInvite(c.name)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  + Invite to Campaign
                </button>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
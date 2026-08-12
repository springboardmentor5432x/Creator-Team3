import React, { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import BrandSidebar from "../components/layout/BrandSidebar";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = (localStorage.getItem("role") || "").toLowerCase().trim();
  const isBrand = role === "brand" || role === "brand agency";

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:8000/api/user/details", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.account);
        setProfile(data.profile);
      } else {
        setUser({
          Username: localStorage.getItem("email")?.split("@")[0] || "CreatorUser",
          Email: localStorage.getItem("email") || "user@example.com",
          phone: "+1 (555) 234-5678",
          role: role.toUpperCase()
        });
        setProfile({
          bio: "Digital content creator specializing in tech reviews & video production.",
          platform: "YouTube",
          region: "United States",
          language: "English"
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={isBrand ? "brand-dashboard" : "creator-dashboard"}>
      <Navbar />
      <div className={isBrand ? "brand-dashboard-body" : "creator-layout"}>
        {isBrand ? <BrandSidebar /> : <Sidebar />}
        <main className={isBrand ? "brand-main-content" : "creator-main"}>
          
          <header style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>User Account & Portfolio</h1>
            <p style={{ color: '#94a3b8', margin: '4px 0 0' }}>Manage personal details, bio, and connected handles.</p>
          </header>

          {loading ? (
            <div style={{ color: '#94a3b8', padding: '20px 0' }}>Loading profile...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              
              {/* PROFILE CARD */}
              <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '28px', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>
                  {user?.Username?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <h2 style={{ margin: '0 0 4px', fontSize: '22px' }}>{user?.Username || "User"}</h2>
                <span style={{ background: '#1f2937', color: '#60a5fa', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '12px' }}>
                  {user?.role || role.toUpperCase()}
                </span>
                <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '16px' }}>{profile?.bio || "No bio added."}</p>
              </div>

              {/* DETAILS CARD */}
              <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '28px' }}>
                <h3 style={{ margin: '0 0 20px', fontSize: '18px' }}>Account Specifications</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#1f2937', borderRadius: '8px' }}>
                    <span style={{ color: '#9ca3af' }}>Email Address</span>
                    <strong>{user?.Email || "Not available"}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#1f2937', borderRadius: '8px' }}>
                    <span style={{ color: '#9ca3af' }}>Phone Contact</span>
                    <strong>{user?.phone || "Not set"}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#1f2937', borderRadius: '8px' }}>
                    <span style={{ color: '#9ca3af' }}>Primary Platform</span>
                    <strong>{profile?.platform || "YouTube"}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#1f2937', borderRadius: '8px' }}>
                    <span style={{ color: '#9ca3af' }}>Region / Language</span>
                    <strong>{profile?.region || "Global"} ({profile?.language || "EN"})</strong>
                  </div>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}
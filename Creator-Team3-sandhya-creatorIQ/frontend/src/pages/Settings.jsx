import React, { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import BrandSidebar from "../components/layout/BrandSidebar";

export default function Settings() {
  const [account, setAccount] = useState({ Username: "", Email: "", phone: "", Password: "" });
  const [profile, setProfile] = useState({ bio: "", language: "English", region: "United States", platform: "YouTube" });
  const [loading, setLoading] = useState(true);
  const [submittingAccount, setSubmittingAccount] = useState(false);
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const role = (localStorage.getItem("role") || "").toLowerCase().trim();
  const isBrand = role === "brand" || role === "brand agency";

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:8000/api/user/details", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAccount({ ...data.account, Password: "" });
        setProfile(data.profile);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    try {
      setSubmittingAccount(true);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/user/account", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(account)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to update account");

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
      }
      localStorage.setItem("email", account.Email);
      setMessage("Account details updated successfully!");
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmittingAccount(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSubmittingProfile(true);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/user/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(profile)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to update profile");

      setMessage("Profile & Preferences updated successfully!");
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmittingProfile(false);
    }
  };

  return (
    <div className={isBrand ? "brand-dashboard" : "creator-dashboard"}>
      <Navbar />
      <div className={isBrand ? "brand-dashboard-body" : "creator-layout"}>
        {isBrand ? <BrandSidebar /> : <Sidebar />}
        <main className={isBrand ? "brand-main-content" : "creator-main"}>
          
          <header style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Account & Profile Settings</h1>
            <p style={{ color: '#94a3b8', margin: '4px 0 0' }}>Update account credentials, security, bio, and primary social handles.</p>
          </header>

          {message && <div style={{ background: '#064e3b', color: '#6ee7b7', padding: '14px 20px', borderRadius: '10px', marginBottom: '20px' }}>✓ {message}</div>}
          {error && <div style={{ background: '#451a1a', color: '#fca5a5', padding: '14px 20px', borderRadius: '10px', marginBottom: '20px' }}>⚠ {error}</div>}

          {loading ? (
            <div style={{ color: '#94a3b8', padding: '20px 0' }}>Loading settings...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              
              {/* ACCOUNT CREDENTIALS */}
              <section style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '18px' }}>👤 Credentials & Security</h3>
                <form onSubmit={handleUpdateAccount} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Username</label>
                    <input
                      type="text"
                      value={account.Username}
                      onChange={(e) => setAccount({ ...account, Username: e.target.value })}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Email Address</label>
                    <input
                      type="email"
                      value={account.Email}
                      onChange={(e) => setAccount({ ...account, Email: e.target.value })}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Phone Number</label>
                    <input
                      type="text"
                      value={account.phone}
                      onChange={(e) => setAccount({ ...account, phone: e.target.value })}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>New Password (Optional)</label>
                    <input
                      type="password"
                      placeholder="Leave blank to keep current"
                      value={account.Password || ""}
                      onChange={(e) => setAccount({ ...account, Password: e.target.value })}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingAccount}
                    style={{ marginTop: '8px', padding: '12px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    {submittingAccount ? "Saving..." : "Save Account Credentials"}
                  </button>
                </form>
              </section>

              {/* PROFILE & PREFERENCES */}
              <section style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '18px' }}>📝 Profile Bio & Platform Niche</h3>
                <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Bio / Overview</label>
                    <textarea
                      rows={3}
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Primary Platform</label>
                    <select
                      value={profile.platform}
                      onChange={(e) => setProfile({ ...profile, platform: e.target.value })}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }}
                    >
                      <option value="YouTube">YouTube</option>
                      <option value="Instagram">Instagram</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Twitch">Twitch</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Region</label>
                      <input
                        type="text"
                        value={profile.region}
                        onChange={(e) => setProfile({ ...profile, region: e.target.value })}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Language</label>
                      <input
                        type="text"
                        value={profile.language}
                        onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingProfile}
                    style={{ marginTop: '8px', padding: '12px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    {submittingProfile ? "Saving..." : "Save Profile & Preferences"}
                  </button>
                </form>
              </section>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}

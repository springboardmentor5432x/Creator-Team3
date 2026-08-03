import React, { useState, useEffect } from 'react';
import { X, Save, RefreshCw, DollarSign, Sliders, Layers, Globe } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const RevenueSettingsModal = ({ isOpen, onClose, token, onSettingsSaved }) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({
    cpm_us: 10.0,
    cpm_india: 1.2,
    cpm_europe: 6.5,
    cpm_asia: 3.0,
    default_cpm: 4.5,
    monetization_rate: 0.8,
    sponsorship_rate_per_follower: 0.005,
    affiliate_ctr: 2.5,
    affiliate_conversion_rate: 3.0,
    affiliate_commission: 10.0,
    subscription_price: 4.99,
    subscription_member_pct: 1.5,
    subscription_retention: 85.0
  });

  useEffect(() => {
    if (isOpen && token) {
      setLoading(true);
      fetch('http://127.0.0.1:8000/api/revenue/settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data && !data.detail) {
            setForm({
              cpm_us: data.cpm_us ?? 10.0,
              cpm_india: data.cpm_india ?? 1.2,
              cpm_europe: data.cpm_europe ?? 6.5,
              cpm_asia: data.cpm_asia ?? 3.0,
              default_cpm: data.default_cpm ?? 4.5,
              monetization_rate: data.monetization_rate ?? 0.8,
              sponsorship_rate_per_follower: data.sponsorship_rate_per_follower ?? 0.005,
              affiliate_ctr: data.affiliate_ctr ?? 2.5,
              affiliate_conversion_rate: data.affiliate_conversion_rate ?? 3.0,
              affiliate_commission: data.affiliate_commission ?? 10.0,
              subscription_price: data.subscription_price ?? 4.99,
              subscription_member_pct: data.subscription_member_pct ?? 1.5,
              subscription_retention: data.subscription_retention ?? 85.0
            });
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setForm(prev => ({ ...prev, [field]: parseFloat(val) || 0 }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/revenue/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (onSettingsSaved) onSettingsSaved(data);
      onClose();
    } catch (err) {
      console.error("Save error", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      backdropFilter: 'var(--backdrop-filter)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="theme-card" style={{
        width: '100%',
        maxWidth: '750px',
        maxHeight: '90vh',
        overflowY: 'auto',
        backgroundColor: 'var(--bg-modal)',
        borderColor: 'var(--border-hover)',
        borderRadius: 'var(--card-radius)',
        boxShadow: 'var(--shadow-modal)',
        color: 'var(--text-primary)',
        padding: '28px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-primary)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'var(--badge-bg)', color: 'var(--accent-primary)', padding: '10px', borderRadius: '10px' }}>
              <Sliders size={22} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>Revenue Estimation Parameters</h2>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Customize CPM ranges, sponsorship baselines, and monetization variables</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <RefreshCw className="animate-spin" size={28} style={{ margin: '0 auto 12px' }} />
            <p>Loading parameters...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* CPM per Region */}
            <div style={{ background: 'var(--bg-input)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'var(--accent-primary)' }}>
                <Globe size={18} />
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>YouTube AdSense CPM Ranges ($ per 1,000 views)</h4>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>United States ($)</label>
                  <input type="number" step="0.1" value={form.cpm_us} onChange={e => handleChange('cpm_us', e.target.value)} className="theme-input" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>India ($)</label>
                  <input type="number" step="0.1" value={form.cpm_india} onChange={e => handleChange('cpm_india', e.target.value)} className="theme-input" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Europe ($)</label>
                  <input type="number" step="0.1" value={form.cpm_europe} onChange={e => handleChange('cpm_europe', e.target.value)} className="theme-input" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Asia ($)</label>
                  <input type="number" step="0.1" value={form.cpm_asia} onChange={e => handleChange('cpm_asia', e.target.value)} className="theme-input" style={{ width: '100%' }} />
                </div>
              </div>
            </div>

            {/* Sponsorship & Affiliate */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <div style={{ background: 'var(--bg-input)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'var(--chart-2)' }}>
                  <DollarSign size={18} />
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Sponsorship Baseline</h4>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Rate / Follower ($)</label>
                  <input type="number" step="0.001" value={form.sponsorship_rate_per_follower} onChange={e => handleChange('sponsorship_rate_per_follower', e.target.value)} className="theme-input" style={{ width: '100%' }} />
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Scales dynamically with engagement rate</p>
                </div>
              </div>

              <div style={{ background: 'var(--bg-input)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'var(--chart-3)' }}>
                  <Layers size={18} />
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Affiliate Metrics</h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>Link CTR (%)</label>
                    <input type="number" step="0.1" value={form.affiliate_ctr} onChange={e => handleChange('affiliate_ctr', e.target.value)} className="theme-input" style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>Commission Rate (%)</label>
                    <input type="number" step="0.5" value={form.affiliate_commission} onChange={e => handleChange('affiliate_commission', e.target.value)} className="theme-input" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Subscriptions */}
            <div style={{ background: 'var(--bg-input)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'var(--chart-4)' }}>
                <DollarSign size={18} />
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Subscription & Membership Settings</h4>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Monthly Fee ($)</label>
                  <input type="number" step="0.01" value={form.subscription_price} onChange={e => handleChange('subscription_price', e.target.value)} className="theme-input" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Member Conversion (%)</label>
                  <input type="number" step="0.1" value={form.subscription_member_pct} onChange={e => handleChange('subscription_member_pct', e.target.value)} className="theme-input" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Retention Rate (%)</label>
                  <input type="number" step="1" value={form.subscription_retention} onChange={e => handleChange('subscription_retention', e.target.value)} className="theme-input" style={{ width: '100%' }} />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
              <button type="button" onClick={onClose} style={{ padding: '10px 18px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="submit" disabled={saving} className="theme-button-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 22px' }}>
                {saving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                Save Parameters
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RevenueSettingsModal;

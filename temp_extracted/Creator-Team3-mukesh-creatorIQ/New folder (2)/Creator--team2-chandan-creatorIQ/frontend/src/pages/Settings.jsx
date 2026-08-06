import { useEffect, useState } from 'react';
import { Shield, KeyRound, Bell, Palette, Save } from 'lucide-react';
import {
  getAccessToken,
  getProfileSettings,
  updateProfileSettings,
  updateSecuritySettings,
  updateNotificationSettings,
  updateAppearanceSettings,
} from '../lib/api';



function getUserSettingsKey(email) {
  return `creatoriq_settings_${email || 'anonymous'}`;
}

function getJwtSubFromToken(token) {
  // token is a JWT; payload is base64url(JSON)
  try {
    const parts = token.split('.');
    if (parts.length < 2) return '';
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(payload));
    return decoded?.sub || '';
  } catch {
    return '';
  }
}

export default function Settings() {
  const [jwtSub, setJwtSub] = useState('');
  const [saveNotice, setSaveNotice] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Creator IQ User',
    email: 'creator@example.com',
    role: 'creator',
    dateOfBirth: '1998-01-01',
    bio: 'Creator • Analytics enthusiast • Building in public.',
    location: 'Your City',
    website: 'https://creator.example',
  });


  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: '30 minutes',
  });

  const [notifications, setNotifications] = useState({
    productUpdates: true,
    weeklyDigest: true,
  });

  const [theme, setTheme] = useState({
    accent: 'blue',
    density: 'comfortable',
  });

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    const sub = getJwtSubFromToken(token);
    setJwtSub(sub);

    async function loadProfileSettings() {
      try {
        const profileRes = await getProfileSettings();
        setProfile((p) => ({
          ...p,
          name: profileRes?.name || p.name,
          email: profileRes?.email || p.email,
          role: profileRes?.role || p.role,
          bio: profileRes?.bio || p.bio,
          dateOfBirth: profileRes?.dateOfBirth || p.dateOfBirth,
          location: profileRes?.location || p.location,
          website: profileRes?.website || p.website,
        }));
      } catch {
        // ignore - keep defaults
      } finally {
        setProfileLoaded(true);
      }
    }

    loadProfileSettings();
  }, []);


async function saveAll() {
    setSaveLoading(true);
    setSaveNotice('');

    try {
      // Map UI state -> backend payloads
      await updateProfileSettings({
        bio: profile.bio,
        dateOfBirth: profile.dateOfBirth,
        location: profile.location,
        website: profile.website,
        role: profile.role,
      });

      await updateSecuritySettings({
        twoFactor: security.twoFactor,
        sessionTimeout: security.sessionTimeout,
      });

      await updateNotificationSettings({
        productUpdates: notifications.productUpdates,
        weeklyDigest: notifications.weeklyDigest,
      });

      await updateAppearanceSettings({
        accent: theme.accent,
        density: theme.density,
      });

      setSaveNotice('Saved successfully');

      const profileRes = await getProfileSettings();
      setProfile((p) => ({
        ...p,
        name: profileRes?.name || p.name,
        email: profileRes?.email || p.email,
        role: profileRes?.role || p.role,
        bio: profileRes?.bio || p.bio,
        dateOfBirth: profileRes?.dateOfBirth || p.dateOfBirth,
        location: profileRes?.location || p.location,
        website: profileRes?.website || p.website,
      }));
    } catch (err) {
      const message = err?.response?.data?.detail || 'Failed to save settings.';
      setSaveNotice(message);
    } finally {
      setSaveLoading(false);
    }
  }



  const accentToClasses = {
    blue: { accent: 'text-blue-400', ring: 'focus:ring-blue-500' },
    purple: { accent: 'text-purple-400', ring: 'focus:ring-purple-500' },
    emerald: { accent: 'text-emerald-400', ring: 'focus:ring-emerald-500' },
  };

  const accent = accentToClasses[theme.accent] || accentToClasses.blue;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">Settings</h1>
        <p className="text-muted mt-1">Profile, security, notifications, and appearance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile */}
          <section className="rounded-2xl border border-slate-700/50 bg-surface p-6">
            <div className="mb-5 rounded-xl border border-slate-700/50 bg-slate-900/20 p-4">
              <div className="text-sm text-muted mb-1">Profile preview</div>
              <div className="text-text font-semibold">@{String(profile.name || '').split(' ')[0] || 'creator'}</div>
            </div>

            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-text">Profile</h2>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted mb-2">Full Name</label>
                <input
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  className={`w-full rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-text focus:outline-none focus:ring-2 ${accent.ring}`}
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-2">Email</label>
                <input
                  value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  className={`w-full rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-text focus:outline-none focus:ring-2 ${accent.ring}`}
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => setProfile((p) => ({ ...p, dateOfBirth: e.target.value }))}
                  className={`w-full rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-text focus:outline-none focus:ring-2 ${accent.ring}`}
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-2">Location</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span aria-hidden="true" className="text-slate-500">📍</span>
                  </div>
                  <input
                    value={profile.location}
                    onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
                    className={`w-full rounded-xl border border-slate-700/60 bg-slate-800/40 pl-10 pr-3 py-2 text-text focus:outline-none focus:ring-2 ${accent.ring}`}
                    placeholder="e.g. Bengaluru"
                  />
                </div>
              </div>


              <div className="md:col-span-2">
                <label className="block text-sm text-muted mb-2">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                  rows={4}
                  className={`w-full resize-none rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-text focus:outline-none focus:ring-2 ${accent.ring}`}
                  placeholder="Tell people what you create and why..."
                />
                <div className="mt-2 text-xs text-muted">
                  Tip: Add your niche + what you’re building.
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted mb-2">Role</label>
                <select
                  value={profile.role}
                  onChange={(e) => setProfile((p) => ({ ...p, role: e.target.value }))}
                  className={`w-full rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-text focus:outline-none focus:ring-2 ${accent.ring}`}
                >
                  <option value="creator">Creator</option>
                  <option value="agency">Agency</option>
                  <option value="marketing_team">Marketing Team</option>
                  <option value="administrator">Administrator</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-muted mb-2">Website</label>
                <input
                  value={profile.website}
                  onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))}
                  className={`w-full rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-text focus:outline-none focus:ring-2 ${accent.ring}`}
                  placeholder="https://your-site.com"
                />
              </div>
            </div>

          </section>

          {/* Security */}
          <section className="rounded-2xl border border-slate-700/50 bg-surface p-6">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-text">Security</h2>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-slate-700/50 bg-slate-900/20 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-text">Two-factor authentication</p>
                    <p className="text-sm text-muted mt-1">
                      Add extra verification with OTP, biometrics, and security keys.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={security.twoFactor}
                    onChange={(e) => setSecurity((s) => ({ ...s, twoFactor: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-800/50 text-primary focus:ring-primary mt-1"
                  />
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-lg border border-slate-700/50 bg-surface/40 p-3">
                    <p className="text-xs font-semibold text-text">OTP (Authenticator / SMS)</p>
                    <p className="text-xs text-muted mt-1">Receive a time-based code at login.</p>
                  </div>
                  <div className="rounded-lg border border-slate-700/50 bg-surface/40 p-3">
                    <p className="text-xs font-semibold text-text">Fingerprint</p>
                    <p className="text-xs text-muted mt-1">Quick verify on supported devices.</p>
                  </div>
                  <div className="rounded-lg border border-slate-700/50 bg-surface/40 p-3">
                    <p className="text-xs font-semibold text-text">Face recognition</p>
                    <p className="text-xs text-muted mt-1">Use Face ID for sign-in.</p>
                  </div>
                  <div className="rounded-lg border border-slate-700/50 bg-surface/40 p-3">
                    <p className="text-xs font-semibold text-text">Security key</p>
                    <p className="text-xs text-muted mt-1">Hardware-backed protection.</p>
                  </div>
                </div>
              </div>


              <div className="rounded-xl border border-slate-700/50 bg-slate-900/20 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-text">Session timeout</p>
                    <p className="text-sm text-muted mt-1">Controls how long your session stays active.</p>
                  </div>
                  <span className="text-xs text-muted">Logged in</span>
                </div>
                <select
                  value={security.sessionTimeout}
                  onChange={(e) => setSecurity((s) => ({ ...s, sessionTimeout: e.target.value }))}
                  className={`mt-3 w-full rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-text focus:outline-none focus:ring-2 ${accent.ring}`}
                >
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>2 hours</option>
                </select>
              </div>

              {/* Change password */}
              <div className="rounded-xl border border-slate-700/50 bg-slate-900/20 p-4">
                <p className="text-sm font-semibold text-text">Password</p>
                <p className="text-sm text-muted mt-1">Update your password anytime.</p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-muted mb-2">Current password</label>
                    <input
                      type="password"
                      className={`w-full rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-text focus:outline-none focus:ring-2 ${accent.ring}`}
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-2">New password</label>
                    <input
                      type="password"
                      className={`w-full rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-text focus:outline-none focus:ring-2 ${accent.ring}`}
                      placeholder="At least 6 characters"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    // UI-only (backend change not implemented yet)
                    // eslint-disable-next-line no-alert
                    alert('Change password UI updated. Wire to backend next.');
                  }}
                  className="mt-4 w-full rounded-xl bg-primary/10 border border-primary/30 px-4 py-3 text-text font-semibold hover:bg-primary/15 transition-colors"
                >
                  Update password
                </button>
              </div>

            </div>
          </section>

          {/* Notifications */}
          <section className="rounded-2xl border border-slate-700/50 bg-surface p-6">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-pink-400" />
              <h2 className="text-xl font-bold text-text">Notifications</h2>
            </div>

            <div className="mt-5 space-y-4">
              <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-700/50 bg-slate-900/20 p-4">
                <div>
                  <p className="text-sm font-semibold text-text">Product updates</p>
                  <p className="text-sm text-muted mt-1">New features and improvements.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.productUpdates}
                  onChange={(e) => setNotifications((n) => ({ ...n, productUpdates: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-800/50 text-primary focus:ring-primary"
                />
              </label>

              <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-700/50 bg-slate-900/20 p-4">
                <div>
                  <p className="text-sm font-semibold text-text">Weekly digest</p>
                  <p className="text-sm text-muted mt-1">A summary of your analytics.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.weeklyDigest}
                  onChange={(e) => setNotifications((n) => ({ ...n, weeklyDigest: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-800/50 text-primary focus:ring-primary"
                />
              </label>
            </div>
          </section>
        </div>

        {/* Theme */}
        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-700/50 bg-surface p-6">
            <div className="flex items-center gap-3">
              <KeyRound className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-text">Appearance</h2>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-sm text-muted mb-2">Accent color</p>
                <select
                  value={theme.accent}
                  onChange={(e) => setTheme((t) => ({ ...t, accent: e.target.value }))}
                  className={`w-full rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-text focus:outline-none focus:ring-2 ${accent.ring}`}
                >
                  <option value="blue">Blue</option>
                  <option value="purple">Purple</option>
                  <option value="emerald">Emerald</option>
                </select>
              </div>

              <div>
                <p className="text-sm text-muted mb-2">Density</p>
                <select
                  value={theme.density}
                  onChange={(e) => setTheme((t) => ({ ...t, density: e.target.value }))}
                  className={`w-full rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-text focus:outline-none focus:ring-2 ${accent.ring}`}
                >
                  <option value="comfortable">Comfortable</option>
                  <option value="compact">Compact</option>
                </select>
              </div>

              <p className={`text-sm ${accent.accent}`}>Preview accent applied in focus rings (UI demo).</p>
            </div>
          </section>

          <button
            onClick={saveAll}
            disabled={saveLoading}
            className="w-full rounded-2xl bg-primary/10 border border-primary/30 px-5 py-4 text-text font-semibold hover:bg-primary/15 transition-colors disabled:opacity-60"
          >
            <span className="flex items-center justify-center gap-2">
              <Save className="w-5 h-5" />
              {saveLoading ? 'Saving...' : 'Save changes'}
            </span>
          </button>

          {saveNotice ? (
            <div className="rounded-xl border border-emerald-500/50 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {saveNotice}
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}


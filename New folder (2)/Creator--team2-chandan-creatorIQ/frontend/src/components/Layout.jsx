import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react';

import { applyThemeToDocument, getThemePreference, setThemePreference } from '../lib/theme';
import { useAuthContext } from '../context/AuthContext';
import { canAccessRole } from '../lib/role';






export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, logout } = useAuthContext();

  // Apply theme once on load.

  // This keeps light/dark responsive across pages.
  if (typeof document !== 'undefined') {
    const current = getThemePreference();
    applyThemeToDocument(current);
  }

  const role = user?.role;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, allowed: ['creator', 'agency', 'marketing_team', 'administrator', 'member'] },
    { name: 'Content', path: '/content', icon: LayoutDashboard, allowed: ['creator', 'agency', 'marketing_team', 'administrator', 'member'] },
    { name: 'Team', path: '/team', icon: Users, allowed: ['creator'] },
    { name: 'Audience', path: '/audience', icon: Users, allowed: ['creator', 'agency', 'marketing_team', 'administrator', 'member'] },
    { name: 'Settings', path: '/settings', icon: Settings, allowed: ['creator', 'agency', 'marketing_team', 'administrator', 'member'] },
  ].filter((i) => canAccessRole(role, i.allowed));


  function onLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  function toggleTheme() {
    const next = getThemePreference() === 'dark' ? 'light' : 'dark';
    setThemePreference(next);
    applyThemeToDocument(next);
  }


  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            <Link
              to="/dashboard"
              className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
              Creator IQ
            </Link>

            <nav className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleTheme}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-muted hover:bg-slate-800/50 hover:text-text transition-colors"
                aria-label="Toggle theme"
              >
                <span className="text-sm">{getThemePreference() === 'dark' ? 'Light' : 'Dark'}</span>
              </button>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted hover:bg-slate-800/50 hover:text-text'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-primary' : ''} />
                    <span className="hidden sm:inline">{item.name}</span>
                  </Link>
                );
              })}

              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-muted hover:text-red-400 transition-colors hover:bg-red-400/10"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}


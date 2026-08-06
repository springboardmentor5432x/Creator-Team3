import React, { useState } from 'react';
import AuthPage from './components/auth/AuthPage';
import OAuthCallback from './components/auth/OAuthCallback';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import HyperUIBackground from './components/hyper/HyperUIBackground';
import HyperCursor from './components/hyper/HyperCursor';
import './App.css';

function AppContent() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const { isHyperUI } = useTheme();

  const handleAuthSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
  };

  return (
    <div className="app-theme-wrapper" style={{ minHeight: '100vh', backgroundColor: isHyperUI ? 'transparent' : 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {isHyperUI && <HyperUIBackground />}
      {isHyperUI && <HyperCursor />}
      {window.location.pathname === '/oauth/callback' ? (
        <OAuthCallback />
      ) : token ? (
        <AnalyticsDashboard 
          token={token} 
          onLogout={handleLogout} 
          onAuthUpdate={handleAuthSuccess}
        />
      ) : (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

function App() {
  const token = localStorage.getItem('token');
  return (
    <ThemeProvider token={token}>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

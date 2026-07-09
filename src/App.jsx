import React, { useState, useEffect } from 'react';
import AuthPage from './components/auth/AuthPage';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('creatoriq_token'));
  const [theme, setTheme] = useState(localStorage.getItem('creatoriq_theme') || 'midnight');

  const handleAuthSuccess = (newToken) => {
    localStorage.setItem('creatoriq_token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('creatoriq_token');
    setToken(null);
  };

  const handleThemeChange = (newTheme) => {
    localStorage.setItem('creatoriq_theme', newTheme);
    setTheme(newTheme);
  };

  return (
    <div className="app-theme-wrapper" data-theme={theme} style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {token ? (
        <AnalyticsDashboard 
          token={token} 
          onLogout={handleLogout} 
          onAuthUpdate={handleAuthSuccess}
          currentTheme={theme}
          onThemeChange={handleThemeChange}
        />
      ) : (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

export default App;



import React, { useState } from 'react';
import AuthPage from './components/auth/AuthPage';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function AppContent() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleAuthSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
  };

  return (
    <div className="app-theme-wrapper" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {token ? (
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

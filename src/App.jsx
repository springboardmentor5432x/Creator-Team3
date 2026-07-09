import React, { useState, useEffect } from 'react';
import AuthPage from './components/auth/AuthPage';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('creatoriq_token'));

  const handleAuthSuccess = (newToken) => {
    localStorage.setItem('creatoriq_token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('creatoriq_token');
    setToken(null);
  };

  return (
    <>
      {token ? (
        <AnalyticsDashboard token={token} onLogout={handleLogout} onAuthUpdate={handleAuthSuccess} />
      ) : (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      )}
    </>
  );
}

export default App;



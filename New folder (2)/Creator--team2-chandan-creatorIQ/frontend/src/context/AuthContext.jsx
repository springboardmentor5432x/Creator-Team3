import { createContext, useContext, useEffect, useState } from 'react';
import { clearAccessToken, getProfile, getAccessToken } from '../lib/api';

const AuthContext = createContext({
  user: null,
  loading: true,
  setUser: () => {},
  refreshUser: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      const token = getAccessToken();
      if (!token) {
        if (!cancelled) {
          setUserState(null);
          setLoading(false);
          localStorage.removeItem('auth_user');
        }
        return;
      }

      try {
        const profile = await getProfile();
        if (!cancelled) {
          setUserState(profile);
          localStorage.setItem('auth_user', JSON.stringify(profile));
        }
      } catch {
        if (!cancelled) {
          clearAccessToken();
          setUserState(null);
          localStorage.removeItem('auth_user');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadUser();
    return () => {
      cancelled = true;
    };
  }, []);

  const setUser = (profile) => {
    if (profile) {
      setUserState(profile);
      localStorage.setItem('auth_user', JSON.stringify(profile));
    } else {
      setUserState(null);
      localStorage.removeItem('auth_user');
    }
  };

  const refreshUser = async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      return null;
    }

    try {
      const profile = await getProfile();
      setUser(profile);
      return profile;
    } catch {
      clearAccessToken();
      setUser(null);
      return null;
    }
  };

  const logout = () => {
    clearAccessToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  const isLoggedIn = !!token;

  // Če imamo token, ampak nimamo userja, ga pridobi iz /auth/me
  useEffect(() => {
    (async () => {
      if (!token) return;

      try {
        const u = await authApi.me();
        setUser(u);
        localStorage.setItem('user', JSON.stringify(u));
      } catch {
        // če token ni veljaven, logout
        authApi.logout();
        setToken(null);
        setUser(null);
      }
    })();
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      isLoggedIn,
      login: async (email, password) => {
        const t = await authApi.login(email, password);
        setToken(t);

        // takoj po loginu dobi userja
        const u = await authApi.me();
        setUser(u);
        localStorage.setItem('user', JSON.stringify(u));
      },
      logout: () => {
        authApi.logout();
        setToken(null);
        setUser(null);
      },
    }),
    [token, user, isLoggedIn],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

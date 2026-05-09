import { createContext, useContext, useMemo, useState } from 'react';
import { adminConfig } from '../data/config';
import { clearAuthSession, getAuthSession, setAuthSession } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getAuthSession());

  function login(username, password) {
    if (username === adminConfig.username && password === adminConfig.password) {
      const nextSession = {
        username,
        role: 'admin',
        authenticatedAt: new Date().toISOString(),
      };
      setAuthSession(nextSession);
      setSession(nextSession);
      return true;
    }
    return false;
  }

  function logout() {
    clearAuthSession();
    setSession(null);
  }

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      login,
      logout,
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

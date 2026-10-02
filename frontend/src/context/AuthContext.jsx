import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, tokenStorage } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      if (!tokenStorage.getAccess() && !tokenStorage.getRefresh()) {
        setLoading(false);
        return;
      }
      try {
        const profile = await authAPI.getProfile();
        tokenStorage.save({ user: profile });
        setUser(profile);
      } catch {
        tokenStorage.clear();
      } finally {
        setLoading(false);
      }
    };
    restore();
    const handleUnauthorized = () => { tokenStorage.clear(); setUser(null); };
    window.addEventListener('invisibleaid:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('invisibleaid:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    tokenStorage.save(response);
    setUser(response.user);
    return response.user;
  };

  const register = data => authAPI.register(data);

  const logout = async () => {
    const refresh = tokenStorage.getRefresh();
    try { if (refresh) await authAPI.logout(refresh); } finally {
      tokenStorage.clear();
      setUser(null);
    }
  };

  const isAdmin = user?.role?.toUpperCase() === 'ADMIN';
  const isSchool = user?.role?.toUpperCase() === 'SCHOOL';
  const isNGO = user?.role?.toUpperCase() === 'NGO';

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, isAdmin, isSchool, isNGO }}>
      {children}
    </AuthContext.Provider>
  );
};

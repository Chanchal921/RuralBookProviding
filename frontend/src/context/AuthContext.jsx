import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ruraledu_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ruraledu_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('ruraledu_token');
      if (storedToken) {
        try {
          const res = await authApi.getCurrentUser();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('ruraledu_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Session verification failed, clearing auth');
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.success && res.data) {
      const { token, id, fullName, email: userEmail, role, organizationName } = res.data;
      const userData = { id, fullName, email: userEmail, role, organizationName };

      setToken(token);
      setUser(userData);
      localStorage.setItem('ruraledu_token', token);
      localStorage.setItem('ruraledu_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (formData) => {
    const res = await authApi.register(formData);
    return res;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ruraledu_token');
    localStorage.removeItem('ruraledu_user');
  };

  const isAuthenticated = !!token && !!user;
  const role = user?.role;
  const isAdmin = role === 'ADMIN';
  const isDonor = role === 'DONOR';
  const isTeacher = role === 'TEACHER';
  const isStudent = role === 'STUDENT';
  const isNgo = role === 'NGO';

  const canUpload = isAdmin || isDonor || isTeacher || isNgo;
  const canRequest = isAdmin || isStudent || isTeacher || isNgo;

  const value = {
    user,
    token,
    loading,
    role,
    isAuthenticated,
    isAdmin,
    isDonor,
    isTeacher,
    isStudent,
    isNgo,
    canUpload,
    canRequest,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


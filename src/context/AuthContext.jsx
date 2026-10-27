import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { ROLES } from '../utils/constants';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('Auth initialization error', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    setUser(res.user);
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    setUser(res.user);
    return res;
  };

  const switchRole = async (role) => {
    const switchedUser = await authService.quickSwitchRole(role);
    setUser(switchedUser);
    return switchedUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    switchRole,
    isAuthenticated: Boolean(user),
    role: user?.role || ROLES.GUEST,
    isAdmin: user?.role === ROLES.ADMIN,
    isManager: user?.role === ROLES.MANAGER || user?.role === ROLES.ADMIN,
    isDispatcher: user?.role === ROLES.DISPATCHER || user?.role === ROLES.MANAGER || user?.role === ROLES.ADMIN,
    isDriver: user?.role === ROLES.DRIVER
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

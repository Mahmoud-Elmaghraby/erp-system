import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../../core/api/axios.config';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  companyId: string;
  branchId: string | null;
  roles?: string[];
  permissions?: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'erp_user';
const TOKEN_KEY = 'access_token';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // ✅ عند كل startup يجيب أحدث بيانات من الـ Backend
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      refreshUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (token: string, userData: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // مش مشكلة لو فشل الـ logout request
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      const userData: AuthUser = res.data.data;
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
    }
  };

  // ✅ helper بيتحقق من الـ permissions
  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) ?? false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';

export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  phone: string;
  city: string;
  role: 'user' | 'admin' | 'USER' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: Omit<User, 'id' | 'role'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hb_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('hb_user', JSON.stringify(user));
    else localStorage.removeItem('hb_user');
  }, [user]);

  useEffect(() => {
    const jwt = localStorage.getItem('hb_jwt');
    if (jwt && !user) {
      userService.getProfile()
        .then(profile => {
          setUser({
            id: String(profile.id ?? ''),
            email: profile.email ?? '',
            username: profile.username ?? profile.name ?? '',
            name: profile.name,
            phone: profile.phone ?? '',
            city: profile.city ?? '',
            role: (profile.role?.toLowerCase() ?? 'user') as User['role'],
          });
        })
        .catch(() => localStorage.removeItem('hb_jwt'));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await authService.login({ email, password });
      try {
        const profile = await userService.getProfile();
        setUser({
          id: String(profile.id ?? ''),
          email: profile.email ?? email,
          username: profile.username ?? profile.name ?? '',
          name: profile.name,
          phone: profile.phone ?? '',
          city: profile.city ?? '',
          role: (profile.role?.toLowerCase() ?? 'user') as User['role'],
        });
      } catch {
        const u = result.user;
        setUser({
          id: String(u?.id ?? ''),
          email: u?.email ?? email,
          username: u?.username ?? u?.name ?? '',
          phone: u?.phone ?? '',
          city: u?.city ?? '',
          role: (u?.role?.toLowerCase() ?? 'user') as User['role'],
        });
      }
      return true;
    } catch (err: any) {
      console.error('Login failed:', err?.response?.data ?? err.message);
      return false;
    }
  };

  const signup = async (data: Omit<User, 'id' | 'role'> & { password: string }): Promise<boolean> => {
    try {
      await authService.signup({
        name: data.username,
        email: data.email,
        password: data.password,
        role: 'USER',
        preferredLanguage: 'Hindi',
      });
      return await login(data.email, data.password);
    } catch (err: any) {
      console.error('Signup failed:', err?.response?.data ?? err.message);
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    userService.updateProfile({
      username: updated.username,
      phone: updated.phone,
      city: updated.city,
    }).catch(console.error);
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

export function getActivityLogs() {
  return JSON.parse(localStorage.getItem('hb_activity') || '[]') as { userId: string; action: string; timestamp: string }[];
}
export function getAllUsers(): User[] {
  return [];
}

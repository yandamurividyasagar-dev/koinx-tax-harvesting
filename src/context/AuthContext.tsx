import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS_KEY = 'koinx_users';
const SESSION_KEY = 'koinx_session';

const getStoredUsers = (): Record<string, { password: string; user: User }> => {
  try {
    const raw = localStorage.getItem(MOCK_USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const storeUser = (email: string, password: string, user: User) => {
  const users = getStoredUsers();
  users[email] = { password, user };
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

const storeSession = (user: User) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

const getSession = (): User | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(() => {
    const user = getSession();
    return { user, isAuthenticated: !!user, isLoading: false };
  });

  const login = useCallback(async (email: string, password: string) => {
    setState(s => ({ ...s, isLoading: true }));
    await new Promise(r => setTimeout(r, 800));
    const users = getStoredUsers();
    const record = users[email.toLowerCase()];
    if (!record) {
      setState(s => ({ ...s, isLoading: false }));
      return { success: false, error: 'No account found with this email.' };
    }
    if (record.password !== password) {
      setState(s => ({ ...s, isLoading: false }));
      return { success: false, error: 'Incorrect password.' };
    }
    storeSession(record.user);
    setState({ user: record.user, isAuthenticated: true, isLoading: false });
    return { success: true };
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setState(s => ({ ...s, isLoading: true }));
    await new Promise(r => setTimeout(r, 900));
    const users = getStoredUsers();
    if (users[email.toLowerCase()]) {
      setState(s => ({ ...s, isLoading: false }));
      return { success: false, error: 'An account with this email already exists.' };
    }
    const user: User = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase(),
    };
    storeUser(email.toLowerCase(), password, user);
    storeSession(user);
    setState({ user, isAuthenticated: true, isLoading: false });
    return { success: true };
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setState(s => ({ ...s, isLoading: true }));
    await new Promise(r => setTimeout(r, 1200));
    const user: User = {
      id: `google_${Date.now()}`,
      name: 'Demo User',
      email: 'demo@koinx.com',
      avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=3B82F6&color=fff',
    };
    storeSession(user);
    setState({ user, isAuthenticated: true, isLoading: false });
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

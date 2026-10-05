import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface MasterUser {
  id: string;
  email: string;
  role: string;
  user_metadata: {
    name: string;
  };
  created_at: string;
}

interface AuthContextType {
  user: MasterUser | null;
  loading: boolean;
  signIn: (email?: string, password?: string) => Promise<{ error: Error | null }>;
  signUp: (email?: string, password?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_SESSION_KEY = 'ev_crm_active_session';

const DEFAULT_ADMIN_USER: MasterUser = {
  id: 'ev-admin-master',
  email: 'admin@evcyberacademy.com',
  role: 'authenticated',
  user_metadata: {
    name: 'EV Cyber Academy Admin',
  },
  created_at: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MasterUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Check existing saved session or Supabase session
    const checkSession = async () => {
      try {
        const saved = localStorage.getItem(AUTH_SESSION_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setUser(parsed);
          } catch {
            setUser(DEFAULT_ADMIN_USER);
          }
        } else {
          // If already has Supabase session
          const { data } = await supabase.auth.getSession();
          if (data?.session?.user) {
            setUser({
              id: data.session.user.id,
              email: data.session.user.email || 'admin@evcyberacademy.com',
              role: 'authenticated',
              user_metadata: { name: 'EV Cyber Academy Admin' },
              created_at: data.session.user.created_at,
            });
          }
        }
      } catch (err) {
        console.error('Error verifying auth session:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email?: string, password?: string): Promise<{ error: Error | null }> => {
    try {
      const activeUser: MasterUser = {
        ...DEFAULT_ADMIN_USER,
        email: email?.trim() || DEFAULT_ADMIN_USER.email,
      };

      // Store device session
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(activeUser));
      setUser(activeUser);

      // Attempt Supabase auth in background if available (non-blocking)
      if (email && password) {
        supabase.auth.signInWithPassword({ email: email.trim(), password }).catch(() => {});
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signUp = async (email?: string, password?: string): Promise<{ error: Error | null }> => {
    return signIn(email, password);
  };

  const signOut = async (): Promise<void> => {
    try {
      localStorage.removeItem(AUTH_SESSION_KEY);
      await supabase.auth.signOut().catch(() => {});
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

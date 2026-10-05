import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isMockMode: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER_STORAGE_KEY = 'ev_crm_mock_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isMockMode = !isSupabaseConfigured();

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // Mock mode: check local storage for demo session
      const savedMockUser = localStorage.getItem(MOCK_USER_STORAGE_KEY);
      if (savedMockUser) {
        try {
          const parsed = JSON.parse(savedMockUser);
          setUser(parsed);
        } catch {
          localStorage.removeItem(MOCK_USER_STORAGE_KEY);
        }
      }
      setLoading(false);
      return;
    }

    // Real Supabase Auth mode
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (err) {
        console.error('Error checking Supabase auth session:', err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    if (!isSupabaseConfigured()) {
      // Mock authentication
      if (email && password.length >= 6) {
        const mockUser: any = {
          id: 'mock-user-admin-01',
          email: email.trim(),
          role: 'authenticated',
          app_metadata: { provider: 'email' },
          user_metadata: { name: 'EV Cyber Academy Admin' },
          created_at: new Date().toISOString(),
        };
        localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(mockUser));
        setUser(mockUser);
        return { error: null };
      } else {
        return { error: new Error('Please provide a valid email and password (minimum 6 characters)') };
      }
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string): Promise<{ error: Error | null }> => {
    if (!isSupabaseConfigured()) {
      return signIn(email, password);
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signOut = async (): Promise<void> => {
    if (!isSupabaseConfigured()) {
      localStorage.removeItem(MOCK_USER_STORAGE_KEY);
      setUser(null);
      return;
    }

    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      setUser(null);
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isMockMode,
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

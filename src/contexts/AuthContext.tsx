import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, User } from '@/lib/supabase';
import { authApi } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithLinkedIn: () => Promise<void>;
  signInWithPhone: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, token: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        await refreshUser();
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        await refreshUser();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await authApi.signIn(email, password);
    await refreshUser();
  };

  const signInWithGoogle = async () => {
    await authApi.signInWithGoogle();
    // Note: Google OAuth redirect will handle the rest
  };

  const signInWithFacebook = async () => {
    await authApi.signInWithFacebook();
  };

  const signInWithLinkedIn = async () => {
    await authApi.signInWithLinkedIn();
  };

  const signInWithPhone = async (phone: string) => {
    await authApi.signInWithPhone(phone);
  };

  const verifyOTP = async (phone: string, token: string) => {
    await authApi.verifyOTP(phone, token);
    await refreshUser();
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    await authApi.signUp(email, password, fullName);
    await refreshUser();
  };

  const signOut = async () => {
    await authApi.signOut();
    setUser(null);
    setSupabaseUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        loading,
        signIn,
        signInWithGoogle,
        signInWithFacebook,
        signInWithLinkedIn,
        signInWithPhone,
        verifyOTP,
        signUp,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
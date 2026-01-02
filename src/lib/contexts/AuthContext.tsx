import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, onAuthStateChange } from '../supabase';
import type { Profile, BrandProfile } from '../database.types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  brandProfile: BrandProfile | null;
  loading: boolean;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
  refreshBrandProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (!error && data) {
      setProfile(data as Profile);
    }
  };

  const fetchBrandProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('brand_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (!error && data) {
      setBrandProfile(data as BrandProfile);
    } else {
      setBrandProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const refreshBrandProfile = async () => {
    if (user) {
      await fetchBrandProfile(user.id);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        fetchProfile(currentUser.id);
        fetchBrandProfile(currentUser.id);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        fetchProfile(currentUser.id);
        fetchBrandProfile(currentUser.id);
      } else {
        setProfile(null);
        setBrandProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        brandProfile,
        loading,
        isAdmin,
        refreshProfile,
        refreshBrandProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


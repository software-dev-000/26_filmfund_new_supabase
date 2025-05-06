import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';

export type UserType = 'superadmin' | 'admin' | 'filmmaker' | 'investor';

interface AuthContextType {
  currentUser: User | null;
  userType: UserType | null;
  signup: (email: string, password: string, firstName: string, lastName: string, userType: UserType, avatarUrl: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (firstName: string, lastName: string, avatarUrl: string, currentPwd: string, newPwd?: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      if (session?.user) {
        // Get user type from user metadata
        const userType = session.user.user_metadata.user_type as UserType;
        setUserType(userType);
      }
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
      if (session?.user) {
        // Get user type from user metadata
        const userType = session.user.user_metadata.user_type as UserType;
        setUserType(userType);
      } else {
        setUserType(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signup = async (email: string, password: string, firstName: string, lastName: string, userType: UserType, avatarUrl: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          user_type: userType,
          avatar_url: avatarUrl,
        },
      },
    });

    if (error) throw error;
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const updateProfile = async (
    firstName: string,
    lastName: string,
    avatarUrl: string,
    currentPwd: string,
    newPwd?: string,
  ) => {
    if (!currentUser) throw new Error('Not authenticated');

    // 1. Re-authenticate user for security
    if(currentPwd !== '' || newPwd !== '') {
      console.log(`updating password for ${currentUser.email}, currentPwd: ${currentPwd}, newPwd: ${newPwd}`)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: currentUser.email!!,
        password: currentPwd,
      });
      if (signInError) throw new Error('Current password is incorrect.');
      console.log(`signInError: ${signInError}`)
      const { error: updatePasswordError } = await supabase.auth.updateUser({
        password: newPwd,
        data: {
          first_name: firstName,
          last_name: lastName,
          avatar_url: avatarUrl,
        },
      });
      if (updatePasswordError) throw updatePasswordError;
    } else {
      console.log(`updating user for ${currentUser.email}, firstName: ${firstName}, lastName: ${lastName}`)
      const { error: updateUserError } = await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName,
          avatar_url: avatarUrl,
        },
      });
      if (updateUserError) throw updateUserError;
    }
  };

  

  const value = {
    currentUser,
    userType,
    signup,
    login,
    logout,
    resetPassword,
    updateProfile,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 
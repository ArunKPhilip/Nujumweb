import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState, AccessibilityMode, ThemeMode } from '../types';
import { supabase } from '../lib/supabase';

// Auth Action Types
type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOG_OUT' }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'ar' }
  | { type: 'SET_ACCESSIBILITY_MODE'; payload: AccessibilityMode }
  | { type: 'SET_THEME_MODE'; payload: ThemeMode }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

// Auth Context Type
interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Omit<User, 'id' | 'isVerified' | 'verificationStatus' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  logout: () => Promise<void>;
  setLanguage: (language: 'en' | 'ar') => void;
  setAccessibilityMode: (mode: AccessibilityMode) => void;
  setThemeMode: (theme: ThemeMode) => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

// Initial State
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  language: 'en',
  accessibilityMode: 'standard',
  themeMode: 'light',
};

// Reducer Function
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case 'LOG_OUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
      };
    case 'SET_ACCESSIBILITY_MODE':
      return {
        ...state,
        accessibilityMode: action.payload,
      };
    case 'SET_THEME_MODE':
      return {
        ...state,
        themeMode: action.payload,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Helper function to load user profile from database
  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        return;
      }

      if (profile) {
        const user: User = {
          id: profile.id,
          username: profile.username,
          fullName: profile.full_name,
          email: profile.email,
          phone: profile.phone || '',
          profilePicture: profile.profile_picture || '',
          disabilityType: profile.disability_type as any,
          countryOfResidence: profile.country_of_residence,
          nationality: profile.nationality || '',
          gender: profile.gender || '',
          dateOfBirth: profile.date_of_birth || '',
          isVerified: profile.is_verified,
          verificationStatus: profile.verification_status as any,
          createdAt: profile.created_at,
          updatedAt: profile.updated_at,
          bio: profile.bio || '',
          bloodGroup: profile.blood_group || '',
          emergencyContact: profile.emergency_contact || '',
        };
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  // Load user preferences from localStorage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('nujjum_language') as 'en' | 'ar';
    const storedAccessibilityMode = localStorage.getItem('nujjum_accessibility_mode') as AccessibilityMode;
    const storedThemeMode = localStorage.getItem('nujjum_theme_mode') as ThemeMode;

    if (storedLanguage) {
      dispatch({ type: 'SET_LANGUAGE', payload: storedLanguage });
    }

    if (storedAccessibilityMode) {
      dispatch({ type: 'SET_ACCESSIBILITY_MODE', payload: storedAccessibilityMode });
    }

    if (storedThemeMode === 'light' || storedThemeMode === 'dark') {
      dispatch({ type: 'SET_THEME_MODE', payload: storedThemeMode });
    }
  }, []);

  // Handle Supabase auth state changes
  useEffect(() => {
    // Get initial user
    const initializeAuth = async () => {
      // @ts-ignore
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user && !error) {
        loadUserProfile(user.id);
      }
    };
    initializeAuth();

    // Listen for auth changes
    // @ts-ignore
    const {
      // @ts-ignore
      data: { subscription },
      // @ts-ignore
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: 'LOG_OUT' });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Save state changes to localStorage
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('nujjum_user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('nujjum_user');
    }
  }, [state.user]);

  useEffect(() => {
    localStorage.setItem('nujjum_language', state.language);
  }, [state.language]);

  useEffect(() => {
    localStorage.setItem('nujjum_accessibility_mode', state.accessibilityMode);
  }, [state.accessibilityMode]);

  useEffect(() => {
    localStorage.setItem('nujjum_theme_mode', state.themeMode);
  }, [state.themeMode]);

  // Auth functions with Supabase integration
  const login = async (email: string, password: string): Promise<void> => {
    try {
      // @ts-ignore
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Auth state change will handle loading user profile
      // No need to manually call loadUserProfile here
    } catch (error: any) {
      throw new Error(error.message || 'Login failed. Please try again.');
    }
  };

  // Helper function to map disability display names to database enum values
  const mapDisabilityType = (displayType: string): string => {
    const mapping: Record<string, string> = {
      'Physical Disability': 'physical',
      'Visual Impairment': 'visual',
      'Hearing Impairment': 'hearing',
      'Cognitive Disability': 'cognitive',
      'Communication Disability': 'speech',
      'Autism Spectrum Disorder': 'multiple',
      'Mental Health Conditions': 'cognitive',
      'Chronic Illness': 'other',
      'Mobility Impairment': 'physical',
      'Other': 'other',
    };
    return mapping[displayType] || 'other';
  };

  const signup = async (userData: any): Promise<void> => {
    try {
      // Validate required fields
      if (!userData.email || !userData.password || !userData.username) {
        throw new Error('Email, password, and username are required');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate password strength
      if (userData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Validate username format
      if (!/^[a-zA-Z0-9_-]+$/.test(userData.username)) {
        throw new Error('Username can only contain letters, numbers, underscores, and hyphens');
      }

      console.log('Signing up with data:', userData);

      // Sign up with Supabase Auth
      // @ts-ignore
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Signup failed. Please try again.');
      }

      // Map disability type to database enum value
      const disabilityTypeMapped = mapDisabilityType(userData.disabilityType || 'Other');

      // Update the user profile in the users table (created by trigger)
      const { error: profileError } = await supabase
        .from('users')
        .update({
          username: userData.username,
          full_name: userData.fullName || '',
          phone: userData.phone || null,
          profile_picture: userData.profilePicture || null,
          disability_type: disabilityTypeMapped,
          country_of_residence: userData.countryOfResidence || 'United Arab Emirates',
          nationality: userData.nationality || null,
          gender: userData.gender || null,
          date_of_birth: userData.dateOfBirth || null,
          is_verified: false,
          verification_status: 'pending',
          bio: userData.bio || null,
          blood_group: userData.bloodGroup || null,
          emergency_contact: userData.emergencyContact || null,
        })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw new Error('Failed to create user profile. Please try again.');
      }

      // Note: User will be automatically logged in via auth state change

    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Account creation failed. Please try again.');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
      // Auth state change will handle the logout dispatch
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if Supabase logout fails
      dispatch({ type: 'LOG_OUT' });
    }
  };

  const setLanguage = (language: 'en' | 'ar'): void => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  };

  const setAccessibilityMode = (mode: AccessibilityMode): void => {
    dispatch({ type: 'SET_ACCESSIBILITY_MODE', payload: mode });
  };

  const setThemeMode = (theme: ThemeMode): void => {
    dispatch({ type: 'SET_THEME_MODE', payload: theme });
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      if (!state.user) {
        throw new Error('No user logged in');
      }

      // Update database first
      const updateData: any = {};
      if (userData.fullName !== undefined) updateData.full_name = userData.fullName;
      if (userData.phone !== undefined) updateData.phone = userData.phone;
      if (userData.profilePicture !== undefined) updateData.profile_picture = userData.profilePicture;
      if (userData.disabilityType !== undefined) updateData.disability_type = userData.disabilityType;
      if (userData.nationality !== undefined) updateData.nationality = userData.nationality;
      if (userData.gender !== undefined) updateData.gender = userData.gender;
      if (userData.dateOfBirth !== undefined) updateData.date_of_birth = userData.dateOfBirth;
      if (userData.bio !== undefined) updateData.bio = userData.bio;
      if (userData.bloodGroup !== undefined) updateData.blood_group = userData.bloodGroup;
      if (userData.emergencyContact !== undefined) updateData.emergency_contact = userData.emergencyContact;

      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', state.user.id);

      if (error) {
        throw error;
      }

      // Update local state
      dispatch({ type: 'UPDATE_USER', payload: userData });
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update profile');
    }
  };

  const value: AuthContextType = {
    state,
    login,
    signup,
    logout,
    setLanguage,
    setAccessibilityMode,
    setThemeMode,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom Hook to use Auth Context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

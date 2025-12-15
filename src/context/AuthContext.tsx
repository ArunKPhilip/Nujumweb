import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState, AccessibilityMode, ThemeMode } from '../types';

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
  logout: () => void;
  setLanguage: (language: 'en' | 'ar') => void;
  setAccessibilityMode: (mode: AccessibilityMode) => void;
  setThemeMode: (theme: ThemeMode) => void;
  updateUser: (userData: Partial<User>) => void;
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

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('nujjum_user');
    const storedLanguage = localStorage.getItem('nujjum_language') as 'en' | 'ar';
    const storedAccessibilityMode = localStorage.getItem('nujjum_accessibility_mode') as AccessibilityMode;
    const storedThemeMode = localStorage.getItem('nujjum_theme_mode') as ThemeMode;

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('nujjum_user');
      }
    }

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

  // Auth functions with proper validation and storage
  const login = async (email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        try {
          // Get stored users from localStorage
          const storedUsers = JSON.parse(localStorage.getItem('nujjum_users') || '[]');

          // Find user by email and password
          const user = storedUsers.find((u: any) => u.email === email && u.password === password);

          if (!user) {
            reject(new Error('Invalid email or password'));
            return;
          }

          // Remove password from user object before storing in state
          const { password: _, ...userWithoutPassword } = user;
          dispatch({ type: 'LOGIN_SUCCESS', payload: userWithoutPassword });
          resolve();
        } catch (error) {
          reject(new Error('Login failed. Please try again.'));
        }
      }, 1000); // Simulate network delay
    });
  };

  const signup = async (userData: any): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        try {
          // Validate required fields
          if (!userData.email || !userData.password || !userData.username) {
            reject(new Error('Email, password, and username are required'));
            return;
          }

          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(userData.email)) {
            reject(new Error('Please enter a valid email address'));
            return;
          }

          // Validate password strength
          if (userData.password.length < 8) {
            reject(new Error('Password must be at least 8 characters long'));
            return;
          }

          // Get existing users
          const storedUsers = JSON.parse(localStorage.getItem('nujjum_users') || '[]');

          // Check if user already exists
          const existingUser = storedUsers.find((u: any) => u.email === userData.email || u.username === userData.username);
          if (existingUser) {
            reject(new Error('User with this email or username already exists'));
            return;
          }

          // Create new user
          const newUser: User = {
            id: Date.now().toString(),
            username: userData.username,
            fullName: userData.fullName || '',
            email: userData.email,
            phone: userData.phone || '',
            profilePicture: userData.profilePicture || '',
            disabilityType: userData.disabilityType || '',
            countryOfResidence: 'United Arab Emirates', // Default for NUJJUM
            nationality: userData.nationality || '',
            gender: userData.gender || '',
            dateOfBirth: userData.dateOfBirth || '',
            isVerified: false,
            verificationStatus: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Create stored user with password
          const storedUser = {
            ...newUser,
            password: userData.password
          };

          // Add to stored users
          storedUsers.push(storedUser);
          localStorage.setItem('nujjum_users', JSON.stringify(storedUsers));

          // Log user in (remove password from state)
          dispatch({ type: 'LOGIN_SUCCESS', payload: newUser });
          resolve();
        } catch (error) {
          reject(new Error('Signup failed. Please try again.'));
        }
      }, 1500); // Simulate network delay
    });
  };

  const logout = (): void => {
    dispatch({ type: 'LOG_OUT' });
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

  const updateUser = (userData: Partial<User>): void => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
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

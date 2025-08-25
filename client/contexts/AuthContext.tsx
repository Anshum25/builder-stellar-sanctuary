import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

export interface QuizResult {
  id: string;
  standard: string;
  subject: string;
  score: number;
  total: number;
  date: string;
  userId: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('quizapp_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock authentication - replace with Firebase Auth
      if (password.length < 6) {
        throw new Error('Password should be at least 6 characters');
      }
      
      const mockUser: User = {
        uid: `user_${Date.now()}`,
        email,
        displayName: email.split('@')[0]
      };
      
      setUser(mockUser);
      localStorage.setItem('quizapp_user', JSON.stringify(mockUser));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, displayName?: string) => {
    setLoading(true);
    try {
      // Mock authentication - replace with Firebase Auth
      if (password.length < 6) {
        throw new Error('Password should be at least 6 characters');
      }
      
      const mockUser: User = {
        uid: `user_${Date.now()}`,
        email,
        displayName: displayName || email.split('@')[0]
      };
      
      setUser(mockUser);
      localStorage.setItem('quizapp_user', JSON.stringify(mockUser));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('quizapp_user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { User } from '../types';
import { api } from '../apiCaller';

interface UserContextType {
  user: User | null;
  signIn: (email: string) => Promise<boolean>;
  signOut: () => void;
  verifyUser: () => Promise<void>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signIn = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await api.post<{ user: User; token: string }>('/auth/login', { email, password: 'password' }); // Password is not used in mock
      localStorage.setItem('jwt_token', response.token);
      setUser(response.user);
      return true;
    } catch (error) {
      console.error('Sign in failed:', error);
      return false;
    } finally {
        setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('jwt_token');
    setUser(null);
  };
  
  const verifyUser = useCallback(async () => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        try {
            // In a real app, this endpoint would validate the token and return the user
            const response = await api.get<{user: User}>('/auth/verify');
            setUser(response.user);
        } catch (error) {
            console.error('Token verification failed:', error);
            signOut(); // Clear invalid token
        }
    }
    setLoading(false);
  }, []);

  return (
    <UserContext.Provider value={{ user, signIn, signOut, loading, verifyUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
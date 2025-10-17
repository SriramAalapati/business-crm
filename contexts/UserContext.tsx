import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../types';
import { ALL_USERS } from '../constants';

interface UserContextType {
  user: User | null;
  signIn: (email: string) => boolean;
  signOut: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = (email: string): boolean => {
    const foundUser = ALL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, signIn, signOut }}>
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

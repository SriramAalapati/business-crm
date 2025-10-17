
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../types';

interface UserContextType {
  user: User | null;
  signIn: (name: string) => void;
  signOut: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = (name: string) => {
    // In a real app, this would involve an API call
    const mockUser: User = {
      id: 'user-1',
      name: name,
      email: `${name.toLowerCase().replace(' ', '.')}@geminicrm.com`,
      avatar: `https://i.pravatar.cc/150?u=${name}`,
      role: 'Sales Manager',
    };
    setUser(mockUser);
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

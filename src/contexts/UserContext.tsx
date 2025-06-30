import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  role: 'student' | 'teacher';
  examSession?: string;
  currentGrade?: number;
  school?: string;
  subjects?: string[];
  gradeLevels?: string[];
  schoolType?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  userRole: 'student' | 'teacher';
  setUserRole: (role: 'student' | 'teacher') => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Initialize userRole from localStorage or default to 'teacher'
  const [userRole, setUserRoleState] = useState<'student' | 'teacher'>(() => {
    const saved = localStorage.getItem('derivativ-user-role');
    return (saved as 'student' | 'teacher') || 'teacher';
  });

  // Persist userRole to localStorage whenever it changes
  const setUserRole = (role: 'student' | 'teacher') => {
    setUserRoleState(role);
    localStorage.setItem('derivativ-user-role', role);
  };

  return (
    <UserContext.Provider value={{ user, setUser, userRole, setUserRole }}>
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
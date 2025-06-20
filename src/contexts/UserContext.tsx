import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');

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
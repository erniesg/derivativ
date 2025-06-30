import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

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
  userRole: 'student' | 'teacher' | null;
  setUserRole: (role: 'student' | 'teacher') => void;
  roleLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { user: authUser, loading: authLoading } = useAuth();
  const [roleLoading, setRoleLoading] = useState(false);

  // Initialize userRole - null for authenticated users until backend profile loads
  const [userRole, setUserRoleState] = useState<'student' | 'teacher' | null>(() => {
    // Don't set initial role - will be determined by auth state
    return null;
  });

  // Update role when auth state changes
  useEffect(() => {
    if (authLoading) {
      // Still loading auth state
      setRoleLoading(true);
      setUserRoleState(null);
      return;
    }

    if (authUser?.role) {
      // Authenticated user with backend profile role
      setUserRoleState(authUser.role);
      localStorage.setItem('derivativ-user-role', authUser.role);
      setRoleLoading(false);
    } else if (!authUser) {
      // Not authenticated, use localStorage role for header switcher
      const saved = localStorage.getItem('derivativ-user-role');
      setUserRoleState((saved as 'student' | 'teacher') || 'student');
      setRoleLoading(false);
    } else {
      // Authenticated but no role yet (still fetching backend profile)
      setRoleLoading(true);
      setUserRoleState(null);
    }
  }, [authUser?.role, authLoading]);

  // Persist userRole to localStorage whenever it changes manually (for unauthenticated users)
  const setUserRole = (role: 'student' | 'teacher') => {
    setUserRoleState(role);
    localStorage.setItem('derivativ-user-role', role);
  };

  return (
    <UserContext.Provider value={{ user, setUser, userRole, setUserRole, roleLoading }}>
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
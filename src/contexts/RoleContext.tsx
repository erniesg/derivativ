import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserRole = 'student' | 'teacher';

interface RoleContextType {
  selectedRole: UserRole;
  setSelectedRole: (role: UserRole) => void;
  isRoleSelected: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedRole, setSelectedRoleState] = useState<UserRole>(() => {
    // Initialize from localStorage or default to 'student'
    const saved = localStorage.getItem('derivativ-selected-role');
    return (saved as UserRole) || 'student';
  });

  const [isRoleSelected, setIsRoleSelected] = useState(true);

  // Persist role to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('derivativ-selected-role', selectedRole);
  }, [selectedRole]);

  const setSelectedRole = (role: UserRole) => {
    setSelectedRoleState(role);
    setIsRoleSelected(true);
  };

  return (
    <RoleContext.Provider value={{
      selectedRole,
      setSelectedRole,
      isRoleSelected
    }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}; 
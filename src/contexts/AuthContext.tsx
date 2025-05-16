import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { mockUsers } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string, nrc?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always use a mock user for MVP without authentication
  const defaultUser: User = {
    id: 'mock-user-123',
    name: 'Demo User',
    email: 'demo@example.com',
    role: 'applicant',
    status: 'active',
  };
  
  const [user, setUser] = useState<User | null>(defaultUser);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Simplified login for demo purposes
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const demoUser = mockUsers.find(user => user.email === email.toLowerCase()) || defaultUser;
      setUser(demoUser);
      
      toast({
        title: 'Demo Login',
        description: `Welcome, ${demoUser.name}!`,
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: 'Login Failed',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Simplified signup for demo purposes
  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    setLoading(true);
    try {
      const newUser: User = {
        id: `demo-${Date.now()}`,
        name: `${firstName} ${lastName}`,
        email: email,
        role: 'applicant',
        status: 'active',
      };
      
      setUser(newUser);
      
      toast({
        title: 'Registration Successful',
        description: 'Demo account created successfully.',
      });
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: 'Registration Failed',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Simplified logout
  const logout = async () => {
    // Keep the default user for demo purposes instead of logging out completely
    setUser(defaultUser);
    toast({
      title: 'Demo Logout',
      description: 'You have been reset to the default demo user.',
    });
  };
  
  const hasRole = (role: UserRole | UserRole[]) => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login,
        signup,
        logout,
        isAuthenticated: true, // Always authenticated for MVP
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { mockUsers } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string, nrc?: string) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('demo_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        console.log("Using stored demo user:", JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user:", e);
        localStorage.removeItem('demo_user');
      }
      setLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Existing session check:", session?.user?.id);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    }).catch(error => {
      console.error("Error getting session:", error);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching user profile for:", userId);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        console.error("Profile error:", profileError);
        throw profileError;
      }
      
      const { data: userData } = await supabase.auth.getUser();
      const userEmail = userData?.user?.email || '';
      
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
        
      if (roleError) {
        console.error("Role error:", roleError);
        throw roleError;
      }
      
      console.log("User data loaded:", { profile: profileData, role: roleData });
      
      setUser({
        id: userId,
        name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
        email: userEmail,
        role: roleData.role as UserRole,
        status: 'active',
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };
  
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // First check if it's the real admin account
      if (email.toLowerCase() === 'jnjovu51@gmail.com' && password === '12345678') {
        const adminUser: User = {
          id: 'real-admin-001',
          name: 'Admin User',
          email: 'jnjovu51@gmail.com',
          role: 'administrator' as UserRole,
          status: 'active',
        };
        localStorage.setItem('demo_user', JSON.stringify(adminUser));
        setUser(adminUser);
        toast({
          title: 'Admin Login Successful',
          description: `Welcome, ${adminUser.name}!`,
        });
        return;
      }
      
      // Then check other demo accounts
      const demoUser = mockUsers.find(user => user.email === email.toLowerCase() && password === 'password');
      
      if (demoUser) {
        console.log("Logging in with demo account:", demoUser);
        localStorage.setItem('demo_user', JSON.stringify(demoUser));
        setUser(demoUser);
        toast({
          title: 'Demo Login Successful',
          description: `Welcome, ${demoUser.name}!`,
        });
        return;
      }
      
      // If not a demo account, try Supabase auth
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      console.log("Supabase login successful:", data.user?.id);
      
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: 'Login Failed',
        description: (error as Error).message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Determine user role based on email domain
  const determineUserRole = (email: string): UserRole => {
    const lowerEmail = email.toLowerCase();
    
    // Check for specific email patterns
    if (lowerEmail.endsWith('@police.gov.zm')) {
      return 'officer';
    } else if (lowerEmail.includes('admin') || lowerEmail.includes('administrator')) {
      return 'administrator';
    } else if (lowerEmail.includes('verify') || lowerEmail.includes('verifier')) {
      return 'verifier';
    } else {
      // Default role
      return 'applicant';
    }
  };
  
  const signup = async (email: string, password: string, firstName: string, lastName: string, nrc?: string) => {
    setLoading(true);
    try {
      // Determine role based on email
      const role = determineUserRole(email);
      
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            nrc: nrc || '',
            role: role, // Include role in metadata
          },
        },
      });
      
      if (signUpError) throw signUpError;
      
      console.log("Signup successful, user data:", data);
      
      // If user was created successfully and we have their ID
      if (data.user) {
        try {
          // Explicitly set role in user_roles table (this might be redundant with DB trigger but ensures role is set)
          const { error: roleError } = await supabase
            .from('user_roles')
            .upsert([
              { 
                user_id: data.user.id,
                role: role
              }
            ]);
            
          if (roleError) {
            console.error("Error setting user role:", roleError);
          }
        } catch (roleSetError) {
          console.error("Failed to set user role:", roleSetError);
        }
      }
      
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created successfully. You can now log in.',
      });
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: 'Registration Failed',
        description: (error as Error).message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      const storedUser = localStorage.getItem('demo_user');
      if (storedUser) {
        localStorage.removeItem('demo_user');
        setUser(null);
        toast({
          title: 'Demo Logout',
          description: 'You have been logged out from the demo account.',
        });
        return;
      }
      
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: 'Logout Failed',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };
  
  const refreshSession = async () => {
    try {
      const storedUser = localStorage.getItem('demo_user');
      if (storedUser) {
        console.log("Refreshing demo user session");
        return;
      }
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("Error refreshing session:", error);
        throw error;
      }
      
      console.log("Session refreshed successfully");
    } catch (error) {
      console.error("Failed to refresh session:", error);
      toast({
        title: 'Session Refresh Failed',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
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
        refreshSession,
        isAuthenticated: !!user,
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

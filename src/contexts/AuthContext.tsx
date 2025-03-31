
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
  isAuthenticated: boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Set up auth state listener and check for existing session
  useEffect(() => {
    // Check for session in localStorage
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

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        if (session?.user) {
          // Use setTimeout to avoid potential deadlock
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
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
      // Get user profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        console.error("Profile error:", profileError);
        throw profileError;
      }
      
      // Get user email from auth
      const { data: userData } = await supabase.auth.getUser();
      const userEmail = userData?.user?.email || '';
      
      // Get user role
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
      
      // Set user with combined data
      setUser({
        id: userId,
        name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
        email: userEmail,
        role: roleData.role as UserRole,
        status: 'active',
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // If we can't fetch the profile, log the user out
      logout();
    } finally {
      setLoading(false);
    }
  };
  
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Check if this is a demo account
      const demoUser = mockUsers.find(user => user.email === email.toLowerCase() && password === 'password');
      
      if (demoUser) {
        // Handle demo login
        console.log("Logging in with demo account:", demoUser);
        
        // Store the user in localStorage for persistence
        localStorage.setItem('demo_user', JSON.stringify(demoUser));
        
        // Set the user in context
        setUser(demoUser);
        
        toast({
          title: 'Demo Login Successful',
          description: `Welcome, ${demoUser.name}!`,
        });
        
        return;
      }
      
      // Real authentication with Supabase
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
  
  const signup = async (email: string, password: string, firstName: string, lastName: string, nrc?: string) => {
    setLoading(true);
    try {
      // Sign up with Supabase Auth
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            nrc: nrc || '',
          },
        },
      });
      
      if (signUpError) throw signUpError;
      
      console.log("Signup successful, user data:", data);
      
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created successfully.',
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
      // Check if using a demo account
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
      
      // Regular logout via Supabase
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

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string, nrc?: string) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  createUser: (email: string, role: UserRole, firstName: string, lastName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
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
  
  const createUser = async (email: string, role: UserRole, firstName: string, lastName: string) => {
    setLoading(true);
    try {
      // Check if current user is an admin
      if (!user || user.role !== 'administrator') {
        throw new Error('Only administrators can create users');
      }
      
      // Generate a random password (will be reset on first login)
      const tempPassword = Math.random().toString(36).slice(-8);
      
      // Create the user account using Supabase admin API
      const { error: signUpError, data } = await supabase.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
          role: role
        }
      });
      
      if (signUpError) throw signUpError;
      
      // Explicitly set the role (overriding the email-based detection)
      if (data.user) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert([
            { 
              user_id: data.user.id,
              role: role
            }
          ]);
          
        if (roleError) throw roleError;
        
        // Store the invitation in our custom table using RPC
        const { error: inviteError } = await supabase.rpc('create_user_invitation', {
          user_email: email,
          user_role: role,
          inviter_id: user.id,
          invite_token: crypto.randomUUID()
        });
        
        if (inviteError) {
          console.error("Error creating invitation record:", inviteError);
          // Continue even if invitation record fails
        }
      }
      
      toast({
        title: 'User Created Successfully',
        description: `${firstName} ${lastName} has been added as a ${role}.`,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: 'Failed to Create User',
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
        hasRole,
        createUser
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

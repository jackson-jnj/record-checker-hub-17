
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/types";

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: authData } = await supabase.auth.getSession();
    
    if (!authData.session) {
      return null;
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name, avatar_url')
      .eq('id', authData.session.user.id)
      .single();
    
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', authData.session.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    const role = roleData?.role as UserRole || 'applicant';
    const name = profile 
      ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() 
      : authData.session.user.email?.split('@')[0] || 'User';
    
    return {
      id: authData.session.user.id,
      name,
      email: authData.session.user.email || '',
      role,
      avatar: profile?.avatar_url,
      status: 'active',
      lastLogin: new Date(authData.session.user.last_sign_in_at || '').toISOString()
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

export const logoutUser = async (): Promise<void> => {
  await supabase.auth.signOut();
};

export const hasRole = async (userId: string, requiredRoles: UserRole | UserRole[]): Promise<boolean> => {
  try {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    
    if (!data || data.length === 0) {
      return false;
    }
    
    const userRoles = data.map(item => item.role);
    
    const rolesToCheck = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    
    return rolesToCheck.some(role => userRoles.includes(role));
  } catch (error) {
    console.error("Error checking user role:", error);
    return false;
  }
};

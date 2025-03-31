
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { debug } from "@/utils/debugUtils";

/**
 * Hook to ensure user state stays synchronized with Supabase
 * Use this in the main layout component
 */
export const useUserSync = () => {
  const { user, logout } = useAuth();
  
  useEffect(() => {
    // This function checks if the user's session is still valid
    const checkUserSession = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error || !data.session) {
          debug.log('useUserSync', 'Session invalid, logging out', { error });
          // Session is invalid, logout the user
          logout();
        }
      } catch (error) {
        debug.error('useUserSync', 'Error checking session', error);
      }
    };
    
    // Initial check
    checkUserSession();
    
    // Set up interval to periodically check (every 5 minutes)
    const interval = setInterval(checkUserSession, 1000 * 60 * 5);
    
    return () => clearInterval(interval);
  }, [user, logout]);
};

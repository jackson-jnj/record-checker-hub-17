
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { debug } from "@/utils/debugUtils";
import { getCurrentUser } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook to ensure user state stays synchronized with Supabase
 * Use this in the main layout component
 */
export const useUserSync = () => {
  const { user, setUser, logout } = useAuth();
  const { toast } = useToast();
  
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
          
          toast({
            title: "Session Expired",
            description: "Your session has expired. Please log in again.",
            variant: "default",
          });
        } else {
          // Refresh user data periodically
          const userData = await getCurrentUser();
          if (userData) {
            setUser(userData);
          }
        }
      } catch (error) {
        debug.error('useUserSync', 'Error checking session', error);
      }
    };
    
    // Initial check
    checkUserSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        debug.log('useUserSync', 'Auth state changed', { event });
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Use setTimeout to prevent potential deadlocks with Supabase client
          setTimeout(async () => {
            const userData = await getCurrentUser();
            if (userData) {
              setUser(userData);
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    // Set up interval to periodically check (every 5 minutes)
    const interval = setInterval(checkUserSession, 1000 * 60 * 5);
    
    return () => {
      clearInterval(interval);
      subscription.unsubscribe();
    };
  }, [user, setUser, logout, toast]);
};

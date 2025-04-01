
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { debug } from "@/utils/debugUtils";
import { toast } from "@/components/ui/use-toast";

/**
 * Component to monitor user session and activity
 * This helps ensure proper tracking of all user actions
 */
const SessionMonitor: React.FC = () => {
  const { user, refreshSession, logout } = useAuth();

  // Monitor user activity to keep session alive
  useEffect(() => {
    if (!user) return;

    let activityTimeout: number | null = null;
    let warningDisplayed = false;
    
    // Session timeout period (30 minutes of inactivity)
    const SESSION_TIMEOUT = 30 * 60 * 1000;
    // Warning period (5 minutes before timeout)
    const WARNING_BEFORE_TIMEOUT = 5 * 60 * 1000;
    
    const resetActivityTimer = () => {
      if (activityTimeout) {
        window.clearTimeout(activityTimeout);
        warningDisplayed = false;
      }
      
      // Set timeout to warn user before session expires
      activityTimeout = window.setTimeout(() => {
        if (!warningDisplayed) {
          warningDisplayed = true;
          toast({
            title: "Session Expiring Soon",
            description: "Your session will expire soon due to inactivity. Please click here to stay logged in.",
            duration: WARNING_BEFORE_TIMEOUT,
            action: (
              <button 
                onClick={() => {
                  refreshSession();
                  resetActivityTimer();
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-2 text-xs rounded-md"
              >
                Keep Session
              </button>
            )
          });
          
          // Set final timeout to logout
          window.setTimeout(() => {
            if (warningDisplayed) {
              debug.log("SessionMonitor", "Session expired due to inactivity");
              logout();
              toast({
                title: "Session Expired",
                description: "You have been logged out due to inactivity.",
                variant: "destructive"
              });
            }
          }, WARNING_BEFORE_TIMEOUT);
        }
      }, SESSION_TIMEOUT - WARNING_BEFORE_TIMEOUT);
    };
    
    // Track user activity
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    
    const handleUserActivity = () => {
      resetActivityTimer();
    };
    
    // Initialize timer
    resetActivityTimer();
    
    // Add event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });
    
    // Clean up
    return () => {
      if (activityTimeout) {
        window.clearTimeout(activityTimeout);
      }
      
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [user, refreshSession, logout]);

  // Listen for auth state changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      debug.log("SessionMonitor", "Auth state changed", { event, userId: session?.user?.id });
      
      if (event === 'SIGNED_OUT') {
        debug.log("SessionMonitor", "User signed out");
      } else if (event === 'SIGNED_IN') {
        debug.log("SessionMonitor", "User signed in", { userId: session?.user?.id });
      } else if (event === 'TOKEN_REFRESHED') {
        debug.log("SessionMonitor", "User token refreshed", { userId: session?.user?.id });
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  // Component doesn't render anything
  return null;
};

export default SessionMonitor;

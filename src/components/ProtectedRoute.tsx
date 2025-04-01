
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { debug } from "@/utils/debugUtils";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { isAuthenticated, loading, user, hasRole } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Log page access attempts
    debug.log("ProtectedRoute", "Page access attempt", { 
      path: location.pathname,
      isAuthenticated,
      userRole: user?.role,
      allowedRoles
    });
  }, [location.pathname, isAuthenticated, user?.role, allowedRoles]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-police-dark"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    debug.log("ProtectedRoute", "Redirecting to login - not authenticated", { path: location.pathname });
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If allowedRoles is provided, check if user has the required role
  if (allowedRoles && allowedRoles.length > 0 && user) {
    const hasAllowedRole = allowedRoles.some(role => hasRole(role));
    
    if (!hasAllowedRole) {
      debug.warn("ProtectedRoute", "User role not authorized", { 
        userRole: user.role, 
        allowedRoles,
        path: location.pathname
      });
      
      // Show toast notification
      toast({
        title: "Access Denied",
        description: `You don't have permission to access this page. Required role: ${allowedRoles.join(' or ')}`,
        variant: "destructive",
      });
      
      return <Navigate to="/dashboard" replace />;
    }
    
    debug.log("ProtectedRoute", "Role check passed", { 
      userRole: user.role, 
      allowedRoles,
      path: location.pathname
    });
  }

  return <>{children}</>;
};

export default ProtectedRoute;

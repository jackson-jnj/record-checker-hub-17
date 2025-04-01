
import { UserRole } from "@/types";
import { debug } from "@/utils/debugUtils";

/**
 * Checks if a user has permission to access features based on their role
 * @param userRole The current user's role
 * @param requiredRoles Array of roles that have permission
 * @returns boolean indicating if the user has permission
 */
export const hasPermission = (userRole: UserRole | undefined, requiredRoles: UserRole[]): boolean => {
  if (!userRole) {
    debug.warn("permissions", "No user role provided for permission check", { requiredRoles });
    return false;
  }
  
  const hasAccess = requiredRoles.includes(userRole);
  debug.log("permissions", `Permission check for role ${userRole}`, { 
    requiredRoles, 
    hasAccess,
    userRole 
  });
  
  return hasAccess;
};

/**
 * Gets a list of available routes based on user role
 * @param userRole The current user's role
 * @returns Array of route paths the user can access
 */
export const getAvailableRoutes = (userRole: UserRole | undefined): string[] => {
  if (!userRole) {
    debug.log("permissions", "No user role provided, returning only login route");
    return ['/login'];
  }
  
  // Base routes all authenticated users can access
  const routes = ['/dashboard', '/profile', '/applications'];
  
  // Add role-specific routes
  switch (userRole) {
    case 'administrator':
      routes.push('/users', '/reports', '/settings', '/verification');
      break;
    case 'officer':
      routes.push('/verification');
      break;
    case 'verifier':
      routes.push('/verification');
      break;
    default:
      break;
  }
  
  debug.log("permissions", `Routes available for role ${userRole}`, { routes });
  
  return routes;
};

/**
 * Checks if a specific action is allowed for the given user role
 * @param userRole The current user's role
 * @param action The action to check permission for
 * @returns boolean indicating if the action is allowed
 */
export const canPerformAction = (userRole: UserRole | undefined, action: string): boolean => {
  if (!userRole) return false;
  
  // Define permissions matrix for different roles and actions
  const permissionsMatrix: Record<UserRole, string[]> = {
    administrator: [
      'view_all_applications', 
      'update_any_application', 
      'delete_any_application',
      'manage_users',
      'view_reports',
      'system_settings',
      'verify_applications',
      'assign_applications'
    ],
    officer: [
      'view_assigned_applications',
      'update_assigned_application',
      'verify_applications'
    ],
    verifier: [
      'view_verification_queue',
      'verify_applications'
    ],
    applicant: [
      'view_own_applications',
      'create_application',
      'update_own_application'
    ]
  };
  
  const allowed = permissionsMatrix[userRole]?.includes(action) || false;
  debug.log("permissions", `Action permission check: ${action} for role ${userRole}`, { allowed });
  
  return allowed;
};

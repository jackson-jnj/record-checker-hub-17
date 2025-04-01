
import { UserRole } from "@/types";

/**
 * Checks if a user has permission to access features based on their role
 * @param userRole The current user's role
 * @param requiredRoles Array of roles that have permission
 * @returns boolean indicating if the user has permission
 */
export const hasPermission = (userRole: UserRole | undefined, requiredRoles: UserRole[]): boolean => {
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
};

/**
 * Gets a list of available routes based on user role
 * @param userRole The current user's role
 * @returns Array of route paths the user can access
 */
export const getAvailableRoutes = (userRole: UserRole | undefined): string[] => {
  if (!userRole) return ['/login'];
  
  // Base routes all authenticated users can access
  const routes = ['/dashboard', '/profile', '/applications'];
  
  // Add role-specific routes
  switch (userRole) {
    case 'administrator':
      routes.push('/users', '/reports', '/settings', '/verification');
      break;
    case 'officer':
    case 'verifier':
      routes.push('/verification');
      break;
    default:
      break;
  }
  
  return routes;
};

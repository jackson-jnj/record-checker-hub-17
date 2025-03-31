
import { toast } from "@/components/ui/use-toast";

type ErrorCategory = 'auth' | 'data' | 'network' | 'permission' | 'validation' | 'unknown';

interface ErrorDetails {
  message: string;
  category: ErrorCategory;
  originalError?: any;
}

/**
 * Centralized error handler for the application
 * This helps with tracking and consistently handling errors
 */
export const handleError = (
  error: Error | string | unknown, 
  category: ErrorCategory = 'unknown',
  context?: string
): ErrorDetails => {
  let message = 'An unknown error occurred';
  
  if (typeof error === 'string') {
    message = error;
  } else if (error instanceof Error) {
    message = error.message;
  }
  
  // Add context to the message if provided
  if (context) {
    message = `${context}: ${message}`;
  }
  
  // Log to console for debugging
  console.error(`[${category.toUpperCase()}]`, message, error);
  
  const errorDetails: ErrorDetails = {
    message,
    category,
    originalError: error
  };
  
  return errorDetails;
};

/**
 * Display an error toast notification
 */
export const showErrorToast = (
  error: Error | string | ErrorDetails | unknown, 
  title = 'Error',
  category: ErrorCategory = 'unknown'
) => {
  let errorDetails: ErrorDetails;
  
  if (typeof error === 'object' && error !== null && 'message' in error && 'category' in error) {
    errorDetails = error as ErrorDetails;
  } else {
    errorDetails = handleError(error, category);
  }
  
  toast({
    title,
    description: errorDetails.message,
    variant: 'destructive',
  });
  
  return errorDetails;
};

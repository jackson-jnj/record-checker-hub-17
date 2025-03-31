
/**
 * Enhanced logging utility for debugging
 * Provides consistent formatting and only logs in non-production environments
 */
export const debug = {
  log: (component: string, message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.log(`[${component}]`, message, data || '');
    }
  },
  
  error: (component: string, message: string, error?: any) => {
    if (import.meta.env.DEV) {
      console.error(`[${component}]`, message, error || '');
    }
  },
  
  warn: (component: string, message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.warn(`[${component}]`, message, data || '');
    }
  },
  
  trace: (component: string, message: string) => {
    if (import.meta.env.DEV) {
      console.log(`[${component}]`, message);
      console.trace();
    }
  },
  
  group: (component: string, message: string, callback: () => void) => {
    if (import.meta.env.DEV) {
      console.group(`[${component}] ${message}`);
      callback();
      console.groupEnd();
    }
  }
};


import { ApplicationStatus } from "@/types";

// Helper functions for Application Status
export const isValidStatus = (status: string): status is ApplicationStatus => {
  return ['pending', 'processing', 'approved', 'rejected', 'submitted', 'pending_verification', 'verified', 'invalid', 'under_review'].includes(status);
};

export const normalizeStatus = (status: string): ApplicationStatus => {
  if (isValidStatus(status)) return status;
  
  // Map non-standard statuses to our enum values
  switch (status.toLowerCase()) {
    case 'submitted':
    case 'pending_verification':
      return 'pending';
    case 'verified':
    case 'under_review':
      return 'processing';
    case 'invalid':
      return 'rejected';
    default:
      return 'pending';
  }
};

export const getNextStatuses = (currentStatus: ApplicationStatus, userRole: string): ApplicationStatus[] => {
  switch (currentStatus) {
    case 'pending':
      if (['verifier', 'administrator'].includes(userRole)) {
        return ['processing', 'rejected'];
      }
      break;
    case 'processing':
      if (['officer', 'administrator'].includes(userRole)) {
        return ['approved', 'rejected'];
      }
      break;
    default:
      break;
  }
  return [];
};

// Document upload helpers
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const generateUniqueFileName = (file: File): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  const extension = file.name.split('.').pop() || '';
  return `${timestamp}-${randomString}.${extension}`;
};


export type UserRole = 'administrator' | 'officer' | 'applicant' | 'verifier';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status?: 'active' | 'inactive';
  lastLogin?: string;
}

export type ApplicationStatus = 'pending' | 'processing' | 'approved' | 'rejected';

export interface Application {
  id: string;
  referenceNumber: string;
  applicantId: string;
  applicantName: string;
  applicationType: 'standard' | 'enhanced' | 'vulnerable';
  status: ApplicationStatus;
  submissionDate: string;
  lastUpdated: string;
  estimatedCompletionDate?: string;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  documents?: Document[];
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: number;
  url: string;
}

export interface NotificationMessage {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  link?: string;
}

export interface SystemSettings {
  general: {
    systemName: string;
    contactEmail: string;
    supportPhone: string;
    maintenanceMode: boolean;
    debugMode: boolean;
    defaultLanguage: string;
    autoLogout: string;
    timezone: string;
  };
  email: {
    smtpServer: string;
    smtpPort: string;
    smtpUsername: string;
    smtpPassword: string;
    fromEmail: string;
    emailFooter: string;
    enableEmailNotifications: boolean;
  };
  security: {
    passwordPolicy: string;
    minPasswordLength: string;
    requireSpecialChars: boolean;
    mfaRequired: boolean;
    sessionTimeout: string;
    ipRestriction: boolean;
    allowedIPs: string;
    auditLogRetention: string;
  };
}

export interface Report {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  createdBy: string;
  format: 'pdf' | 'csv' | 'excel';
  url: string;
}

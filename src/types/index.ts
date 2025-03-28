
export type UserRole = 'administrator' | 'officer' | 'applicant' | 'verifier';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
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

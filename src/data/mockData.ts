
import { Application, NotificationMessage, User } from '@/types';

// Mock Users Data
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'administrator',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=1A3A6E&color=fff',
  },
  {
    id: '2',
    name: 'John Officer',
    email: 'officer@example.com',
    role: 'officer',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=John+Officer&background=2C5282&color=fff',
  },
  {
    id: '3',
    name: 'Jane Applicant',
    email: 'applicant@example.com',
    role: 'applicant',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Applicant&background=319795&color=fff',
  },
  {
    id: '4',
    name: 'Mark Verifier',
    email: 'verifier@example.com',
    role: 'verifier',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Mark+Verifier&background=4299E1&color=fff',
  },
];

// Mock Applications Data
export const mockApplications: Application[] = [
  {
    id: '1',
    referenceNumber: 'PRC-20230001',
    applicantId: '3',
    applicantName: 'Jane Applicant',
    applicationType: 'standard',
    status: 'pending',
    submissionDate: '2023-06-15T10:30:00Z',
    lastUpdated: '2023-06-15T10:30:00Z',
    estimatedCompletionDate: '2023-06-30T00:00:00Z',
  },
  {
    id: '2',
    referenceNumber: 'PRC-20230002',
    applicantId: '3',
    applicantName: 'Jane Applicant',
    applicationType: 'enhanced',
    status: 'processing',
    submissionDate: '2023-06-10T14:20:00Z',
    lastUpdated: '2023-06-16T09:15:00Z',
    estimatedCompletionDate: '2023-06-25T00:00:00Z',
    assignedOfficerId: '2',
    assignedOfficerName: 'John Officer',
  },
  {
    id: '3',
    referenceNumber: 'PRC-20230003',
    applicantId: '5',
    applicantName: 'Robert Smith',
    applicationType: 'vulnerable',
    status: 'approved',
    submissionDate: '2023-06-05T11:45:00Z',
    lastUpdated: '2023-06-14T16:30:00Z',
  },
  {
    id: '4',
    referenceNumber: 'PRC-20230004',
    applicantId: '6',
    applicantName: 'Emily Johnson',
    applicationType: 'standard',
    status: 'rejected',
    submissionDate: '2023-06-08T09:00:00Z',
    lastUpdated: '2023-06-15T14:20:00Z',
    notes: 'Incomplete documentation provided.',
  },
  {
    id: '5',
    referenceNumber: 'PRC-20230005',
    applicantId: '7',
    applicantName: 'Michael Brown',
    applicationType: 'enhanced',
    status: 'pending',
    submissionDate: '2023-06-17T13:10:00Z',
    lastUpdated: '2023-06-17T13:10:00Z',
    estimatedCompletionDate: '2023-07-02T00:00:00Z',
  },
];

// Mock Notifications
export const mockNotifications: NotificationMessage[] = [
  {
    id: '1',
    userId: '3',
    title: 'Application Received',
    message: 'Your application PRC-20230001 has been received and is pending review.',
    date: '2023-06-15T10:30:00Z',
    read: false,
    link: '/applications/1',
  },
  {
    id: '2',
    userId: '3',
    title: 'Application Status Update',
    message: 'Your application PRC-20230002 status has been updated to Processing.',
    date: '2023-06-16T09:15:00Z',
    read: true,
    link: '/applications/2',
  },
  {
    id: '3',
    userId: '2',
    title: 'New Application Assigned',
    message: 'You have been assigned application PRC-20230002 for processing.',
    date: '2023-06-16T09:15:00Z',
    read: false,
    link: '/applications/2',
  },
];

export const mockCurrentUser = mockUsers[2]; // Default to applicant for demo

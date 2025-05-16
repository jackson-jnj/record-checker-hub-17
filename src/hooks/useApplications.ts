
import { useState, useEffect } from "react";
import { Application, UserRole } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { 
  fetchApplications, 
  fetchApplicationById, 
  createApplication, 
  updateApplicationStatus, 
  subscribeToApplications
} from "@/services/applicationService";
import { useToast } from "@/hooks/use-toast";

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch applications on component mount
  useEffect(() => {
    const loadApplications = async () => {
      setLoading(true);
      try {
        const data = await fetchApplications();
        setApplications(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
        toast({
          title: "Error",
          description: "Failed to load applications",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadApplications();
  }, [toast]);
  
  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToApplications((updatedApplication) => {
      setApplications(prevApplications => {
        // Check if this is an update to an existing application
        const existingIndex = prevApplications.findIndex(app => app.id === updatedApplication.id);
        
        if (existingIndex >= 0) {
          // Update existing application
          const newApplications = [...prevApplications];
          newApplications[existingIndex] = updatedApplication;
          return newApplications;
        } else {
          // Add new application
          return [...prevApplications, updatedApplication];
        }
      });
      
      // Show toast notification for updates if user isn't the applicant
      // This prevents applicants from getting notifications about their own submissions
      if (user?.role !== 'applicant' || user?.id !== updatedApplication.applicantId) {
        toast({
          title: "Application Updated",
          description: `${updatedApplication.referenceNumber} status: ${updatedApplication.status}`,
          variant: "default"
        });
      }
    });
    
    return unsubscribe;
  }, [user, toast]);
  
  // Get a single application by ID
  const getApplication = async (id: string) => {
    try {
      setLoading(true);
      const application = await fetchApplicationById(id);
      setLoading(false);
      return application;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      return null;
    }
  };
  
  // Create new application
  const submitApplication = async (applicationData: Partial<Application>) => {
    try {
      setLoading(true);
      const newApplication = await createApplication(applicationData);
      setLoading(false);
      
      if (newApplication) {
        toast({
          title: "Success",
          description: "Application submitted successfully",
          variant: "default"
        });
        return newApplication;
      } else {
        throw new Error("Failed to submit application");
      }
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive"
      });
      
      return null;
    }
  };
  
  // Update application status
  const updateStatus = async (
    applicationId: string, 
    newStatus: Application["status"], 
    notes?: string
  ) => {
    try {
      setLoading(true);
      const success = await updateApplicationStatus(applicationId, newStatus, notes);
      setLoading(false);
      
      if (success) {
        toast({
          title: "Success",
          description: `Application status updated to ${newStatus}`,
          variant: "default"
        });
        return true;
      } else {
        throw new Error("Failed to update application status");
      }
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive"
      });
      
      return false;
    }
  };
  
  return {
    applications,
    loading,
    error,
    getApplication,
    submitApplication,
    updateStatus
  };
};

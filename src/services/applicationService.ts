
import { supabase } from "@/integrations/supabase/client";
import { Application, ApplicationStatus } from "@/types";
import { debug } from "@/utils/debugUtils";

// Type matching supabase schema
interface SupabaseApplication {
  id: string;
  reference_number: string;
  applicant_id: string;
  type: 'standard' | 'enhanced' | 'vulnerable';
  status: ApplicationStatus;
  submission_date: string;
  last_updated: string;
  estimated_completion_date?: string;
  assigned_officer_id?: string;
  purpose?: string;
  applicant_name?: string;
  uploaded_documents?: any[];
  notes?: string;
  priority?: string;
}

// Convert from Supabase schema to our application interface
const mapToApplication = async (data: SupabaseApplication): Promise<Application> => {
  // Get applicant name if not already provided
  let applicantName = data.applicant_name;
  if (!applicantName && data.applicant_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', data.applicant_id)
      .single();
    
    if (profile) {
      applicantName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    }
  }

  // Get officer name if assigned
  let assignedOfficerName;
  if (data.assigned_officer_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', data.assigned_officer_id)
      .single();
    
    if (profile) {
      assignedOfficerName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    }
  }

  return {
    id: data.id,
    referenceNumber: data.reference_number,
    applicantId: data.applicant_id,
    applicantName: applicantName || 'Unknown Applicant',
    applicationType: data.type,
    status: data.status,
    submissionDate: data.submission_date,
    lastUpdated: data.last_updated,
    estimatedCompletionDate: data.estimated_completion_date,
    assignedOfficerId: data.assigned_officer_id,
    assignedOfficerName,
    notes: data.notes,
    priority: data.priority as any,
  };
};

// Fetch applications based on user role
export const fetchApplications = async (): Promise<Application[]> => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('submission_date', { ascending: false });

    if (error) {
      debug.error('applicationService', 'Error fetching applications', error);
      throw error;
    }

    // Map Supabase data to our Application interface
    const applications = await Promise.all(
      (data || []).map(app => mapToApplication(app as SupabaseApplication))
    );

    return applications;
  } catch (error) {
    debug.error('applicationService', 'Error in fetchApplications', error);
    return [];
  }
};

// Fetch single application by ID
export const fetchApplicationById = async (id: string): Promise<Application | null> => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      debug.error('applicationService', `Error fetching application ${id}`, error);
      throw error;
    }

    if (!data) return null;
    
    return await mapToApplication(data as SupabaseApplication);
  } catch (error) {
    debug.error('applicationService', `Error in fetchApplicationById for ${id}`, error);
    return null;
  }
};

// Create a new application
export const createApplication = async (application: Partial<Application>): Promise<Application | null> => {
  try {
    // Generate reference number from backend or add a placeholder
    const refNumber = application.referenceNumber || 'PRC-PENDING';
    
    // Fixed: Use 'pending' status which is valid in Supabase's enum
    // Even though our ApplicationStatus type includes more options,
    // we need to use one of the values Supabase accepts
    const { data, error } = await supabase
      .from('applications')
      .insert({
        reference_number: refNumber,
        applicant_id: application.applicantId,
        type: application.applicationType,
        status: 'pending', // Using 'pending' instead of 'submitted' to match Supabase's enum
        purpose: application.notes,
        applicant_name: application.applicantName,
        priority: application.priority
      })
      .select()
      .single();

    if (error) {
      debug.error('applicationService', 'Error creating application', error);
      throw error;
    }

    return await mapToApplication(data as SupabaseApplication);
  } catch (error) {
    debug.error('applicationService', 'Error in createApplication', error);
    return null;
  }
};

// Update application status
export const updateApplicationStatus = async (
  id: string, 
  status: ApplicationStatus,
  notes?: string
): Promise<boolean> => {
  try {
    const updates: any = { 
      status,
      last_updated: new Date().toISOString()
    };
    
    if (notes) updates.notes = notes;
    
    // Add specific date fields based on status
    if (['verified', 'invalid'].includes(status)) {
      updates.verification_date = new Date().toISOString();
    } else if (['approved', 'rejected'].includes(status)) {
      updates.approved_rejected_date = new Date().toISOString();
    }

    const { error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id);

    if (error) {
      debug.error('applicationService', `Error updating application ${id} status`, error);
      throw error;
    }

    return true;
  } catch (error) {
    debug.error('applicationService', `Error in updateApplicationStatus for ${id}`, error);
    return false;
  }
};

// Subscribe to real-time updates for applications
export const subscribeToApplications = (callback: (application: Application) => void) => {
  const channel = supabase
    .channel('applications-channel')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'applications' },
      async (payload) => {
        const application = await mapToApplication(payload.new as SupabaseApplication);
        callback(application);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

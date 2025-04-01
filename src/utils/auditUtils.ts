
import { supabase } from "@/integrations/supabase/client";
import { debug } from "@/utils/debugUtils";

/**
 * Utility to log user actions to the audit log table
 */
export const logUserAction = async (
  action: string,
  tableName: string,
  recordId: string,
  oldData?: any,
  newData?: any
) => {
  try {
    const userResponse = await supabase.auth.getUser();
    const userId = userResponse.data.user?.id;
    
    if (!userId) {
      debug.warn("auditUtils", "Attempted to log action without user ID", { action, tableName, recordId });
      return null;
    }

    const { data, error } = await supabase.rpc('create_audit_log', {
      _user_id: userId,
      _action: action,
      _table_name: tableName,
      _record_id: recordId,
      _old_data: oldData || null,
      _new_data: newData || null
    });

    if (error) {
      debug.error("auditUtils", "Failed to create audit log", { error, action, tableName, recordId });
      return null;
    }

    debug.log("auditUtils", "User action logged successfully", { 
      action, tableName, recordId, userId, auditLogId: data 
    });
    
    return data;
  } catch (err) {
    debug.error("auditUtils", "Exception when logging user action", err);
    return null;
  }
};

/**
 * Hook for logging user actions with access to auth context
 */
export const useAuditLog = () => {
  const logAction = async (
    action: string,
    tableName: string,
    recordId: string,
    oldData?: any,
    newData?: any
  ) => {
    try {
      const userResponse = await supabase.auth.getUser();
      const userId = userResponse.data.user?.id;
      
      if (!userId) {
        debug.warn("useAuditLog", "No authenticated user found, cannot log action");
        return null;
      }
      
      const { data, error } = await supabase.rpc('create_audit_log', {
        _user_id: userId,
        _action: action,
        _table_name: tableName,
        _record_id: recordId,
        _old_data: oldData || null,
        _new_data: newData || null
      });

      if (error) {
        debug.error("useAuditLog", "Failed to create audit log", { error, action, tableName, recordId });
        return null;
      }

      debug.log("useAuditLog", "User action logged successfully", { 
        action, tableName, recordId, userId, auditLogId: data 
      });
      
      return data;
    } catch (err) {
      debug.error("useAuditLog", "Exception when logging user action", err);
      return null;
    }
  };
  
  return { logAction };
};


import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FileX, Upload, File as FileIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { generateUniqueFileName, formatBytes } from "@/utils/applicationUtils";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploaderProps {
  applicationId?: string;
  onUploadComplete: (documentUrls: { name: string; path: string; size: number; type: string }[]) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ applicationId, onUploadComplete }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = useCallback(async () => {
    if (!files.length || !user) return;
    
    setUploading(true);
    const uploadedDocs = [];

    try {
      for (const file of files) {
        const uniqueFileName = generateUniqueFileName(file);
        
        // Organize files in user-specific folders
        const filePath = applicationId
          ? `${user.id}/${applicationId}/${uniqueFileName}`
          : `${user.id}/temp/${uniqueFileName}`;

        const { data, error } = await supabase.storage
          .from('application_documents')
          .upload(filePath, file);

        if (error) throw error;
        
        if (data) {
          uploadedDocs.push({
            name: file.name,
            path: filePath,
            size: file.size,
            type: file.type
          });
        }
      }

      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${uploadedDocs.length} document(s)`,
      });

      setFiles([]);
      onUploadComplete(uploadedDocs);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your documents.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }, [files, user, applicationId, onUploadComplete, toast]);

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
        <div className="flex flex-col items-center space-y-2">
          <Upload className="h-8 w-8 text-gray-400" />
          <p className="text-sm text-center text-gray-500">
            Drag and drop files here, or click to select files
          </p>
          <input
            type="file"
            multiple
            className="sr-only"
            id="fileInput"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("fileInput")?.click()}
            disabled={uploading}
          >
            Select Files
          </Button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected Files:</p>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  <FileIcon className="h-4 w-4 text-blue-500" />
                  <span>{file.name} ({formatBytes(file.size)})</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                >
                  <FileX className="h-4 w-4 text-red-500" />
                </Button>
              </li>
            ))}
          </ul>

          <Button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="mt-2"
          >
            {uploading ? "Uploading..." : "Upload Files"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;

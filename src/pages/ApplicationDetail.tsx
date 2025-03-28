
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import StatusBadge from "@/components/StatusBadge";
import { mockApplications } from "@/data/mockData";
import { formatDate, formatDateTime } from "@/lib/formatters";
import { ChevronLeft, Clock, FileText, Printer, User } from "lucide-react";

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState("");

  // Find application from mock data
  const application = mockApplications.find((app) => app.id === id);

  if (!application) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Application Not Found</h2>
        <p className="text-gray-600 mt-2">The application you're looking for doesn't exist.</p>
        <Button 
          onClick={() => navigate("/applications")} 
          className="mt-4"
        >
          Back to Applications
        </Button>
      </div>
    );
  }

  const handleStatusUpdate = (newStatus) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Status Updated",
        description: `Application status has been updated to ${newStatus}.`,
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div>
      <div className="mb-8">
        <Button variant="outline" className="mb-4" onClick={() => navigate(-1)}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-police-dark">{application.referenceNumber}</h1>
            <p className="text-gray-500 mt-1 capitalize">
              {application.applicationType} Check | Submitted {formatDate(application.submissionDate)}
            </p>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0 space-x-2">
            <StatusBadge status={application.status} className="text-sm px-3 py-1" />
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <CardTitle>Application Details</CardTitle>
              <CardDescription>Information about this record check application</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Application Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="capitalize">{application.applicationType} Check</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <StatusBadge status={application.status} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Submission Date</p>
                        <p>{formatDateTime(application.submissionDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Last Updated</p>
                        <p>{formatDateTime(application.lastUpdated)}</p>
                      </div>
                      {application.estimatedCompletionDate && (
                        <div>
                          <p className="text-sm text-gray-500">Estimated Completion</p>
                          <p>{formatDate(application.estimatedCompletionDate)}</p>
                        </div>
                      )}
                      {application.assignedOfficerName && (
                        <div>
                          <p className="text-sm text-gray-500">Assigned Officer</p>
                          <p>{application.assignedOfficerName}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Applicant Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p>{application.applicantName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date of Birth</p>
                        <p>January 15, 1985</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p>jane.applicant@example.com</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p>(555) 123-4567</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Address</p>
                        <p>123 Main Street, Anytown, CA 90210</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Application Purpose</h3>
                    <p>Employment verification for ABC Corporation</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="documents">
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <p className="font-medium">ID_Document.pdf</p>
                            <p className="text-sm text-gray-500">Uploaded on June 15, 2023</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <p className="font-medium">Consent_Form.pdf</p>
                            <p className="text-sm text-gray-500">Uploaded on June 15, 2023</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </div>
                    
                    {hasRole(["administrator", "officer", "verifier"]) && (
                      <div className="mt-6">
                        <Button>
                          Upload Additional Document
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="history">
                  <div className="space-y-6">
                    <div className="relative pl-6 border-l-2 border-gray-200">
                      <div className="absolute -left-[9px] p-1 bg-green-100 rounded-full border-2 border-white">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      </div>
                      <div className="mb-1">
                        <p className="font-medium">Application Submitted</p>
                        <p className="text-sm text-gray-500">{formatDateTime(application.submissionDate)}</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        Application for a {application.applicationType} check was submitted by {application.applicantName}.
                      </p>
                    </div>
                    
                    {application.status !== "pending" && (
                      <div className="relative pl-6 border-l-2 border-gray-200">
                        <div className="absolute -left-[9px] p-1 bg-blue-100 rounded-full border-2 border-white">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        </div>
                        <div className="mb-1">
                          <p className="font-medium">Application Processing</p>
                          <p className="text-sm text-gray-500">{formatDateTime(application.lastUpdated)}</p>
                        </div>
                        <p className="text-sm text-gray-600">
                          Application has been assigned to Officer {application.assignedOfficerName} for processing.
                        </p>
                      </div>
                    )}
                    
                    {(application.status === "approved" || application.status === "rejected") && (
                      <div className="relative pl-6 border-l-2 border-gray-200">
                        <div className={`absolute -left-[9px] p-1 rounded-full border-2 border-white ${
                          application.status === "approved" ? "bg-green-100" : "bg-red-100"
                        }`}>
                          <div className={`h-2 w-2 rounded-full ${
                            application.status === "approved" ? "bg-green-500" : "bg-red-500"
                          }`}></div>
                        </div>
                        <div className="mb-1">
                          <p className="font-medium">Application {application.status === "approved" ? "Approved" : "Rejected"}</p>
                          <p className="text-sm text-gray-500">{formatDateTime(application.lastUpdated)}</p>
                        </div>
                        <p className="text-sm text-gray-600">
                          {application.status === "approved" 
                            ? "Application has been approved. The certificate is ready for download."
                            : "Application has been rejected due to incomplete documentation."
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {hasRole(["administrator", "officer"]) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Officer Actions</CardTitle>
                <CardDescription>Update application status or add notes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Add Notes
                  </label>
                  <Textarea
                    placeholder="Enter notes about this application..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">Assign to Me</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Assign Application</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to assign this application to yourself? You will be responsible for processing it.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                          toast({
                            title: "Application Assigned",
                            description: "This application has been assigned to you.",
                          });
                        }}>
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">Request More Info</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Request Additional Information</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will send a notification to the applicant requesting additional information.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                          toast({
                            title: "Request Sent",
                            description: "Request for additional information has been sent to the applicant.",
                          });
                        }}>
                          Send Request
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      Reject
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reject Application</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to reject this application? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground"
                        onClick={() => handleStatusUpdate("rejected")}
                      >
                        Reject
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>
                      Approve
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Approve Application</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to approve this application? This will generate a certificate and notify the applicant.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleStatusUpdate("approved")}>
                        Approve
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          )}
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Status Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    application.status !== "pending" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Submitted</p>
                    <p className="text-sm text-gray-500">{formatDate(application.submissionDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    application.status === "processing" || application.status === "approved" || application.status === "rejected" 
                      ? "bg-blue-100 text-blue-600" 
                      : "bg-gray-100 text-gray-400"
                  }`}>
                    {application.status === "processing" || application.status === "approved" || application.status === "rejected" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Processing</p>
                    <p className="text-sm text-gray-500">
                      {application.status === "processing" || application.status === "approved" || application.status === "rejected"
                        ? formatDate(application.lastUpdated)
                        : "Pending"
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    application.status === "approved" || application.status === "rejected"
                      ? application.status === "approved" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-400"
                  }`}>
                    {application.status === "approved" || application.status === "rejected" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">
                      {application.status === "rejected" ? "Rejected" : "Completed"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {application.status === "approved" || application.status === "rejected"
                        ? formatDate(application.lastUpdated)
                        : "Pending"
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Applicant Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-police-dark text-white flex items-center justify-center font-semibold">
                  {application.applicantName.charAt(0)}
                </div>
                <div className="ml-4">
                  <p className="font-medium">{application.applicantName}</p>
                  <p className="text-sm text-gray-500">jane.applicant@example.com</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm">(555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm">2 applications</span>
                </div>
              </div>
              
              {hasRole(["administrator", "officer"]) && (
                <Button variant="outline" className="w-full mt-4">
                  Contact Applicant
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;

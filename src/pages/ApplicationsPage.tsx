
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { mockApplications } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem,
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import StatusBadge from "@/components/StatusBadge";
import { Application, ApplicationStatus } from "@/types";
import { FilePlus, Search } from "lucide-react";
import { formatDate } from "@/lib/formatters";
import { useIsMobile } from "@/hooks/use-mobile";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScaleIn } from "@/components/animations/ScaleIn";

const ApplicationsPage = () => {
  const { user, hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const isMobile = useIsMobile();
  
  const userApplications = hasRole("applicant") 
    ? mockApplications.filter(app => app.applicantId === user?.id)
    : mockApplications;
  
  const filteredApplications = userApplications.filter(app => {
    const matchesSearch = 
      app.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesType = typeFilter === "all" || app.applicationType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  const pendingCount = userApplications.filter(app => app.status === "pending").length;
  const processingCount = userApplications.filter(app => app.status === "processing").length;
  const approvedCount = userApplications.filter(app => app.status === "approved").length;
  const rejectedCount = userApplications.filter(app => app.status === "rejected").length;

  return (
    <FadeIn>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-police-dark">Applications</h1>
          <p className="text-gray-500 mt-1">
            Manage and track your record check applications
          </p>
        </div>
        <ScaleIn delay={200}>
          <Button asChild className="mt-4 sm:mt-0 transition-all duration-300 hover:scale-105">
            <Link to="/applications/new">
              <FilePlus className="mr-2 h-4 w-4" />
              New Application
            </Link>
          </Button>
        </ScaleIn>
      </div>
      
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-3">
          <CardTitle>Application History</CardTitle>
          <CardDescription>
            View and manage all your record check applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by reference or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value)}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Application Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="enhanced">Enhanced</SelectItem>
                  <SelectItem value="vulnerable">Vulnerable</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={statusFilter} 
                onValueChange={(value) => setStatusFilter(value as ApplicationStatus | "all")}
              >
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <div className="overflow-x-auto pb-1">
              <TabsList className="mb-6 flex w-full sm:w-auto">
                <TabsTrigger value="all" className="flex-1 sm:flex-none whitespace-nowrap">
                  All ({userApplications.length})
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex-1 sm:flex-none whitespace-nowrap">
                  Pending ({pendingCount})
                </TabsTrigger>
                <TabsTrigger value="processing" className="flex-1 sm:flex-none whitespace-nowrap">
                  Processing ({processingCount})
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex-1 sm:flex-none whitespace-nowrap">
                  Completed ({approvedCount + rejectedCount})
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all">
              <ApplicationsTable applications={filteredApplications} isMobile={isMobile} />
            </TabsContent>
            
            <TabsContent value="pending">
              <ApplicationsTable applications={filteredApplications.filter(app => app.status === "pending")} isMobile={isMobile} />
            </TabsContent>
            
            <TabsContent value="processing">
              <ApplicationsTable applications={filteredApplications.filter(app => app.status === "processing")} isMobile={isMobile} />
            </TabsContent>
            
            <TabsContent value="completed">
              <ApplicationsTable applications={filteredApplications.filter(app => 
                app.status === "approved" || app.status === "rejected"
              )} isMobile={isMobile} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </FadeIn>
  );
};

interface ApplicationsTableProps {
  applications: Application[];
  isMobile: boolean;
}

const ApplicationsTable = ({ applications, isMobile }: ApplicationsTableProps) => {
  if (applications.length === 0) {
    return (
      <FadeIn className="text-center py-8">
        <p className="text-gray-500">No applications found matching your criteria.</p>
      </FadeIn>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      {isMobile ? (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application.id} className="animate-in fade-in-50 border-l-4" style={{ borderLeftColor: getStatusColor(application.status) }}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{application.referenceNumber}</div>
                  <StatusBadge status={application.status} />
                </div>
                <div className="text-sm text-gray-500 mt-1">{application.applicantName}</div>
                <div className="flex justify-between items-center mt-3">
                  <div className="text-xs text-gray-500">
                    {formatDate(application.submissionDate)}
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link to={`/applications/${application.id}`}>View</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference #</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id} className="animate-in fade-in-50 hover:bg-muted/50">
                <TableCell className="font-medium">{application.referenceNumber}</TableCell>
                <TableCell>{application.applicantName}</TableCell>
                <TableCell className="capitalize">{application.applicationType}</TableCell>
                <TableCell>{formatDate(application.submissionDate)}</TableCell>
                <TableCell>
                  <StatusBadge status={application.status} />
                </TableCell>
                <TableCell>{formatDate(application.lastUpdated)}</TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="sm" className="transition-all hover:scale-105">
                    <Link to={`/applications/${application.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

function getStatusColor(status: ApplicationStatus): string {
  switch (status) {
    case 'pending': return '#f59e0b';
    case 'processing': return '#3b82f6';
    case 'approved': return '#10b981';
    case 'rejected': return '#ef4444';
    default: return '#d1d5db';
  }
}

export default ApplicationsPage;

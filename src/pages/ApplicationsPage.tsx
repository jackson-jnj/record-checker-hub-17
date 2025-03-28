
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
import { ApplicationStatus } from "@/types";
import { FilePlus, Search } from "lucide-react";
import { formatDate } from "@/lib/formatters";

const ApplicationsPage = () => {
  const { user, hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  
  // Get applications based on user role
  const userApplications = hasRole("applicant") 
    ? mockApplications.filter(app => app.applicantId === user?.id)
    : mockApplications;
  
  // Apply filters
  const filteredApplications = userApplications.filter(app => {
    const matchesSearch = 
      app.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesType = typeFilter === "all" || app.applicationType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  // Count by status for tabs
  const pendingCount = userApplications.filter(app => app.status === "pending").length;
  const processingCount = userApplications.filter(app => app.status === "processing").length;
  const approvedCount = userApplications.filter(app => app.status === "approved").length;
  const rejectedCount = userApplications.filter(app => app.status === "rejected").length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-police-dark">Applications</h1>
          <p className="text-gray-500 mt-1">
            Manage and track your record check applications
          </p>
        </div>
        <Button asChild className="mt-4 sm:mt-0">
          <Link to="/applications/new">
            <FilePlus className="mr-2 h-4 w-4" />
            New Application
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Application History</CardTitle>
          <CardDescription>
            View and manage all your record check applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
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
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Application Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="enhanced">Enhanced</SelectItem>
                  <SelectItem value="vulnerable">Vulnerable</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
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
          
          {/* Tabs and Table */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All ({userApplications.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
              <TabsTrigger value="processing">Processing ({processingCount})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({approvedCount + rejectedCount})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <ApplicationsTable applications={filteredApplications} />
            </TabsContent>
            
            <TabsContent value="pending">
              <ApplicationsTable applications={filteredApplications.filter(app => app.status === "pending")} />
            </TabsContent>
            
            <TabsContent value="processing">
              <ApplicationsTable applications={filteredApplications.filter(app => app.status === "processing")} />
            </TabsContent>
            
            <TabsContent value="completed">
              <ApplicationsTable applications={filteredApplications.filter(app => 
                app.status === "approved" || app.status === "rejected"
              )} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const ApplicationsTable = ({ applications }) => {
  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No applications found matching your criteria.</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
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
            <TableRow key={application.id}>
              <TableCell className="font-medium">{application.referenceNumber}</TableCell>
              <TableCell>{application.applicantName}</TableCell>
              <TableCell className="capitalize">{application.applicationType}</TableCell>
              <TableCell>{formatDate(application.submissionDate)}</TableCell>
              <TableCell>
                <StatusBadge status={application.status} />
              </TableCell>
              <TableCell>{formatDate(application.lastUpdated)}</TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="sm">
                  <Link to={`/applications/${application.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicationsPage;

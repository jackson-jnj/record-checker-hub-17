
import { useAuth } from "@/contexts/AuthContext";
import StatCard from "@/components/StatCard";
import ApplicationCard from "@/components/ApplicationCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { mockApplications } from "@/data/mockData";
import { BarChart3, Bell, CheckCircle, Clock, FileText, FilePlus, Info, ShieldAlert, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  
  // Filter applications based on user role and get counts
  const userApplications = hasRole("applicant") 
    ? mockApplications.filter(app => app.applicantId === user?.id)
    : mockApplications;
    
  const pendingCount = userApplications.filter(app => app.status === "pending").length;
  const processingCount = userApplications.filter(app => app.status === "processing").length;
  const approvedCount = userApplications.filter(app => app.status === "approved").length;
  const rejectedCount = userApplications.filter(app => app.status === "rejected").length;
  
  // Recent applications
  const recentApplications = [...userApplications].sort((a, b) => 
    new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
  ).slice(0, 3);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-police-dark">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
      </div>
      
      {/* Admin or Officer Alert */}
      {hasRole(["administrator", "officer"]) && (
        <Alert className="mb-6 border-yellow-300 bg-yellow-50">
          <Info className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Attention Required</AlertTitle>
          <AlertDescription className="text-yellow-700">
            There are {pendingCount} pending applications that need your review.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Applicant Alert */}
      {hasRole("applicant") && processingCount > 0 && (
        <Alert className="mb-6 border-blue-300 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Application Update</AlertTitle>
          <AlertDescription className="text-blue-700">
            You have {processingCount} application{processingCount > 1 ? 's' : ''} in processing. Check the status for more details.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Applications" 
          value={userApplications.length}
          icon={FileText}
          description="All time"
        />
        <StatCard 
          title="Pending" 
          value={pendingCount}
          icon={Clock}
          color="yellow"
          description="Awaiting review"
        />
        <StatCard 
          title="Processing" 
          value={processingCount}
          icon={UserCheck}
          color="blue"
          description="Under verification"
        />
        <StatCard 
          title="Completed" 
          value={approvedCount + rejectedCount}
          icon={CheckCircle}
          color="green"
          description={`${approvedCount} approved, ${rejectedCount} rejected`}
        />
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Your most recent record check applications</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/applications">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentApplications.length === 0 ? (
                <div className="py-8 text-center">
                  <FileText className="h-12 w-12 mx-auto text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No applications yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new application.</p>
                  <div className="mt-6">
                    <Button asChild>
                      <Link to="/applications/new">
                        <FilePlus className="mr-2 h-4 w-4" />
                        New Application
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {recentApplications.map((application) => (
                    <ApplicationCard key={application.id} application={application} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions & Info */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full justify-start">
                <Link to="/applications/new">
                  <FilePlus className="mr-2 h-4 w-4" />
                  New Application
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/applications">
                  <FileText className="mr-2 h-4 w-4" />
                  View Applications
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/profile">
                  <UserCheck className="mr-2 h-4 w-4" />
                  Update Profile
                </Link>
              </Button>
              
              {hasRole(["administrator", "officer"]) && (
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/reports">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Generate Reports
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Important Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="notices">
                <TabsList className="w-full">
                  <TabsTrigger value="notices">Notices</TabsTrigger>
                  <TabsTrigger value="help">Help</TabsTrigger>
                </TabsList>
                
                <TabsContent value="notices" className="space-y-4 pt-4">
                  <div className="border rounded-md p-4 space-y-2">
                    <div className="flex items-start">
                      <Bell className="h-5 w-5 text-police-medium mr-2 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">System Maintenance</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Scheduled maintenance on June 30th from 2-4 AM EST. The system will be unavailable during this time.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 space-y-2">
                    <div className="flex items-start">
                      <ShieldAlert className="h-5 w-5 text-police-medium mr-2 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Policy Update</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          New verification requirements for Enhanced and Vulnerable Sector checks effective July 15th.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="help" className="space-y-4 pt-4">
                  <div className="border rounded-md p-4">
                    <h4 className="text-sm font-medium">How to Submit an Application</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Click on "New Application" to start the application process. Make sure to have all required documents ready.
                    </p>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h4 className="text-sm font-medium">Contact Support</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      For assistance, contact our support team at support@policecheck.example.com or call (555) 123-4567.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

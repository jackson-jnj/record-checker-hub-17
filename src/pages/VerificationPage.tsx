
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import StatusBadge from "@/components/StatusBadge";
import { Application } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const mockVerificationQueue = [
  {
    id: "app-001",
    referenceNumber: "CRB-2023-001",
    applicantName: "John Tembo",
    applicationType: "standard",
    status: "processing",
    submissionDate: "2023-05-15T10:30:00",
    assignedOfficerName: "Officer Johnson",
    priority: "medium",
    fee: "150"
  },
  {
    id: "app-002",
    referenceNumber: "CRB-2023-002",
    applicantName: "Sarah Mwanza",
    applicationType: "enhanced",
    status: "processing",
    submissionDate: "2023-05-16T09:15:00",
    assignedOfficerName: "Officer Thompson",
    priority: "high",
    fee: "250"
  },
  {
    id: "app-003",
    referenceNumber: "CRB-2023-003",
    applicantName: "Michael Banda",
    applicationType: "vulnerable",
    status: "processing",
    submissionDate: "2023-05-14T14:45:00",
    assignedOfficerName: "Officer Davies",
    priority: "low",
    fee: "100"
  }
] as (Application & { priority: string; fee: string })[];

const VerificationPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [applications, setApplications] = useState(mockVerificationQueue);
  const navigate = useNavigate();

  const handleAssign = (appId: string) => {
    toast({
      title: "Application assigned",
      description: `Application ${appId} has been assigned to you for verification.`,
    });
  };

  const handleApprove = (appId: string) => {
    setApplications(prev => 
      prev.map(app => app.id === appId ? {...app, status: "approved" as const} : app)
    );
    
    toast({
      title: "Application approved",
      description: `Application ${appId} has been approved successfully.`,
    });
  };

  const handleReject = (appId: string) => {
    setApplications(prev => 
      prev.map(app => app.id === appId ? {...app, status: "rejected" as const} : app)
    );
    
    toast({
      title: "Application rejected",
      description: `Application ${appId} has been rejected.`,
    });
  };

  const filteredApplications = applications.filter(app => 
    app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const goBack = () => {
    navigate(-1);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div 
      className="p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={goBack}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </motion.button>
            <motion.h1 
              className="text-2xl font-bold"
              variants={itemVariants}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Verification Queue
            </motion.h1>
          </div>
          <motion.div 
            className="flex items-center gap-2"
            variants={itemVariants}
          >
            <Input
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </motion.div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Applications</TabsTrigger>
            <TabsTrigger value="high">High Priority</TabsTrigger>
            <TabsTrigger value="medium">Medium Priority</TabsTrigger>
            <TabsTrigger value="low">Low Priority</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Pending Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableCaption>List of applications pending verification</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reference</TableHead>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Fee (ZMW)</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.referenceNumber}</TableCell>
                          <TableCell>{app.applicantName}</TableCell>
                          <TableCell className="capitalize">{app.applicationType}</TableCell>
                          <TableCell>
                            <StatusBadge status={app.status} />
                          </TableCell>
                          <TableCell>{new Date(app.submissionDate).toLocaleDateString()}</TableCell>
                          <TableCell>{app.fee} K</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                app.priority === "high" 
                                  ? "destructive" 
                                  : app.priority === "medium" 
                                    ? "default" 
                                    : "outline"
                              }
                            >
                              {app.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {app.status === "processing" && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handleAssign(app.id)}
                                  >
                                    Assign
                                  </Button>
                                  <Button 
                                    variant="default" 
                                    size="sm" 
                                    onClick={() => handleApprove(app.id)}
                                  >
                                    Approve
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    onClick={() => handleReject(app.id)}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="high" className="mt-4">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>High Priority Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableCaption>High priority applications</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reference</TableHead>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Fee (ZMW)</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications
                        .filter(app => app.priority === "high")
                        .map((app) => (
                          <TableRow key={app.id}>
                            <TableCell className="font-medium">{app.referenceNumber}</TableCell>
                            <TableCell>{app.applicantName}</TableCell>
                            <TableCell className="capitalize">{app.applicationType}</TableCell>
                            <TableCell>
                              <StatusBadge status={app.status} />
                            </TableCell>
                            <TableCell>{new Date(app.submissionDate).toLocaleDateString()}</TableCell>
                            <TableCell>{app.fee} K</TableCell>
                            <TableCell>
                              <Badge variant="destructive">{app.priority}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                {app.status === "processing" && (
                                  <>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => handleAssign(app.id)}
                                    >
                                      Assign
                                    </Button>
                                    <Button 
                                      variant="default" 
                                      size="sm" 
                                      onClick={() => handleApprove(app.id)}
                                    >
                                      Approve
                                    </Button>
                                    <Button 
                                      variant="destructive" 
                                      size="sm" 
                                      onClick={() => handleReject(app.id)}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="medium" className="mt-4">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Medium Priority Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableCaption>Medium priority applications</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reference</TableHead>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Fee (ZMW)</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications
                        .filter(app => app.priority === "medium")
                        .map((app) => (
                          <TableRow key={app.id}>
                            <TableCell className="font-medium">{app.referenceNumber}</TableCell>
                            <TableCell>{app.applicantName}</TableCell>
                            <TableCell className="capitalize">{app.applicationType}</TableCell>
                            <TableCell>
                              <StatusBadge status={app.status} />
                            </TableCell>
                            <TableCell>{new Date(app.submissionDate).toLocaleDateString()}</TableCell>
                            <TableCell>{app.fee} K</TableCell>
                            <TableCell>
                              <Badge variant="default">{app.priority}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                {app.status === "processing" && (
                                  <>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => handleAssign(app.id)}
                                    >
                                      Assign
                                    </Button>
                                    <Button 
                                      variant="default" 
                                      size="sm" 
                                      onClick={() => handleApprove(app.id)}
                                    >
                                      Approve
                                    </Button>
                                    <Button 
                                      variant="destructive" 
                                      size="sm" 
                                      onClick={() => handleReject(app.id)}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="low" className="mt-4">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Low Priority Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableCaption>Low priority applications</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reference</TableHead>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Fee (ZMW)</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications
                        .filter(app => app.priority === "low")
                        .map((app) => (
                          <TableRow key={app.id}>
                            <TableCell className="font-medium">{app.referenceNumber}</TableCell>
                            <TableCell>{app.applicantName}</TableCell>
                            <TableCell className="capitalize">{app.applicationType}</TableCell>
                            <TableCell>
                              <StatusBadge status={app.status} />
                            </TableCell>
                            <TableCell>{new Date(app.submissionDate).toLocaleDateString()}</TableCell>
                            <TableCell>{app.fee} K</TableCell>
                            <TableCell>
                              <Badge variant="outline">{app.priority}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                {app.status === "processing" && (
                                  <>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => handleAssign(app.id)}
                                    >
                                      Assign
                                    </Button>
                                    <Button 
                                      variant="default" 
                                      size="sm" 
                                      onClick={() => handleApprove(app.id)}
                                    >
                                      Approve
                                    </Button>
                                    <Button 
                                      variant="destructive" 
                                      size="sm" 
                                      onClick={() => handleReject(app.id)}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default VerificationPage;

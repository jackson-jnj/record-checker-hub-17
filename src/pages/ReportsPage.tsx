import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Download,
  FileText, 
  PieChart, 
  Users 
} from "lucide-react";
import { 
  BarChart as RechartBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RechartPieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { DateRangePicker } from "@/components/DateRangePicker";
import { Application, ApplicationStatus } from "@/types";
import { toast } from "@/hooks/use-toast";

const mockApplicationData = [
  { month: 'Jan', standard: 65, enhanced: 40, vulnerable: 24 },
  { month: 'Feb', standard: 59, enhanced: 42, vulnerable: 26 },
  { month: 'Mar', standard: 80, enhanced: 52, vulnerable: 31 },
  { month: 'Apr', standard: 81, enhanced: 56, vulnerable: 28 },
  { month: 'May', standard: 56, enhanced: 48, vulnerable: 21 },
  { month: 'Jun', standard: 55, enhanced: 45, vulnerable: 23 },
  { month: 'Jul', standard: 60, enhanced: 50, vulnerable: 27 },
];

const statusData = [
  { name: 'Pending', value: 45, color: '#4f46e5' },
  { name: 'Processing', value: 25, color: '#f59e0b' },
  { name: 'Approved', value: 18, color: '#10b981' },
  { name: 'Rejected', value: 12, color: '#ef4444' },
];

const completionTimeData = [
  { name: 'Standard', value: 3 },
  { name: 'Enhanced', value: 7 },
  { name: 'Vulnerable', value: 5 },
];

const ReportsPage = () => {
  const { hasRole } = useAuth();
  const [reportType, setReportType] = useState("applications");
  const [dateRange, setDateRange] = useState<{ from: Date, to: Date }>({ 
    from: new Date(new Date().setMonth(new Date().getMonth() - 6)), 
    to: new Date() 
  });

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report has been generated.`,
    });
  };

  const handleExportReport = (format: string) => {
    toast({
      title: "Report Exported",
      description: `Report has been exported as ${format.toUpperCase()} file.`,
    });
  };

  if (!hasRole("administrator")) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-2">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <div className="flex items-center gap-2">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="applications">Applications</SelectItem>
                <SelectItem value="users">Users</SelectItem>
                <SelectItem value="processing">Processing Times</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleGenerateReport}>
              Generate Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Applications
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,284</div>
              <p className="text-xs text-muted-foreground">
                +12.5% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Approval Rate
              </CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78.2%</div>
              <p className="text-xs text-muted-foreground">
                +2.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Processing Time
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.5 days</div>
              <p className="text-xs text-muted-foreground">
                -0.8 days from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Application Trends</CardTitle>
                <DateRangePicker onChange={setDateRange} />
              </div>
              <CardDescription>
                Number of applications submitted from {dateRange.from.toLocaleDateString()} to {dateRange.to.toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartBarChart
                    data={mockApplicationData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="standard" fill="#4f46e5" name="Standard" />
                    <Bar dataKey="enhanced" fill="#f59e0b" name="Enhanced" />
                    <Bar dataKey="vulnerable" fill="#10b981" name="Vulnerable" />
                  </RechartBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>
                  Current status distribution of all applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartPieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Completion Time</CardTitle>
                <CardDescription>
                  Average days to complete by application type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartBarChart
                      layout="vertical"
                      data={completionTimeData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#4f46e5" name="Days" />
                    </RechartBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Export Reports</CardTitle>
            <CardDescription>
              Export data in different formats for further analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" onClick={() => handleExportReport('pdf')}>
                <Download className="mr-2 h-4 w-4" />
                Export as PDF
              </Button>
              <Button variant="outline" onClick={() => handleExportReport('csv')}>
                <Download className="mr-2 h-4 w-4" />
                Export as CSV
              </Button>
              <Button variant="outline" onClick={() => handleExportReport('excel')}>
                <Download className="mr-2 h-4 w-4" />
                Export as Excel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;

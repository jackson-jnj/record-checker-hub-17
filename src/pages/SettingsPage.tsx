
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  AlertCircle,
  Bell,
  CheckCircle2,
  HelpCircle,
  LockKeyhole,
  Mail,
  Save,
  Shield,
  Upload
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const SettingsPage = () => {
  const { hasRole } = useAuth();
  const [generalSettings, setGeneralSettings] = useState({
    systemName: "Police Record Check System",
    contactEmail: "admin@recordcheck.gov",
    supportPhone: "1-800-555-1234",
    maintenanceMode: false,
    debugMode: false,
    defaultLanguage: "english",
    autoLogout: "30",
    timezone: "UTC-5",
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "smtp.recordcheck.gov",
    smtpPort: "587",
    smtpUsername: "notifications@recordcheck.gov",
    smtpPassword: "••••••••••••",
    fromEmail: "no-reply@recordcheck.gov",
    emailFooter: "This is an automated message from the Police Record Check System.",
    enableEmailNotifications: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    passwordPolicy: "strong",
    minPasswordLength: "12",
    requireSpecialChars: true,
    mfaRequired: true,
    sessionTimeout: "60",
    ipRestriction: false,
    allowedIPs: "",
    auditLogRetention: "90",
  });

  const handleSaveGeneralSettings = () => {
    toast({
      title: "Settings Saved",
      description: "General settings have been updated successfully.",
      icon: <CheckCircle2 className="h-4 w-4" />,
    });
  };

  const handleSaveEmailSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Email settings have been updated successfully.",
      icon: <CheckCircle2 className="h-4 w-4" />,
    });
  };

  const handleSaveSecuritySettings = () => {
    toast({
      title: "Settings Saved",
      description: "Security settings have been updated successfully.",
      icon: <CheckCircle2 className="h-4 w-4" />,
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
          <h1 className="text-2xl font-bold">System Settings</h1>
        </div>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure basic system settings and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="systemName">System Name</Label>
                      <Input
                        id="systemName"
                        value={generalSettings.systemName}
                        onChange={(e) => setGeneralSettings({...generalSettings, systemName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="defaultLanguage">Default Language</Label>
                      <Select 
                        value={generalSettings.defaultLanguage} 
                        onValueChange={(value) => 
                          setGeneralSettings({...generalSettings, defaultLanguage: value})
                        }
                      >
                        <SelectTrigger id="defaultLanguage">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={generalSettings.contactEmail}
                        onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supportPhone">Support Phone</Label>
                      <Input
                        id="supportPhone"
                        value={generalSettings.supportPhone}
                        onChange={(e) => setGeneralSettings({...generalSettings, supportPhone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select 
                        value={generalSettings.timezone} 
                        onValueChange={(value) => 
                          setGeneralSettings({...generalSettings, timezone: value})
                        }
                      >
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                          <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                          <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                          <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                          <SelectItem value="UTC+0">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="autoLogout">Auto Logout (minutes)</Label>
                      <Input
                        id="autoLogout"
                        type="number"
                        value={generalSettings.autoLogout}
                        onChange={(e) => setGeneralSettings({...generalSettings, autoLogout: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Temporarily disable the system for maintenance.
                        </p>
                      </div>
                      <Switch
                        id="maintenanceMode"
                        checked={generalSettings.maintenanceMode}
                        onCheckedChange={(checked) => 
                          setGeneralSettings({...generalSettings, maintenanceMode: checked})
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="debugMode">Debug Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable detailed logging for troubleshooting.
                        </p>
                      </div>
                      <Switch
                        id="debugMode"
                        checked={generalSettings.debugMode}
                        onCheckedChange={(checked) => 
                          setGeneralSettings({...generalSettings, debugMode: checked})
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveGeneralSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>
                  Configure email server settings and notification templates.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpServer">SMTP Server</Label>
                      <Input
                        id="smtpServer"
                        value={emailSettings.smtpServer}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpServer: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input
                        id="smtpPort"
                        value={emailSettings.smtpPort}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpUsername">SMTP Username</Label>
                      <Input
                        id="smtpUsername"
                        value={emailSettings.smtpUsername}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">SMTP Password</Label>
                      <Input
                        id="smtpPassword"
                        type="password"
                        value={emailSettings.smtpPassword}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fromEmail">From Email</Label>
                      <Input
                        id="fromEmail"
                        type="email"
                        value={emailSettings.fromEmail}
                        onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emailFooter">Email Footer</Label>
                    <Textarea
                      id="emailFooter"
                      value={emailSettings.emailFooter}
                      onChange={(e) => setEmailSettings({...emailSettings, emailFooter: e.target.value})}
                      rows={3}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableEmailNotifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable automatic email notifications for status updates.
                      </p>
                    </div>
                    <Switch
                      id="enableEmailNotifications"
                      checked={emailSettings.enableEmailNotifications}
                      onCheckedChange={(checked) => 
                        setEmailSettings({...emailSettings, enableEmailNotifications: checked})
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveEmailSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure security policies and access controls.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="passwordPolicy">Password Policy</Label>
                      <Select 
                        value={securitySettings.passwordPolicy} 
                        onValueChange={(value) => 
                          setSecuritySettings({...securitySettings, passwordPolicy: value})
                        }
                      >
                        <SelectTrigger id="passwordPolicy">
                          <SelectValue placeholder="Select policy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="strong">Strong</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minPasswordLength">Minimum Password Length</Label>
                      <Input
                        id="minPasswordLength"
                        type="number"
                        value={securitySettings.minPasswordLength}
                        onChange={(e) => setSecuritySettings({...securitySettings, minPasswordLength: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="auditLogRetention">Audit Log Retention (days)</Label>
                      <Input
                        id="auditLogRetention"
                        type="number"
                        value={securitySettings.auditLogRetention}
                        onChange={(e) => setSecuritySettings({...securitySettings, auditLogRetention: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="requireSpecialChars">Require Special Characters</Label>
                        <p className="text-sm text-muted-foreground">
                          Require passwords to contain special characters.
                        </p>
                      </div>
                      <Switch
                        id="requireSpecialChars"
                        checked={securitySettings.requireSpecialChars}
                        onCheckedChange={(checked) => 
                          setSecuritySettings({...securitySettings, requireSpecialChars: checked})
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="mfaRequired">Multi-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Require MFA for all user accounts.
                        </p>
                      </div>
                      <Switch
                        id="mfaRequired"
                        checked={securitySettings.mfaRequired}
                        onCheckedChange={(checked) => 
                          setSecuritySettings({...securitySettings, mfaRequired: checked})
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="ipRestriction">IP Restriction</Label>
                        <p className="text-sm text-muted-foreground">
                          Restrict access to specific IP addresses or ranges.
                        </p>
                      </div>
                      <Switch
                        id="ipRestriction"
                        checked={securitySettings.ipRestriction}
                        onCheckedChange={(checked) => 
                          setSecuritySettings({...securitySettings, ipRestriction: checked})
                        }
                      />
                    </div>
                  </div>
                  
                  {securitySettings.ipRestriction && (
                    <div className="space-y-2">
                      <Label htmlFor="allowedIPs">Allowed IP Addresses</Label>
                      <Textarea
                        id="allowedIPs"
                        value={securitySettings.allowedIPs}
                        onChange={(e) => setSecuritySettings({...securitySettings, allowedIPs: e.target.value})}
                        placeholder="Enter IP addresses or ranges, one per line"
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter IP addresses or CIDR ranges, one per line (e.g., 192.168.1.1, 10.0.0.0/24)
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSecuritySettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;

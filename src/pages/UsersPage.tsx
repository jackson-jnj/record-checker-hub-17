
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Edit, Trash, RefreshCw } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { User, UserRole } from "@/types";
import { toast } from "@/components/ui/use-toast";
import ManageUsersComponent from "@/components/ManageUsersComponent";

interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "inactive";
  lastLogin?: string;
}

const UsersPage = () => {
  const { user: currentUser, hasRole } = useAuth();
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserListItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Query profiles directly and join with user_roles
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          user_roles (
            role
          )
        `);

      if (error) throw error;

      // Separately fetch email addresses from auth.users using admin API
      const usersWithEmails: UserListItem[] = [];
      
      for (const profile of data) {
        try {
          // Get user details from auth.users using admin API or fetch from session
          // Note: This is a workaround since we can't directly query auth.users
          const { data: authUserData } = await supabase.auth.admin.getUserById(profile.id);
          
          if (authUserData?.user) {
            usersWithEmails.push({
              id: profile.id,
              name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
              email: authUserData.user.email || '',
              role: profile.user_roles?.role as UserRole || 'applicant',
              status: 'active',
              lastLogin: authUserData.user.last_sign_in_at || '-'
            });
          }
        } catch (error) {
          console.error(`Error fetching user email for ${profile.id}:`, error);
        }
      }

      setUsers(usersWithEmails);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    setIsUpdating(true);
    
    try {
      // Update the user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: editingUser.id,
          role: editingUser.role
        });
        
      if (roleError) throw roleError;
      
      toast({
        title: "User updated",
        description: `${editingUser.name}'s role has been updated to ${editingUser.role}.`,
      });
      
      // Refresh user list
      fetchUsers();
      
      // Close dialog
      setEditingUser(null);
    } catch (error) {
      console.error("Failed to update user:", error);
      toast({
        title: "Update Failed",
        description: (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeactivateUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: 'applicant' })
        .eq('user_id', id);
        
      if (error) throw error;
      
      toast({
        title: "User deactivated",
        description: "The user's privileges have been revoked.",
        variant: "default"
      });
      
      // Refresh the user list
      fetchUsers();
    } catch (error) {
      console.error("Failed to deactivate user:", error);
      toast({
        title: "Operation Failed",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold">User Management</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-8"
              />
            </div>
            <Button variant="outline" onClick={fetchUsers}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <ManageUsersComponent />
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>System Users</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-police-dark"></div>
              </div>
            ) : (
              <Table>
                <TableCaption>A list of all system users</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="capitalize">{user.role}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.status === "active" ? "default" : "secondary"}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {typeof user.lastLogin === "string" && user.lastLogin !== "-" 
                            ? new Date(user.lastLogin).toLocaleString() 
                            : user.lastLogin}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog open={editingUser?.id === user.id} onOpenChange={(open) => {
                              if (!open) setEditingUser(null);
                            }}>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setEditingUser(user)}
                                disabled={user.id === currentUser?.id}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {editingUser && (
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit User</DialogTitle>
                                    <DialogDescription>
                                      Update user information and permissions.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="edit-name" className="text-right">
                                        Name
                                      </Label>
                                      <Input
                                        id="edit-name"
                                        value={editingUser.name}
                                        readOnly
                                        className="col-span-3 bg-gray-50"
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="edit-email" className="text-right">
                                        Email
                                      </Label>
                                      <Input
                                        id="edit-email"
                                        type="email"
                                        value={editingUser.email}
                                        readOnly
                                        className="col-span-3 bg-gray-50"
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="edit-role" className="text-right">
                                        Role
                                      </Label>
                                      <Select 
                                        value={editingUser.role} 
                                        onValueChange={(value) => 
                                          setEditingUser({...editingUser, role: value as UserRole})
                                        }
                                      >
                                        <SelectTrigger className="col-span-3">
                                          <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="administrator">Administrator</SelectItem>
                                          <SelectItem value="officer">Officer</SelectItem>
                                          <SelectItem value="verifier">Verifier</SelectItem>
                                          <SelectItem value="applicant">Applicant</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button 
                                      type="submit" 
                                      onClick={handleUpdateUser}
                                      disabled={isUpdating}
                                    >
                                      {isUpdating ? "Updating..." : "Update User"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              )}
                            </Dialog>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeactivateUser(user.id)}
                              disabled={user.id === currentUser?.id || user.role === 'applicant'}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsersPage;

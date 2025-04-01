
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, UserRole } from '@/types';
import ManageUsersComponent from '@/components/ManageUsersComponent';
import { toast } from '@/components/ui/use-toast';

export type UserWithRole = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

const UsersPage = () => {
  const { user, hasRole } = useAuth();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // First get all profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*');

        if (profilesError) {
          throw profilesError;
        }

        // Then get roles for those profiles
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('*');

        if (rolesError) {
          throw rolesError;
        }

        // Then get user emails from auth (this is an admin API call)
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
          throw authError;
        }

        // Combine the data
        const mappedUsers = profiles.map(profile => {
          const userRoles = roles.filter(r => r.user_id === profile.id);
          const authUser = authUsers.users.find(u => u.id === profile.id);
          
          return {
            id: profile.id,
            name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
            email: authUser?.email || '',
            role: userRoles.length > 0 ? userRoles[0].role as UserRole : 'applicant',
            createdAt: profile.created_at
          };
        });

        setUsers(mappedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: 'Error',
          description: 'Failed to load users. Please try again later.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    if (hasRole('administrator')) {
      fetchUsers();
    }
  }, [hasRole]);

  const filteredUsers = activeTab === 'all' 
    ? users 
    : users.filter(u => u.role === activeTab);

  if (!hasRole('administrator')) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>User Management | Police Record Check Portal</title>
      </Helmet>

      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">User Management</h1>
          <ManageUsersComponent />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Users</TabsTrigger>
                <TabsTrigger value="administrator">Administrators</TabsTrigger>
                <TabsTrigger value="officer">Officers</TabsTrigger>
                <TabsTrigger value="verifier">Verifiers</TabsTrigger>
                <TabsTrigger value="applicant">Applicants</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab}>
                {loading ? (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-police-dark"></div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredUsers.length === 0 ? (
                      <p className="text-center py-4 text-gray-500">No users found.</p>
                    ) : (
                      filteredUsers.map((user) => (
                        <div 
                          key={user.id} 
                          className="p-4 border rounded-lg flex justify-between items-center"
                        >
                          <div>
                            <h3 className="font-medium">{user.name}</h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              user.role === 'administrator' ? 'destructive' :
                              user.role === 'officer' ? 'default' :
                              user.role === 'verifier' ? 'secondary' : 'outline'
                            }>
                              {user.role}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default UsersPage;

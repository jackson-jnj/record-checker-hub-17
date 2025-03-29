
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { mockNotifications } from "@/data/mockData";
import { Shield } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  
  const userNotifications = mockNotifications.filter(n => n.userId === user?.id);
  const unreadCount = userNotifications.filter(n => !n.read).length;

  // Toggle sidebar and dispatch custom event
  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    
    // Dispatch event for Layout and Sidebar components to listen to
    window.dispatchEvent(new CustomEvent('sidebar-toggle', { 
      detail: { open: newState } 
    }));
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  // Listen for sidebar events from other components
  useEffect(() => {
    const handleSidebarEvent = (event: CustomEvent) => {
      setIsSidebarOpen(event.detail.open);
    };

    window.addEventListener('sidebar-toggle', handleSidebarEvent as EventListener);
    
    return () => {
      window.removeEventListener('sidebar-toggle', handleSidebarEvent as EventListener);
    };
  }, []);

  return (
    <header className="bg-white border-b border-police-border sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            className="mr-2 text-gray-500 hover:text-gray-600 focus:ring-2 focus:ring-police-medium md:hidden"
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>
          
          <button onClick={handleLogoClick} className="flex items-center transition-all duration-300 hover:scale-105">
            <Shield className="h-8 w-8 text-police-dark" />
            <span className="ml-2 font-bold text-lg text-police-dark hidden md:block">Record Check</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-police-danger rounded-full text-white text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {userNotifications.length === 0 ? (
                <div className="py-2 px-4 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                userNotifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="py-2 px-4 cursor-pointer">
                    <Link to={notification.link || "#"} className="w-full">
                      <div className={`text-sm font-medium ${notification.read ? 'text-gray-700' : 'text-police-dark font-semibold'}`}>
                        {notification.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{notification.message}</div>
                      <div className="text-xs text-gray-400 mt-2">
                        {new Date(notification.date).toLocaleString()}
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar>
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuLabel>
                <div>{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;


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
import { ScaleIn } from "@/components/animations/ScaleIn";
import { FadeIn } from "@/components/animations/FadeIn";

const Navbar = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  
  // Get mock data for notifications
  const mockUser = mockNotifications[0]?.userId || '';
  const userNotifications = mockNotifications.filter(n => n.userId === mockUser);
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
      <FadeIn duration={800} className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            className="mr-2 text-gray-500 hover:text-gray-600 focus:ring-2 focus:ring-police-medium md:hidden transition-transform duration-300 ease-in-out"
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5 animate-in fade-in duration-300" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5 animate-in fade-in duration-300" aria-hidden="true" />
            )}
          </Button>
          
          <ScaleIn delay={100}>
            <button 
              onClick={handleLogoClick} 
              className="flex items-center transition-all duration-300 hover:scale-105 relative overflow-hidden group"
            >
              <Shield className="h-8 w-8 text-police-dark transition-transform duration-500 group-hover:rotate-12" />
              <span className="ml-2 font-bold text-lg text-police-dark hidden md:block relative">
                Record Check
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-police-medium transition-all duration-300 group-hover:w-full"></span>
              </span>
            </button>
          </ScaleIn>
        </div>
        
        <ScaleIn delay={200}>
          <div className="flex items-center space-x-4">
            <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative transition-all duration-300 hover:bg-police-background">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-police-danger rounded-full text-white text-xs flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-white">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {userNotifications.length === 0 ? (
                  <div className="py-2 px-4 text-center text-gray-500">
                    No notifications
                  </div>
                ) : (
                  userNotifications.map((notification, index) => (
                    <FadeIn key={notification.id} delay={index * 50} direction="up">
                      <DropdownMenuItem className="py-2 px-4 cursor-pointer hover:bg-police-background transition-colors duration-200">
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
                    </FadeIn>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full overflow-hidden transition-transform duration-300 hover:scale-110">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" alt="User" className="object-cover" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuLabel>
                  <div>User</div>
                  <div className="text-xs text-gray-500">user@example.com</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer transition-colors duration-200 hover:bg-police-background">
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer transition-colors duration-200 hover:bg-police-background">
                  <Link to="/login">Login</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </ScaleIn>
      </FadeIn>
    </header>
  );
};

export default Navbar;

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home, 
  FileText, 
  ClipboardCheck, 
  User, 
  Settings, 
  Shield, 
  Users, 
  BarChart3,
  Menu,
  X
} from "lucide-react";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  roles: string[];
  badge?: number;
}

const Sidebar = () => {
  const location = useLocation();
  const { user, hasRole } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const getNavigationItems = (): NavigationItem[] => {
    const items: NavigationItem[] = [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: Home,
        roles: ["administrator", "officer", "applicant", "verifier"],
      },
      {
        name: "Applications",
        href: "/applications",
        icon: FileText,
        roles: ["administrator", "officer", "applicant", "verifier"],
      }
    ];
    
    if (hasRole(["administrator", "officer"])) {
      items.push({
        name: "Verification Queue",
        href: "/verification",
        icon: ClipboardCheck,
        badge: hasRole("officer") ? 5 : undefined,
        roles: ["administrator", "officer"],
      });
    }
    
    if (hasRole("administrator")) {
      items.push(
        {
          name: "User Management",
          href: "/users",
          icon: Users,
          roles: ["administrator"],
        },
        {
          name: "Reports",
          href: "/reports",
          icon: BarChart3,
          roles: ["administrator"],
        },
        {
          name: "Settings",
          href: "/settings",
          icon: Settings,
          roles: ["administrator"],
        }
      );
    }
    
    items.push({
      name: "Profile",
      href: "/profile",
      icon: User,
      roles: ["administrator", "officer", "applicant", "verifier"],
    });
    
    return items.filter(item => 
      item.roles.some(role => hasRole(role as any))
    );
  };
  
  const navigationItems = getNavigationItems();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
          onClick={toggleMobileSidebar}
        />
      )}
      
      <button
        className="md:hidden fixed bottom-4 right-4 p-3 rounded-full bg-police-medium text-white shadow-lg z-30"
        onClick={toggleMobileSidebar}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      <aside
        className={cn(
          "bg-police-dark text-white transition-all duration-300 z-30",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "fixed inset-y-0 left-0" : "hidden md:block"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center justify-between">
            <div className={cn("flex items-center", isCollapsed && "justify-center w-full")}>
              <Shield className="w-8 h-8 text-white" />
              {!isCollapsed && (
                <span className="ml-2 font-bold text-lg">Record Check</span>
              )}
            </div>
            <button 
              className={cn("text-white p-1 rounded hover:bg-police-medium", isCollapsed && "hidden")}
              onClick={toggleSidebar}
            >
              <Menu size={20} />
            </button>
          </div>
          
          {!isCollapsed && (
            <div className="px-4 py-2 mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-police-medium text-white flex items-center justify-center font-semibold">
                  {user?.name?.charAt(0)}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium">{user?.name}</div>
                  <div className="text-xs opacity-70 capitalize">{user?.role}</div>
                </div>
              </div>
            </div>
          )}
          
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-md transition-colors",
                      isActive(item.href)
                        ? "bg-police-medium text-white"
                        : "text-gray-300 hover:bg-police-medium/70 hover:text-white",
                      isCollapsed && "justify-center"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", isCollapsed ? "mx-auto" : "mr-3")} />
                    {!isCollapsed && (
                      <span className="flex-1">{item.name}</span>
                    )}
                    {!isCollapsed && item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 mt-auto hidden md:block">
            <button
              className={cn(
                "w-full flex items-center justify-center p-2 rounded-md text-sm text-gray-300 hover:bg-police-medium hover:text-white transition-colors",
                isCollapsed && "mx-auto"
              )}
              onClick={toggleSidebar}
            >
              {isCollapsed ? (
                <Menu className="h-5 w-5" />
              ) : (
                <>
                  <Menu className="h-5 w-5 mr-2" /> Collapse
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

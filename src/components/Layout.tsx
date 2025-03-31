
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { FadeIn } from "@/components/animations/FadeIn";
import { useIsMobile, useDeviceType } from "@/hooks/use-mobile";
import { debug } from "@/utils/debugUtils";

const Layout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  const deviceType = useDeviceType();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Close sidebar by default on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
    debug.log("Layout", "Device type changed", { deviceType, isMobile, isSidebarOpen: isMobile ? false : true });
  }, [isMobile, deviceType]);

  // Listen for sidebar toggle events
  useEffect(() => {
    const handleSidebarEvent = (event: CustomEvent) => {
      setIsSidebarOpen(event.detail.open);
      debug.log("Layout", "Sidebar toggle event received", { open: event.detail.open });
    };

    window.addEventListener('sidebar-toggle', handleSidebarEvent as EventListener);
    
    return () => {
      window.removeEventListener('sidebar-toggle', handleSidebarEvent as EventListener);
    };
  }, []);

  return (
    <div className="app-container flex h-screen overflow-hidden">
      <Sidebar />
      <div 
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ease-in-out ${
          isSidebarOpen && !isMobile ? 'md:ml-64' : 'md:ml-20'
        }`}
      >
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-police-background">
          <FadeIn duration={500} className={`page-container ${isMobile ? 'px-2 py-4' : 'px-4 py-8'}`}>
            <Outlet />
          </FadeIn>
        </main>
      </div>
    </div>
  );
};

export default Layout;

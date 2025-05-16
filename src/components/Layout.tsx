
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { FadeIn } from "@/components/animations/FadeIn";
import { useUserSync } from "@/hooks/useUserSync";
import { useToast } from "@/hooks/use-toast";

const Layout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Sync user session with Supabase
  useUserSync();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Listen for sidebar toggle events
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
    <div className="app-container flex h-screen overflow-hidden">
      <Sidebar />
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-0' : 'md:ml-0'}`}>
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-police-background">
          <FadeIn duration={500} className="page-container">
            <Outlet />
          </FadeIn>
        </main>
      </div>
    </div>
  );
};

export default Layout;

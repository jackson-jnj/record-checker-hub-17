
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { FadeIn } from "@/components/animations/FadeIn";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

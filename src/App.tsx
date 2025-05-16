import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import ApplicationsPage from "./pages/ApplicationsPage";
import ApplicationForm from "./pages/ApplicationForm";
import ApplicationDetail from "./pages/ApplicationDetail";
import Profile from "./pages/Profile";
import LoginPage from "./pages/LoginPage";
import VerificationPage from "./pages/VerificationPage";
import UsersPage from "./pages/UsersPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import Layout from "./components/Layout";
import { UserRole } from "./types";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Dashboard and other pages */}
            <Route path="/dashboard" element={<Layout />}>
              <Route index element={<Dashboard />} />
            </Route>
            
            {/* Applications routes */}
            <Route path="/applications" element={<Layout />}>
              <Route index element={<ApplicationsPage />} />
              <Route path="new" element={<ApplicationForm />} />
              <Route path=":id" element={<ApplicationDetail />} />
            </Route>
            
            {/* Verification routes */}
            <Route path="/verification" element={<Layout />}>
              <Route index element={<VerificationPage />} />
            </Route>
            
            {/* Admin routes */}
            <Route path="/users" element={<Layout />}>
              <Route index element={<UsersPage />} />
            </Route>
            
            <Route path="/reports" element={<Layout />}>
              <Route index element={<ReportsPage />} />
            </Route>
            
            <Route path="/settings" element={<Layout />}>
              <Route index element={<SettingsPage />} />
            </Route>
            
            {/* Profile page */}
            <Route path="/profile" element={<Layout />}>
              <Route index element={<Profile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

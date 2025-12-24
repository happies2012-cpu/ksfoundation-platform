import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute, AdminRoute } from "@/components/auth/ProtectedRoute";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { useRealtimeStore } from "@/store";
import { useEffect } from "react";
import Index from "./pages/Index";
import VPSHosting from "./pages/VPSHosting";
import WordPressHosting from "./pages/WordPressHosting";
import CloudHosting from "./pages/CloudHosting";
import Domains from "./pages/Domains";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import VPSDetail from "./pages/VPSDetail";
import Admin from "./pages/Admin";
import Settings from "./pages/Settings";
import Billing from "./pages/Billing";
import Profile from "./pages/Profile";
import Workspaces from "./pages/Workspaces";
import WorkspaceDetail from "./pages/WorkspaceDetail";
import Tasks from "./pages/Tasks";
import BillingPlans from "./pages/BillingPlans";
import AiLab from "./pages/AiLab";
import IndustryDetail from "./pages/IndustryDetail";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAudit from "./pages/admin/AdminAudit";
import UserSettings from "./pages/settings/UserSettings";
import SecuritySettings from "./pages/settings/SecuritySettings";
import BillingHistory from "./pages/settings/BillingHistory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  // Initialize realtime store simulation
  const simulateRealtimeUpdates = useRealtimeStore(state => state.simulateRealtimeUpdates);

  useEffect(() => {
    simulateRealtimeUpdates();
  }, [simulateRealtimeUpdates]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/vps" element={<VPSHosting />} />
      <Route path="/wordpress-hosting" element={<WordPressHosting />} />
      <Route path="/cloud-hosting" element={<CloudHosting />} />
      <Route path="/domains" element={<Domains />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route
        path="/ai-lab"
        element={
          <ProtectedRoute requiredPermission={{ resource: 'ai-lab', action: 'read' }}>
            <AiLab />
          </ProtectedRoute>
        }
      />
      <Route
        path="/industries/:id"
        element={
          <ProtectedRoute>
            <IndustryDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/workspaces"
        element={
          <ProtectedRoute>
            <Workspaces />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/workspaces/:workspaceId"
        element={
          <ProtectedRoute>
            <WorkspaceDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/workspaces/:workspaceId/tasks"
        element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/vps/:id"
        element={
          <ProtectedRoute>
            <VPSDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/billing"
        element={
          <ProtectedRoute>
            <Billing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/billing/plans"
        element={
          <ProtectedRoute>
            <BillingPlans />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/audit"
        element={
          <AdminRoute>
            <AdminAudit />
          </AdminRoute>
        }
      />
      <Route
        path="/settings/profile"
        element={
          <ProtectedRoute requiredPermission={{ resource: 'settings', action: 'read' }}>
            <UserSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/security"
        element={
          <ProtectedRoute requiredPermission={{ resource: 'settings', action: 'read' }}>
            <SecuritySettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/billing"
        element={
          <ProtectedRoute requiredPermission={{ resource: 'billing', action: 'read' }}>
            <BillingHistory />
          </ProtectedRoute>
        }
      />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;


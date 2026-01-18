import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MarketingPage from "./pages/Marketing";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute, AdminRoute } from "@/components/auth/ProtectedRoute";
import { useRealtimeStore } from "@/store";
import { LoadingFallback } from "@/components/common/LoadingFallback";
import "./i18n"; // Import i18n configuration

// Lazy Load Pages
const Index = lazy(() => import("./pages/Index"));
const VPSHosting = lazy(() => import("./pages/VPSHosting"));
const WordPressHosting = lazy(() => import("./pages/WordPressHosting"));
const CloudHosting = lazy(() => import("./pages/CloudHosting"));
const Domains = lazy(() => import("./pages/Domains"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const VPSDetail = lazy(() => import("./pages/VPSDetail"));
const Admin = lazy(() => import("./pages/Admin"));
const Settings = lazy(() => import("./pages/Settings"));
const Billing = lazy(() => import("./pages/Billing"));
const Profile = lazy(() => import("./pages/Profile"));
const Workspaces = lazy(() => import("./pages/Workspaces"));
const WorkspaceDetail = lazy(() => import("./pages/WorkspaceDetail"));
const Tasks = lazy(() => import("./pages/Tasks"));
const BillingPlans = lazy(() => import("./pages/BillingPlans"));
const AiLab = lazy(() => import("./pages/AiLab"));
const IndustryDetail = lazy(() => import("./pages/IndustryDetail"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminAudit = lazy(() => import("./pages/admin/AdminAudit"));
const UserSettings = lazy(() => import("./pages/settings/UserSettings"));
const SecuritySettings = lazy(() => import("./pages/settings/SecuritySettings"));
const BillingHistory = lazy(() => import("./pages/settings/BillingHistory"));
const DebugDB = lazy(() => import("./pages/DebugDB"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AppRoutes = () => {
  const simulateRealtimeUpdates = useRealtimeStore(state => state.simulateRealtimeUpdates);

  useEffect(() => {
    simulateRealtimeUpdates();
  }, [simulateRealtimeUpdates]);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/marketing" element={<MarketingPage />} />
        <Route path="/vps" element={<VPSHosting />} />
        <Route path="/wordpress-hosting" element={<WordPressHosting />} />
        <Route path="/cloud-hosting" element={<CloudHosting />} />
        <Route path="/domains" element={<Domains />} />
        <Route path="/billing" element={<BillingPlans />} />
        <Route path="/debug" element={<DebugDB />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Protected Routes */}
        <Route path="/ai-lab" element={<ProtectedRoute requiredPermission={{ resource: 'ai-lab', action: 'read' }}><AiLab /></ProtectedRoute>} />
        <Route path="/industries/:id" element={<ProtectedRoute><IndustryDetail /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/workspaces" element={<ProtectedRoute><Workspaces /></ProtectedRoute>} />
        <Route path="/dashboard/workspaces/:workspaceId" element={<ProtectedRoute><WorkspaceDetail /></ProtectedRoute>} />
        <Route path="/dashboard/workspaces/:workspaceId/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
        <Route path="/dashboard/vps/:id" element={<ProtectedRoute><VPSDetail /></ProtectedRoute>} />
        <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/dashboard/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
        <Route path="/dashboard/billing/plans" element={<ProtectedRoute><BillingPlans /></ProtectedRoute>} />

        {/* Settings Sub-routes */}
        <Route path="/settings/profile" element={<ProtectedRoute requiredPermission={{ resource: 'settings', action: 'read' }}><UserSettings /></ProtectedRoute>} />
        <Route path="/settings/security" element={<ProtectedRoute requiredPermission={{ resource: 'settings', action: 'read' }}><SecuritySettings /></ProtectedRoute>} />
        <Route path="/settings/billing" element={<ProtectedRoute requiredPermission={{ resource: 'billing', action: 'read' }}><BillingHistory /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/audit" element={<AdminRoute><AdminAudit /></AdminRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => {
  return (
    <div className="bg-premium-animate min-h-screen text-foreground antialiased relative selection:bg-primary selection:text-white">
      <div className="noise-overlay" />
      <div className="relative z-10">
        <QueryClientProvider client={queryClient}>
          <HelmetProvider>
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
              <AuthProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <AppRoutes />
                  </BrowserRouter>
                </TooltipProvider>
              </AuthProvider>
            </ThemeProvider>
          </HelmetProvider>
        </QueryClientProvider>
      </div>
    </div>
  );
};

export default App;

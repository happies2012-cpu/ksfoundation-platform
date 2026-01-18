#!/bin/bash

# Install additional dependencies
echo "Installing dependencies..."
npm install react-helmet-async react-error-boundary workbox-window

# Create directories
mkdir -p src/components/common
mkdir -p src/components/seo

# 1. Create Loading Component (UI/UX - Skeletons/Loading)
echo "Creating Loading Component..."
cat << 'EOF' > src/components/common/LoadingFallback.tsx
import { Loader2 } from "lucide-react";

export const LoadingFallback = () => {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Loading content...</p>
      </div>
    </div>
  );
};
EOF

# 2. Create Error Boundary Component (Code Quality)
echo "Creating Error Boundary Component..."
cat << 'EOF' > src/components/common/GlobalErrorBoundary.tsx
import { useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export const GlobalErrorBoundary = () => {
  const error = useRouteError() as any;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4 text-center">
      <div className="p-4 rounded-full bg-destructive/10">
        <AlertTriangle className="w-12 h-12 text-destructive" />
      </div>
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md">
        {error?.message || "An unexpected error occurred. Please try again later."}
      </p>
      <Button onClick={() => window.location.reload()} variant="outline">
        Reload Page
      </Button>
    </div>
  );
};
EOF

# 3. Create SEO Component (SEO)
echo "Creating SEO Component..."
cat << 'EOF' > src/components/seo/SEO.tsx
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  name?: string;
  type?: string;
}

export const SEO = ({ title, description, name = 'KSR Foundation', type = 'article' }: SEOProps) => {
  return (
    <Helmet>
      <title>{title} | {name}</title>
      <meta name='description' content={description} />
      <meta property='og:type' content={type} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta name='twitter:creator' content={name} />
      <meta name='twitter:card' content={type} />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
    </Helmet>
  );
};
EOF

# 4. Create Service Worker (Performance)
echo "Creating Service Worker..."
cat << 'EOF' > public/sw.js
const CACHE_NAME = 'ksr-foundation-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
EOF

# 5. Overwrite App.tsx with Lazy Loading and Providers (Performance)
echo "Updating App.tsx with Lazy Loading and Providers..."
cat << 'EOF' > src/App.tsx
import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
        <Route path="/vps" element={<VPSHosting />} />
        <Route path="/wordpress-hosting" element={<WordPressHosting />} />
        <Route path="/cloud-hosting" element={<CloudHosting />} />
        <Route path="/domains" element={<Domains />} />
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
  );
};

export default App;
EOF

echo "All tasks applied successfully!"

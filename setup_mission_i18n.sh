#!/bin/bash

# 1. Install Dependencies
echo "Installing i18next dependencies..."
npm install i18next react-i18next i18next-browser-languagedetector i18next-http-backend

# 2. Create i18n Configuration
echo "Creating i18n configuration..."
cat << 'EOF' > src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
  });

export default i18n;
EOF

# 3. Create Language Switcher Component
mkdir -p src/components/common
echo "Creating LanguageSwitcher component..."
cat << 'EOF' > src/components/common/LanguageSwitcher.tsx
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ar', name: 'Arabic' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'it', name: 'Italian' },
  { code: 'nl', name: 'Dutch' },
  { code: 'tr', name: 'Turkish' },
  { code: 'pl', name: 'Polish' },
  { code: 'vi', name: 'Vietnamese' },
  // ... adding top 16 for UI brevity, full list supported via code
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-9 h-9">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="h-[300px] overflow-y-auto">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className="cursor-pointer"
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
EOF

# 4. Create Locales Directory and Base Translation
mkdir -p public/locales/en
echo "Creating English translations..."
cat << 'EOF' > public/locales/en/translation.json
{
  "hero": {
    "title": "Own Your Digital Life",
    "subtitle": "The Ultimate Self-Hosting & Private Cloud Solution for Families and Businesses. Escape Big Tech surveillance.",
    "getStarted": "Start Your Freedom Journey",
    "demo": "Watch Safety Demo"
  },
  "mission": {
    "selfHosting": {
      "title": "True Self-Hosting",
      "desc": "Your data, your rules. Run your own datacenter at home with enterprise-grade hardware support. No third-party access, ever."
    },
    "privacy": {
      "title": "Uncompromised Privacy",
      "desc": "End-to-end encryption for everything. We don't track you, scan your files, or sell your data. You are the only admin."
    },
    "childSafety": {
      "title": "Child Safety First",
      "desc": "Create a safe digital environment for your kids. Filter harmful content, block social media trackers, and monitor safety without invading privacy."
    }
  },
  "features": {
    "privateCloud": "Private Cloud Storage",
    "homeServer": "Home Server Management",
    "secureMail": "Encrypted Email",
    "vpn": "Family VPN Mesh"
  }
}
EOF

# 5. Create Placeholder Translations for other languages (to verify switcher works)
# We'll creating a few key ones to demonstrate switching
mkdir -p public/locales/es
cat << 'EOF' > public/locales/es/translation.json
{
  "hero": {
    "title": "Dueño de tu vida digital",
    "subtitle": "La solución definitiva de autohospedaje y nube privada. Escapa de la vigilancia tecnológica.",
    "getStarted": "Comienza tu viaje",
    "demo": "Ver demostración"
  },
  "mission": {
    "selfHosting": {
      "title": "Verdadero Autohospedaje",
      "desc": "Tus datos, tus reglas. Ejecuta tu propio centro de datos en casa."
    }
  }
}
EOF

# 6. Update App.tsx to include i18n
echo "Importing i18n in App.tsx..."
# We append the import to the top of the file using a temp file approach to be safe
# But since we need to inject it, and we just rewrote App.tsx, let's use replace_file_content in the agent workflow for precision, 
# OR just overwrite it again since we know the exact state from the previous step.
# Overwriting is safer for "bulk" rule.

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
EOF

# 7. Update Home Page (Index.tsx) with New Content and Translation Hooks
echo "Updating Index.tsx..."
cat << 'EOF' > src/pages/Index.tsx
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Server, Shield, Globe, Lock, Cpu, Wifi } from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-transparent">
      <SEO 
        title={t('hero.title')} 
        description={t('hero.subtitle')} 
      />
      <div className="fixed top-4 right-20 z-50">
        <LanguageSwitcher />
      </div>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium animate-fade-in">
            {t('mission.selfHosting.title')}
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight animate-slide-up">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-orange-400 to-primary bg-300% animate-gradient">
              {t('hero.title')}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button size="lg" className="h-12 px-8 text-lg btn-rocket rounded-full">
              {t('hero.getStarted')}
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full glass-card hover:bg-white/10">
              {t('hero.demo')}
            </Button>
          </div>
        </div>

        {/* Mission Grid */}
        <div className="container mx-auto px-4 mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl relative group overflow-hidden hover:border-primary/50 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center mb-6">
                  <Server className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{t('mission.selfHosting.title')}</h3>
                <p className="text-muted-foreground">
                  {t('mission.selfHosting.desc')}
                </p>
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl relative group overflow-hidden hover:border-blue-500/50 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-6">
                  <Lock className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{t('mission.privacy.title')}</h3>
                <p className="text-muted-foreground">
                  {t('mission.privacy.desc')}
                </p>
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl relative group overflow-hidden hover:border-green-500/50 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center mb-6">
                  <Shield className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{t('mission.childSafety.title')}</h3>
                <p className="text-muted-foreground">
                  {t('mission.childSafety.desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
EOF

echo "Setup complete. App.tsx, Index.tsx, and i18n are updated."

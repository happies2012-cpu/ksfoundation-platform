import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Server, Shield, Globe, Lock, Cpu, Wifi } from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import HeroSection from "@/components/home/HeroSection";
import FeaturesGrid from "@/components/home/FeaturesGrid";
import OneClickInstalls from "@/components/home/OneClickInstalls";
import TrustSection from "@/components/home/TrustSection";
import PlanComparison from "@/components/home/PlanComparison";
import TechStackSection from "@/components/home/TechStackSection";
import CTASection from "@/components/home/CTASection";
import DomainSearch from "@/components/home/DomainSearch";
import SponsorsSection from "@/components/home/SponsorsSection";
import SecuritySection from "@/components/home/SecuritySection";
import DataCentersSection from "@/components/home/DataCentersSection";
import LiveChat from "@/components/home/LiveChat";

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
      {/* Sections */}
      <HeroSection />

      <SponsorsSection />

      <div className="container mx-auto px-4 -mt-20 relative z-20">
        <DomainSearch />
      </div>

      <FeaturesGrid />

      <OneClickInstalls />

      <TrustSection />

      <TechStackSection />

      <PlanComparison />

      <SecuritySection />

      <DataCentersSection />

      <CTASection />

      <LiveChat />

      <Footer />
    </div>
  );
};

export default Index;

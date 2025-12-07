import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/home/HeroSection';
import PlanComparison from '@/components/home/PlanComparison';
import FeaturesGrid from '@/components/home/FeaturesGrid';
import DomainSearch from '@/components/home/DomainSearch';
import OneClickInstalls from '@/components/home/OneClickInstalls';
import TrustSection from '@/components/home/TrustSection';
import AdvancedFeaturesSection from '@/components/home/AdvancedFeaturesSection';
import CTASection from '@/components/home/CTASection';
import Footer from '@/components/layout/Footer';
import LiveChat from '@/components/home/LiveChat';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <PlanComparison />
        <FeaturesGrid />
        <DomainSearch />
        <OneClickInstalls />
        <AdvancedFeaturesSection />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
      <LiveChat />
    </div>
  );
};

export default Index;

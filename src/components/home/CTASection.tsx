import { Button } from '@/components/ui/button';
import { Rocket, ArrowRight, Shield, Clock, Headphones } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
      <div className="absolute inset-0 server-pattern opacity-5" />
      
      {/* Glowing Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span className="text-sm font-medium text-success">Limited Time: 23% OFF</span>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6">
            Ready to <span className="gradient-text-orange">Boost</span> Your Team's Productivity?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of teams using our task management platform. Start with our risk-free 14-day trial.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="rocket" size="xl" className="group text-lg">
              <Rocket className="h-6 w-6 group-hover:animate-rocket-launch" />
              Start Free Trial
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="xl" className="text-lg">
              Contact Sales
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-success" />
              14-Day Free Trial
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-success" />
              99.9% Uptime SLA
            </span>
            <span className="flex items-center gap-2">
              <Headphones className="h-5 w-5 text-success" />
              24/7 Expert Support
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

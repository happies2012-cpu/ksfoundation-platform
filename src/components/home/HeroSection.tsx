import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Users, Zap, Clock, ArrowRight, Play, Shield } from 'lucide-react';
import AnimatedTechBackground from './AnimatedTechBackground';

const HeroSection = () => {
  const [uptimeCount, setUptimeCount] = useState(0);
  const [speedCount, setSpeedCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);

  useEffect(() => {
    const animateCounter = (
      setter: React.Dispatch<React.SetStateAction<number>>,
      target: number,
      duration: number
    ) => {
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          setter(target);
          clearInterval(interval);
        } else {
          setter(Math.floor(current * 10) / 10);
        }
      }, duration / steps);
    };

    const timer = setTimeout(() => {
      animateCounter(setUptimeCount, 99.9, 2000);
      animateCounter(setSpeedCount, 100, 2000);
      animateCounter(setCustomersCount, 50, 2000);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Enhanced Background Effects */}
      <AnimatedTechBackground />
      <div className="absolute inset-0 bg-hero-pattern" />
      <div className="absolute inset-0 server-pattern opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Logo Above Title */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="relative">
              <img
                src="/logo512.png"
                alt="KSR Foundation"
                className="h-48 w-48 object-contain animate-pulse-glow"
                style={{ filter: 'drop-shadow(0 0 20px rgba(255, 107, 53, 0.5))' }}
              />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl -z-10 animate-pulse" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="gradient-text-orange">Premium Hosting</span>
            <br />
            <span className="text-foreground">Lightning Fast</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Experience blazing-fast web hosting with 99.9% uptime guarantee.
            VPS, cloud hosting, and domain services powered by cutting-edge technology.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Button variant="rocket" size="xl" className="group">
              <CheckCircle className="h-5 w-5 group-hover:animate-rocket-launch" />
              Get Started Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="xl" className="group">
              <Play className="h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="glass-card p-6 rounded-2xl group hover:border-success/50 transition-all duration-300">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-success/10">
                  <Clock className="h-5 w-5 text-success" />
                </div>
                <span className="text-3xl md:text-4xl font-black gradient-text-green">
                  {uptimeCount}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Uptime Guarantee</p>
            </div>

            <div className="glass-card p-6 rounded-2xl group hover:border-primary/50 transition-all duration-300">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <span className="text-3xl md:text-4xl font-black gradient-text-orange">
                  {speedCount}x
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Productivity Boost</p>
            </div>

            <div className="glass-card p-6 rounded-2xl group hover:border-secondary/50 transition-all duration-300">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Shield className="h-5 w-5 text-secondary" />
                </div>
                <span className="text-3xl md:text-4xl font-black gradient-text-blue">
                  {customersCount}K+
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Teams Empowered</p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 opacity-60">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Trusted by</span>
            <div className="flex items-center gap-8 text-muted-foreground">
              <span className="font-bold text-lg">Slack</span>
              <span className="font-bold text-lg">Notion</span>
              <span className="font-bold text-lg">Trello</span>
              <span className="font-bold text-lg">Asana</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-muted-foreground/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

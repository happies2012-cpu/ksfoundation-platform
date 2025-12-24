import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Cloud, Zap, Shield, Users, Globe, ArrowRight, Cpu, HardDrive } from 'lucide-react';
import { Link } from 'react-router-dom';

const CloudHosting = () => {
  const plans = [
    {
      name: 'Cloud Starter',
      price: '$4.99',
      period: '/month',
      popular: false,
      specs: {
        cpu: '1 vCPU',
        ram: '2GB RAM',
        storage: '20GB SSD',
        bandwidth: '2TB',
      },
      features: [
        'Scalable Resources',
        '99.9% Uptime SLA',
        'Free SSL Certificate',
        '24/7 Support',
        'Daily Backups',
      ],
    },
    {
      name: 'Cloud Professional',
      price: '$9.99',
      period: '/month',
      popular: true,
      specs: {
        cpu: '2 vCPU',
        ram: '4GB RAM',
        storage: '50GB SSD',
        bandwidth: '5TB',
      },
      features: [
        'Scalable Resources',
        '99.9% Uptime SLA',
        'Free SSL Certificate',
        '24/7 Priority Support',
        'Daily Backups',
        'Load Balancing',
        'Auto Scaling',
      ],
    },
    {
      name: 'Cloud Enterprise',
      price: '$19.99',
      period: '/month',
      popular: false,
      specs: {
        cpu: '4 vCPU',
        ram: '8GB RAM',
        storage: '100GB SSD',
        bandwidth: '10TB',
      },
      features: [
        'Scalable Resources',
        '99.9% Uptime SLA',
        'Free SSL Certificate',
        '24/7 Priority Support',
        'Daily Backups',
        'Load Balancing',
        'Auto Scaling',
        'Dedicated IP',
        'Advanced Monitoring',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-primary/10 text-primary">
                <Cloud className="h-4 w-4 mr-1" />
                Enterprise Cloud
              </Badge>
              <h1 className="text-4xl md:text-6xl font-black mb-6">
                Powerful <span className="gradient-text-orange">Cloud Hosting</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Scale effortlessly with our enterprise-grade cloud infrastructure.
                Pay only for what you use with instant scaling.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="rocket" size="lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  View Pricing
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Card className="glass-card p-8 text-center group hover:border-primary/50 transition-all">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Auto Scaling</h3>
                <p className="text-muted-foreground">
                  Automatically scale resources based on demand. Never worry about traffic spikes.
                </p>
              </Card>
              <Card className="glass-card p-8 text-center group hover:border-secondary/50 transition-all">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Enterprise Security</h3>
                <p className="text-muted-foreground">
                  Multi-layer security with DDoS protection and enterprise-grade encryption.
                </p>
              </Card>
              <Card className="glass-card p-8 text-center group hover:border-accent/50 transition-all">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2">Global CDN</h3>
                <p className="text-muted-foreground">
                  Deliver content faster with our global content delivery network.
                </p>
              </Card>
            </div>

            {/* Pricing Plans */}
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-black text-center mb-12">
                Choose Your <span className="gradient-text-orange">Cloud Plan</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                  <Card
                    key={plan.name}
                    className={`glass-card p-8 relative ${
                      plan.popular ? 'border-primary shadow-lg scale-105' : ''
                    }`}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                        Most Popular
                      </Badge>
                    )}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <div className="text-4xl font-black gradient-text-orange mb-1">
                        {plan.price}
                        <span className="text-lg font-normal text-muted-foreground">
                          {plan.period}
                        </span>
                      </div>
                    </div>

                    {/* Specs */}
                    <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-primary" />
                        <span className="text-sm">{plan.specs.cpu}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-primary" />
                        <span className="text-sm">{plan.specs.ram}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-primary" />
                        <span className="text-sm">{plan.specs.storage}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary" />
                        <span className="text-sm">{plan.specs.bandwidth}</span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <Check className="h-5 w-5 text-success flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={plan.popular ? 'rocket' : 'outline'}
                      className="w-full"
                      asChild
                    >
                      <Link to="/signup">Get Started</Link>
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-6">
              Ready to Scale with Cloud Hosting?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience the power of cloud computing with our scalable infrastructure.
            </p>
            <Button variant="rocket" size="lg" asChild>
              <Link to="/signup">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default CloudHosting;

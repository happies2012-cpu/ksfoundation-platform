import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Globe, Zap, Shield, Users, ArrowRight, Cpu, HardDrive, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

const WordPressHosting = () => {
  const plans = [
    {
      name: 'WordPress Starter',
      price: '$4.99',
      period: '/month',
      popular: false,
      specs: {
        sites: '1 Site',
        storage: '10GB SSD',
        bandwidth: '100GB',
        email: '1 Email Account',
      },
      features: [
        'Optimized for WordPress',
        'Free SSL Certificate',
        'Daily Backups',
        '24/7 Support',
        'One-Click Install',
      ],
    },
    {
      name: 'WordPress Pro',
      price: '$9.99',
      period: '/month',
      popular: true,
      specs: {
        sites: '5 Sites',
        storage: '50GB SSD',
        bandwidth: '500GB',
        email: '5 Email Accounts',
      },
      features: [
        'Optimized for WordPress',
        'Free SSL Certificate',
        'Daily Backups',
        'Priority Support',
        'One-Click Install',
        'Staging Area',
        'WP-CLI Access',
      ],
    },
    {
      name: 'WordPress Business',
      price: '$19.99',
      period: '/month',
      popular: false,
      specs: {
        sites: 'Unlimited Sites',
        storage: '100GB SSD',
        bandwidth: 'Unlimited',
        email: 'Unlimited Accounts',
      },
      features: [
        'Optimized for WordPress',
        'Free SSL Certificate',
        'Daily Backups',
        'Priority Support',
        'One-Click Install',
        'Staging Area',
        'WP-CLI Access',
        'Free Domain',
        'SEO Tools',
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
                <Wrench className="h-4 w-4 mr-1" />
                WordPress Hosting
              </Badge>
              <h1 className="text-4xl md:text-6xl font-black mb-6">
                Supercharge Your <span className="gradient-text-orange">WordPress</span> Sites
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Optimized hosting with premium features designed specifically for WordPress.
                Blazing fast performance with automatic updates and security.
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
                <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Optimized servers with LiteSpeed cache for blazing fast WordPress performance.
                </p>
              </Card>
              <Card className="glass-card p-8 text-center group hover:border-secondary/50 transition-all">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Security First</h3>
                <p className="text-muted-foreground">
                  Automatic security updates, malware scanning, and DDoS protection.
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
                Choose Your <span className="gradient-text-orange">WordPress Plan</span>
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
                    <div className="grid gap-3 mb-6 p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary" />
                        <span className="text-sm">{plan.specs.sites}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-primary" />
                        <span className="text-sm">{plan.specs.storage}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary" />
                        <span className="text-sm">{plan.specs.bandwidth}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-sm">{plan.specs.email}</span>
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
              Ready to Launch Your WordPress Site?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get optimized WordPress hosting with all the features you need to succeed.
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

export default WordPressHosting;
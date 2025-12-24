import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Globe, Search, Star, ArrowRight, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Domains = () => {
  const extensions = [
    { name: '.com', price: '$12.99', popular: true },
    { name: '.net', price: '$14.99', popular: false },
    { name: '.org', price: '$16.99', popular: false },
    { name: '.io', price: '$39.99', popular: true },
    { name: '.co', price: '$29.99', popular: false },
    { name: '.ai', price: '$89.99', popular: true },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Free Privacy Protection',
      description: 'Keep your personal information private with free WHOIS privacy.'
    },
    {
      icon: Zap,
      title: 'Instant Activation',
      description: 'Your domain is ready to use immediately after registration.'
    },
    {
      icon: Globe,
      title: 'Global DNS',
      description: 'Fast and reliable DNS servers located worldwide.'
    }
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
                <Globe className="h-4 w-4 mr-1" />
                Domain Registration
              </Badge>
              <h1 className="text-4xl md:text-6xl font-black mb-6">
                Find Your Perfect <span className="gradient-text-orange">Domain Name</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Search millions of domain names and find the perfect one for your business.
                Free privacy protection included with every registration.
              </p>
              
              {/* Domain Search */}
              <div className="max-w-2xl mx-auto">
                <div className="glass-card p-2 flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex items-center">
                    <Search className="h-5 w-5 text-muted-foreground ml-3" />
                    <input
                      type="text"
                      placeholder="Search for a domain..."
                      className="w-full bg-transparent border-0 focus:ring-0 py-4 px-3 text-lg"
                    />
                  </div>
                  <Button variant="rocket" className="px-8 py-6 text-lg">
                    Search
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Free privacy protection and DNS included with every domain
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Extensions */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-black text-center mb-12">
              Popular <span className="gradient-text-orange">Domain Extensions</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
              {extensions.map((ext) => (
                <Card key={ext.name} className="glass-card p-6 text-center hover:border-primary/50 transition-all">
                  <div className="text-2xl font-bold mb-2">{ext.name}</div>
                  <div className="text-2xl font-black gradient-text-orange mb-3">{ext.price}</div>
                  <Button variant={ext.popular ? "rocket" : "outline"} className="w-full text-sm">
                    Select
                  </Button>
                  {ext.popular && (
                    <Badge className="mt-3 bg-primary/10 text-primary text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-black text-center mb-12">
              Why Choose Our <span className="gradient-text-orange">Domain Services</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <Card key={index} className="glass-card p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-black text-center mb-12">
                Domain <span className="gradient-text-orange">Pricing</span>
              </h2>
              <Card className="glass-card overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-8 border-r border-border">
                    <h3 className="text-2xl font-bold mb-4">Registration</h3>
                    <ul className="space-y-4">
                      <li className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-success flex-shrink-0" />
                        <span>Free WHOIS Privacy Protection</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-success flex-shrink-0" />
                        <span>Free DNS Management</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-success flex-shrink-0" />
                        <span>Domain Locking</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-success flex-shrink-0" />
                        <span>Email Forwarding</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-8 bg-muted/30">
                    <h3 className="text-2xl font-bold mb-4">Transfer</h3>
                    <div className="text-4xl font-black gradient-text-orange mb-2">$9.99</div>
                    <p className="text-muted-foreground mb-6">Per domain + 1 year extension</p>
                    <Button variant="rocket" className="w-full" asChild>
                      <Link to="/signup">
                        Transfer Domain
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-6">
              Ready to Register Your Domain?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Find and register your perfect domain name today with free privacy protection.
            </p>
            <Button variant="rocket" size="lg" asChild>
              <Link to="/signup">
                Get Started Now
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

export default Domains;
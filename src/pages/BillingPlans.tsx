import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { subscriptionApi } from '@/lib/api';
import { Check, CreditCard } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const BillingPlans = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for individuals getting started',
      features: [
        '1 workspace',
        'Up to 5 team members',
        'Basic task management',
        'File attachments (10MB)',
        'Email support'
      ],
      cta: 'Current Plan',
      ctaVariant: 'outline' as const,
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$9',
      period: 'per month',
      description: 'Great for small teams and professionals',
      features: [
        'Unlimited workspaces',
        'Up to 25 team members',
        'Advanced task management',
        'File attachments (100MB)',
        'Priority support',
        'Custom branding',
        'Time tracking'
      ],
      cta: 'Upgrade to Pro',
      ctaVariant: 'rocket' as const,
      popular: true
    },
    {
      id: 'team',
      name: 'Team',
      price: '$19',
      period: 'per month',
      description: 'Ideal for growing teams and organizations',
      features: [
        'Unlimited workspaces',
        'Unlimited team members',
        'Advanced task management',
        'File attachments (1GB)',
        '24/7 priority support',
        'Custom branding',
        'Time tracking',
        'Advanced reporting',
        'Single sign-on (SSO)',
        'API access'
      ],
      cta: 'Upgrade to Team',
      ctaVariant: 'default' as const,
      popular: false
    }
  ];

  const handleSubscribe = async (planId: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // In a real implementation, this would redirect to Stripe checkout
      // For demo purposes, we'll simulate a successful subscription
      await subscriptionApi.createSubscription('', '', 'monthly'); // Dummy params for demo
      
      toast({
        title: 'Success',
        description: `You've been subscribed to the ${planId} plan!`,
      });
      
      // Redirect to billing dashboard
      navigate('/dashboard/billing');
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to process subscription.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            <span className="gradient-text-orange">Simple, transparent pricing</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your team. All plans include our core features with no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`glass-card p-8 relative ${
                plan.popular ? 'border-primary ring-2 ring-primary/20' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                <div className="mb-4">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                variant={plan.ctaVariant}
                className="w-full"
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h3 className="font-bold mb-2">Can I change plans later?</h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-bold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards including Visa, Mastercard, American Express, and Discover.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-bold mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground">
                Yes, all plans come with a 14-day free trial. No credit card required to get started.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-bold mb-2">Do you offer discounts for non-profits?</h3>
              <p className="text-muted-foreground">
                Yes, we offer special pricing for non-profit organizations. Contact our sales team for more information.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BillingPlans;
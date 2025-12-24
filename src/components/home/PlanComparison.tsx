import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Users, Zap, Crown, Rocket, Star } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    icon: Zap,
    price: 0,
    period: '/month',
    discount: 'Forever Free',
    popular: false,
    features: [
      '1 Workspace',
      'Up to 5 Team Members',
      'Basic Task Management',
      'File Attachments (10MB)',
      'Email Support',
      '24/7 Community Support',
    ],
    color: 'secondary',
  },
  {
    name: 'Pro',
    icon: Rocket,
    originalPrice: 12.99,
    price: 9.99,
    period: '/month',
    discount: '23% OFF',
    popular: true,
    features: [
      'Unlimited Workspaces',
      'Up to 25 Team Members',
      'Advanced Task Management',
      'File Attachments (100MB)',
      'Priority Support',
      'Custom Branding',
      'Time Tracking',
      'Advanced Reporting',
    ],
    color: 'primary',
  },
  {
    name: 'Team',
    icon: Crown,
    originalPrice: 24.99,
    price: 19.99,
    period: '/month',
    discount: '20% OFF',
    popular: false,
    features: [
      'Unlimited Workspaces',
      'Unlimited Team Members',
      'Advanced Task Management',
      'File Attachments (1GB)',
      '24/7 Priority Support',
      'Custom Branding',
      'Time Tracking',
      'Advanced Reporting',
      'Single Sign-On (SSO)',
      'API Access',
    ],
    color: 'accent',
  },
];

const PlanComparison = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-6">
            <Star className="h-4 w-4 text-success" />
            <span className="text-sm font-medium text-success">Limited Time Offer</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            Choose Your <span className="gradient-text-orange">Perfect Plan</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful task management solutions for every team. All plans include 14-day free trial.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center p-1 rounded-full bg-muted border border-border">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-card text-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                billingCycle === 'yearly'
                  ? 'bg-card text-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Yearly
              <span className="px-2 py-0.5 rounded-full bg-success/20 text-success text-xs font-bold">
                Save 83%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isPopular = plan.popular;
            
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl transition-all duration-500 hover:-translate-y-2 ${
                  isPopular
                    ? 'bg-gradient-to-b from-primary/20 via-card to-card border-2 border-primary glow-orange'
                    : 'bg-card border border-border hover:border-muted-foreground/30'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-xl ${
                      plan.color === 'primary' ? 'bg-primary/10' :
                      plan.color === 'secondary' ? 'bg-secondary/10' : 'bg-accent/10'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        plan.color === 'primary' ? 'text-primary' :
                        plan.color === 'secondary' ? 'text-secondary' : 'text-accent'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                      {plan.discount && (
                        <span className="px-2 py-0.5 rounded bg-success/20 text-success text-xs font-bold">
                          {plan.discount}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl md:text-5xl font-black text-foreground">
                        {plan.price === 0 ? 'Free' : `$${plan.price}`}
                      </span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    {plan.originalPrice && (
                      <p className="text-sm text-muted-foreground mt-1">
                        <span className="line-through">${plan.originalPrice}</span>
                        <span className="ml-2">when you renew</span>
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Button
                    variant={isPopular ? 'rocket' : 'outline'}
                    className="w-full mb-8"
                    size="lg"
                  >
                    Get Started
                  </Button>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                          <Check className="h-3 w-3 text-success" />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Need more features? Check out our{' '}
            <a href="#" className="text-primary hover:underline">Enterprise Plan</a>
            {' '}for custom solutions.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              30-Day Money Back
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              Free Migration
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              24/7 Support
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlanComparison;

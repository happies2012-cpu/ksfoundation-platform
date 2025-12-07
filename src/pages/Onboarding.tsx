import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Server, Shield, Zap, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const steps = [
  {
    id: 1,
    title: 'Welcome to VPS Hosting',
    description: 'Get started with powerful cloud infrastructure',
    icon: Server,
  },
  {
    id: 2,
    title: 'Choose Your Plan',
    description: 'Select the perfect VPS configuration for your needs',
    icon: Zap,
  },
  {
    id: 3,
    title: 'Secure Your Account',
    description: 'Enable two-factor authentication for enhanced security',
    icon: Shield,
  },
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    toast({
      title: 'Welcome aboard!',
      description: 'Your account is ready. Let\'s deploy your first VPS.',
    });
    navigate('/dashboard');
  };

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="glass-card p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center ${
                    step.id < steps.length ? 'flex-1' : ''
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      step.id <= currentStep
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    {step.id < currentStep ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  {step.id < steps.length && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        step.id < currentStep ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-6">
              <currentStepData.icon className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-3xl font-black mb-4">{currentStepData.title}</h2>
            <p className="text-muted-foreground text-lg">
              {currentStepData.description}
            </p>
          </div>

          {/* Step-specific content */}
          {currentStep === 1 && (
            <div className="space-y-4 mb-8">
              <div className="p-4 rounded-xl bg-muted/50">
                <h3 className="font-semibold mb-2">What you can do:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    Deploy VPS instances in seconds
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    Full root access and control
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    Scale resources on demand
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    24/7 support and monitoring
                  </li>
                </ul>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 mb-8">
              <p className="text-muted-foreground">
                You can choose from pre-configured plans or build your own custom VPS.
                All plans include DDoS protection, backups, and full root access.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/vps')}
              >
                Browse Plans
              </Button>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4 mb-8">
              <p className="text-muted-foreground">
                We recommend enabling two-factor authentication to secure your account.
                You can do this later in your account settings.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/dashboard/settings/security')}
              >
                Enable 2FA
              </Button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            <Button
              variant="rocket"
              onClick={handleNext}
              className={currentStep === 1 ? 'w-full' : 'flex-1'}
            >
              {currentStep === steps.length ? 'Get Started' : 'Next'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;


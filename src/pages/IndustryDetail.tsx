import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, TrendingUp, Users, Zap, Shield, Globe, Star } from 'lucide-react';

interface IndustrySolution {
  id: string;
  title: string;
  description: string;
  features: string[];
  pricing: {
    starter: number;
    professional: number;
    enterprise: number;
  };
  technologies: string[];
  caseStudy: {
    company: string;
    results: string[];
    improvement: string;
  };
}

const industryData: Record<string, IndustrySolution> = {
  'ecommerce': {
    id: 'ecommerce',
    title: 'E-commerce Solutions',
    description: 'Complete e-commerce platform with payment processing, inventory management, and customer analytics.',
    features: [
      'Multi-vendor marketplace',
      'Payment gateway integration',
      'Inventory management',
      'Order tracking',
      'Customer analytics',
      'Mobile-responsive design',
      'SEO optimization',
      'Multi-currency support'
    ],
    pricing: {
      starter: 299,
      professional: 599,
      enterprise: 1299
    },
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis', 'AWS'],
    caseStudy: {
      company: 'TechStore Pro',
      results: [
        '300% increase in online sales',
        '50% reduction in cart abandonment',
        '200% improvement in page load speed'
      ],
      improvement: 'ROI increased by 450% in 6 months'
    }
  },
  'healthcare': {
    id: 'healthcare',
    title: 'Healthcare Management',
    description: 'HIPAA-compliant healthcare management system with patient records, appointment scheduling, and telemedicine.',
    features: [
      'HIPAA-compliant patient records',
      'Appointment scheduling',
      'Telemedicine integration',
      'Prescription management',
      'Insurance verification',
      'Medical billing',
      'Secure messaging',
      'Multi-location support'
    ],
    pricing: {
      starter: 499,
      professional: 999,
      enterprise: 1999
    },
    technologies: ['React', 'Python Django', 'MySQL', 'Twilio', 'AWS', 'FHIR'],
    caseStudy: {
      company: 'MedCare Clinic',
      results: [
        '90% reduction in appointment no-shows',
        '75% faster patient check-in process',
        '100% HIPAA compliance achieved'
      ],
      improvement: 'Patient satisfaction increased by 95%'
    }
  },
  'finance': {
    id: 'finance',
    title: 'Financial Services Platform',
    description: 'Secure financial platform with account management, transaction processing, and regulatory compliance.',
    features: [
      'Multi-account management',
      'Real-time transactions',
      'Fraud detection',
      'Regulatory compliance',
      'Investment tracking',
      'Credit scoring',
      'KYC/AML verification',
      'Financial reporting'
    ],
    pricing: {
      starter: 799,
      professional: 1599,
      enterprise: 3199
    },
    technologies: ['React', 'Java Spring', 'PostgreSQL', 'Apache Kafka', 'AWS', 'Blockchain'],
    caseStudy: {
      company: 'FinTech Solutions',
      results: [
        '99.99% transaction accuracy',
        '85% reduction in fraud attempts',
        '60% faster transaction processing'
      ],
      improvement: 'Customer trust score increased by 88%'
    }
  },
  'education': {
    id: 'education',
    title: 'Education Management System',
    description: 'Comprehensive LMS with course management, student tracking, and virtual classroom capabilities.',
    features: [
      'Course management',
      'Student progress tracking',
      'Virtual classrooms',
      'Assignment submission',
      'Gradebook management',
      'Parent portal',
      'Mobile learning',
      'Integration APIs'
    ],
    pricing: {
      starter: 199,
      professional: 399,
      enterprise: 799
    },
    technologies: ['React', 'PHP Laravel', 'MySQL', 'WebRTC', 'AWS', 'SCORM'],
    caseStudy: {
      company: 'EduTech Academy',
      results: [
        '250% increase in student engagement',
        '80% reduction in administrative work',
        '95% course completion rate'
      ],
      improvement: 'Student performance improved by 70%'
    }
  },
  'realestate': {
    id: 'realestate',
    title: 'Real Estate Platform',
    description: 'Property management system with listings, virtual tours, and client relationship management.',
    features: [
      'Property listings',
      'Virtual tours',
      'CRM integration',
      'Document management',
      'Market analytics',
      'Lead tracking',
      'Contract management',
      'Mobile app'
    ],
    pricing: {
      starter: 399,
      professional: 799,
      enterprise: 1599
    },
    technologies: ['React', 'Node.js', 'MongoDB', 'Three.js', 'AWS', 'Google Maps'],
    caseStudy: {
      company: 'Prime Properties',
      results: [
        '400% increase in qualified leads',
        '60% faster property sales',
        '90% client satisfaction rate'
      ],
      improvement: 'Revenue increased by 180% in first year'
    }
  }
};

export default function IndustryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [solution, setSolution] = useState<IndustrySolution | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (id && industryData[id]) {
        setSolution(industryData[id]);
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-64 bg-gray-300 rounded"></div>
                <div className="h-32 bg-gray-300 rounded"></div>
              </div>
              <div className="h-96 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!solution) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Industry Solution Not Found</h1>
            <p className="text-muted-foreground mb-8">The requested industry solution could not be found.</p>
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-4xl font-bold">{solution.title}</h1>
            <p className="text-lg text-muted-foreground">{solution.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {solution.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Case Study */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Success Story
                </CardTitle>
                <CardDescription>
                  Real results from {solution.caseStudy.company}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Key Results:</h4>
                  <ul className="space-y-1">
                    {solution.caseStudy.results.map((result, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="font-medium text-green-800 dark:text-green-200">
                    {solution.caseStudy.improvement}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Technologies */}
            <Card>
              <CardHeader>
                <CardTitle>Technology Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {solution.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Plans</CardTitle>
                <CardDescription>Choose the plan that fits your needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Starter Plan */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Starter</h4>
                    <span className="text-2xl font-bold">${solution.pricing.starter}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Perfect for small businesses</p>
                  <Button className="w-full" size="sm">
                    Get Started
                  </Button>
                </div>

                {/* Professional Plan */}
                <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Professional</h4>
                    <span className="text-2xl font-bold">${solution.pricing.professional}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">For growing companies</p>
                  <Button className="w-full" size="sm">
                    Choose Professional
                  </Button>
                </div>

                {/* Enterprise Plan */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Enterprise</h4>
                    <span className="text-2xl font-bold">${solution.pricing.enterprise}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">For large organizations</p>
                  <Button className="w-full" size="sm">
                    Contact Sales
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Platform Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Customer Satisfaction</span>
                    <span className="text-sm font-medium">98%</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Uptime</span>
                    <span className="text-sm font-medium">99.9%</span>
                  </div>
                  <Progress value={99.9} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Security Score</span>
                    <span className="text-sm font-medium">A+</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


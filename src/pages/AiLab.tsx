import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Brain, Download, Loader2, Sparkles, Code, Database, Shield, Server } from 'lucide-react';

interface ArchitectureService {
  id: string;
  name: string;
  type: 'frontend' | 'backend' | 'database' | 'cache' | 'queue' | 'storage';
  description: string;
  tech: string[];
  scalability: 'low' | 'medium' | 'high';
  cost: number;
}

interface ArchitectureOutput {
  services: ArchitectureService[];
  totalCost: number;
  scalability: string;
  security: string;
  deployment: string;
  architecture: {
    frontend: string[];
    backend: string[];
    database: string[];
    infrastructure: string[];
  };
}

const industries = [
  'E-commerce',
  'Healthcare',
  'Finance',
  'Education',
  'Real Estate',
  'Travel & Tourism',
  'Manufacturing',
  'Media & Entertainment',
  'Logistics',
  'SaaS',
];

const securityLevels = [
  { value: 'basic', label: 'Basic', description: 'Standard security measures' },
  { value: 'enhanced', label: 'Enhanced', description: 'Advanced security protocols' },
  { value: 'enterprise', label: 'Enterprise', description: 'Military-grade security' },
];

export default function AiLab() {
  const [prompt, setPrompt] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [securityLevel, setSecurityLevel] = useState('basic');
  const [scale, setScale] = useState([50]);
  const [costBudget, setCostBudget] = useState([1000]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [architecture, setArchitecture] = useState<ArchitectureOutput | null>(null);
  const { toast } = useToast();

  const generateArchitecture = useCallback(async () => {
    if (!prompt.trim() || !selectedIndustry) {
      toast({
        title: 'Missing Information',
        description: 'Please provide a project description and select an industry.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate mock architecture based on inputs
    const mockArchitecture: ArchitectureOutput = {
      services: [
        {
          id: '1',
          name: 'Frontend Application',
          type: 'frontend',
          description: 'React-based user interface with responsive design',
          tech: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
          scalability: scale[0] > 70 ? 'high' : scale[0] > 40 ? 'medium' : 'low',
          cost: costBudget[0] * 0.3,
        },
        {
          id: '2',
          name: 'API Gateway',
          type: 'backend',
          description: 'Centralized API management and routing',
          tech: ['Node.js', 'Express', 'Kong', 'Redis'],
          scalability: 'high',
          cost: costBudget[0] * 0.25,
        },
        {
          id: '3',
          name: 'Database Cluster',
          type: 'database',
          description: 'Primary data storage with replication',
          tech: ['PostgreSQL', 'Redis', 'MongoDB'],
          scalability: 'high',
          cost: costBudget[0] * 0.2,
        },
        {
          id: '4',
          name: 'Message Queue',
          type: 'queue',
          description: 'Asynchronous task processing',
          tech: ['RabbitMQ', 'Apache Kafka'],
          scalability: 'high',
          cost: costBudget[0] * 0.15,
        },
        {
          id: '5',
          name: 'File Storage',
          type: 'storage',
          description: 'Scalable file and media storage',
          tech: ['AWS S3', 'CloudFront', 'CDN'],
          scalability: 'high',
          cost: costBudget[0] * 0.1,
        },
      ],
      totalCost: costBudget[0],
      scalability: scale[0] > 70 ? 'Highly Scalable' : scale[0] > 40 ? 'Moderately Scalable' : 'Basic Scalability',
      security: securityLevel === 'enterprise' ? 'Enterprise-grade security with encryption, authentication, and monitoring' :
               securityLevel === 'enhanced' ? 'Enhanced security with authentication and monitoring' :
               'Basic security measures',
      deployment: `Cloud-native deployment with ${scale[0] > 70 ? 'auto-scaling' : 'manual scaling'} capabilities`,
      architecture: {
        frontend: ['React SPA', 'Mobile Apps', 'Admin Dashboard'],
        backend: ['API Gateway', 'Microservices', 'Authentication'],
        database: ['Primary DB', 'Cache Layer', 'Analytics DB'],
        infrastructure: ['Load Balancer', 'CDN', 'Monitoring', 'CI/CD'],
      },
    };

    setArchitecture(mockArchitecture);
    setIsGenerating(false);

    toast({
      title: 'Architecture Generated',
      description: 'AI has successfully generated your system architecture!',
    });
  }, [prompt, selectedIndustry, securityLevel, scale, costBudget, toast]);

  const exportArchitecture = (format: 'json' | 'markdown') => {
    if (!architecture) return;

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(architecture, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `architecture-${Date.now()}.json`;
      a.click();
    } else {
      const markdown = `# ${selectedIndustry} Architecture\n\n## Overview\n${prompt}\n\n## Services\n${architecture.services.map(service => 
        `### ${service.name}\n- **Type**: ${service.type}\n- **Description**: ${service.description}\n- **Technology**: ${service.tech.join(', ')}\n- **Cost**: $${service.cost}\n`
      ).join('\n')}\n\n## Total Cost: $${architecture.totalCost}\n## Scalability: ${architecture.scalability}\n## Security: ${architecture.security}\n`;
      
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `architecture-${Date.now()}.md`;
      a.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold">AI Architecture Lab</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate intelligent system architectures tailored to your industry and requirements using advanced AI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Architecture Generator
              </CardTitle>
              <CardDescription>
                Describe your project and let AI design the perfect architecture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Description */}
              <div className="space-y-2">
                <Label htmlFor="prompt">Project Description</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe your project requirements, features, and goals..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              {/* Industry Selection */}
              <div className="space-y-2">
                <Label>Industry</Label>
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Security Level */}
              <div className="space-y-2">
                <Label>Security Level</Label>
                <Select value={securityLevel} onValueChange={setSecurityLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {securityLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div>
                          <div className="font-medium">{level.label}</div>
                          <div className="text-sm text-muted-foreground">{level.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Scale Slider */}
              <div className="space-y-2">
                <Label>Scalability Requirements: {scale[0]}%</Label>
                <Slider
                  value={scale}
                  onValueChange={setScale}
                  max={100}
                  step={10}
                  className="w-full"
                />
              </div>

              {/* Cost Budget */}
              <div className="space-y-2">
                <Label>Monthly Budget: ${costBudget[0]}</Label>
                <Slider
                  value={costBudget}
                  onValueChange={setCostBudget}
                  max={5000}
                  step={100}
                  className="w-full"
                />
              </div>

              {/* Generate Button */}
              <Button
                onClick={generateArchitecture}
                disabled={isGenerating || !prompt.trim() || !selectedIndustry}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Architecture...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Generate Architecture
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Architecture</CardTitle>
              <CardDescription>
                AI-generated system architecture and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {architecture ? (
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="services">Services</TabsTrigger>
                    <TabsTrigger value="export">Export</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Total Cost</Label>
                        <p className="text-2xl font-bold text-green-600">
                          ${architecture.totalCost}/month
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Scalability</Label>
                        <p className="text-sm">{architecture.scalability}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Security</Label>
                      <p className="text-sm text-muted-foreground">{architecture.security}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Deployment</Label>
                      <p className="text-sm text-muted-foreground">{architecture.deployment}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="services" className="space-y-4">
                    <div className="space-y-4">
                      {architecture.services.map((service) => (
                        <div key={service.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{service.name}</h4>
                            <Badge variant="outline">{service.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {service.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {service.tech.map((tech) => (
                              <Badge key={tech} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">${service.cost}/month</span>
                            <Badge
                              variant={service.scalability === 'high' ? 'default' : 'secondary'}
                            >
                              {service.scalability} scale
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="export" className="space-y-4">
                    <div className="text-center space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Export your architecture for implementation
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => exportArchitecture('json')}
                          className="flex-1"
                        >
                          <Code className="mr-2 h-4 w-4" />
                          Export JSON
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => exportArchitecture('markdown')}
                          className="flex-1"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Export MD
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-12">
                  <Server className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Generate an architecture to see the results here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


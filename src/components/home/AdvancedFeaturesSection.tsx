import { Zap, Shield, Globe, Database, Code, Rocket, Lock, Cloud, Server, Cpu } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast Performance',
    description: 'NVMe SSD storage and optimized servers deliver blazing-fast load times.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Free SSL certificates, DDoS protection, and daily automated backups.',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    icon: Globe,
    title: 'Global CDN Network',
    description: 'Content delivery network with 200+ edge locations worldwide.',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  {
    icon: Database,
    title: 'Multiple Database Support',
    description: 'MySQL, PostgreSQL, MongoDB, Redis - choose what works for you.',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    icon: Code,
    title: 'Developer-Friendly',
    description: 'SSH access, Git integration, and support for all major frameworks.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Rocket,
    title: 'One-Click Deployments',
    description: 'Deploy WordPress, Laravel, Node.js, and more with a single click.',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
  },
  {
    icon: Lock,
    title: '99.9% Uptime SLA',
    description: 'Guaranteed uptime with 24/7 monitoring and instant failover.',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    icon: Cloud,
    title: 'Scalable Infrastructure',
    description: 'Scale your resources instantly as your business grows.',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  {
    icon: Server,
    title: 'Dedicated Resources',
    description: 'VPS and dedicated servers with guaranteed CPU, RAM, and storage.',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
];

const AdvancedFeaturesSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute inset-0 server-pattern opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Rocket className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Advanced Features</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            Everything You Need to <span className="gradient-text-orange">Succeed Online</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful tools and features designed to help your website perform at its best.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="glass-card p-6 rounded-2xl hover:border-primary/50 transition-all duration-300 group hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6">
            Ready to experience these features? Start your free trial today.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AdvancedFeaturesSection;


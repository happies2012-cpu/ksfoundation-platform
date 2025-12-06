import { 
  Zap, Shield, Server, Globe, 
  Clock, Headphones, Database, Lock,
  Cpu, RefreshCw, Wifi, BarChart3
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'NVMe SSD storage and LiteSpeed cache for blazing performance.',
    color: 'primary',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Free SSL, DDoS protection, and malware scanning included.',
    color: 'success',
  },
  {
    icon: Clock,
    title: '99.9% Uptime',
    description: 'Guaranteed uptime backed by our service level agreement.',
    color: 'secondary',
  },
  {
    icon: Headphones,
    title: '24/7 Expert Support',
    description: 'Real humans ready to help you anytime, anywhere.',
    color: 'accent',
  },
  {
    icon: Globe,
    title: 'Global CDN',
    description: 'Cloudflare CDN included for worldwide fast loading.',
    color: 'primary',
  },
  {
    icon: Database,
    title: 'Daily Backups',
    description: 'Automatic daily backups with one-click restore.',
    color: 'success',
  },
  {
    icon: Lock,
    title: 'Free SSL',
    description: 'Unlimited free SSL certificates for all your domains.',
    color: 'secondary',
  },
  {
    icon: RefreshCw,
    title: 'Free Migration',
    description: 'We migrate your website for free, no downtime.',
    color: 'accent',
  },
  {
    icon: Cpu,
    title: 'AI Tools',
    description: 'AI-powered website builder and optimization tools.',
    color: 'primary',
  },
  {
    icon: Wifi,
    title: 'Unlimited Bandwidth',
    description: 'No limits on traffic, grow without restrictions.',
    color: 'success',
  },
  {
    icon: Server,
    title: '1-Click Installs',
    description: 'WordPress, Joomla, Drupal, and 100+ apps ready.',
    color: 'secondary',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Built-in analytics to track your site performance.',
    color: 'accent',
  },
];

const FeaturesGrid = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 server-pattern opacity-5" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            Everything You Need to <span className="gradient-text-blue">Succeed Online</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features included with every hosting plan. No hidden fees, no surprises.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:bg-card"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`inline-flex p-3 rounded-xl mb-4 transition-all duration-300 group-hover:scale-110 ${
                  feature.color === 'primary' ? 'bg-primary/10 group-hover:bg-primary/20' :
                  feature.color === 'success' ? 'bg-success/10 group-hover:bg-success/20' :
                  feature.color === 'secondary' ? 'bg-secondary/10 group-hover:bg-secondary/20' :
                  'bg-accent/10 group-hover:bg-accent/20'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    feature.color === 'primary' ? 'text-primary' :
                    feature.color === 'success' ? 'text-success' :
                    feature.color === 'secondary' ? 'text-secondary' :
                    'text-accent'
                  }`} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;

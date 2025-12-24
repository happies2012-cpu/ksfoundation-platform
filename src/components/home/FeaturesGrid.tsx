import { 
  Users, Zap, Shield, Globe, 
  Clock, Headphones, Database, Lock,
  Cpu, RefreshCw, Wifi, BarChart3,
  MessageCircle, FileText, Calendar, CheckCircle
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Real-time collaboration with your team members on tasks and projects.',
    color: 'primary',
  },
  {
    icon: Zap,
    title: 'Drag & Drop Interface',
    description: 'Intuitive drag-and-drop task management for seamless workflow.',
    color: 'success',
  },
  {
    icon: Clock,
    title: 'Real-Time Updates',
    description: 'Instant updates across all devices with WebSocket connections.',
    color: 'secondary',
  },
  {
    icon: Headphones,
    title: '24/7 Expert Support',
    description: 'Real humans ready to help you anytime, anywhere.',
    color: 'accent',
  },
  {
    icon: MessageCircle,
    title: 'Team Chat',
    description: 'Built-in messaging system for team communication.',
    color: 'primary',
  },
  {
    icon: Database,
    title: 'Secure Data Storage',
    description: 'Enterprise-grade security with encrypted data storage.',
    color: 'success',
  },
  {
    icon: Lock,
    title: 'Access Control',
    description: 'Granular permissions and role-based access control.',
    color: 'secondary',
  },
  {
    icon: RefreshCw,
    title: 'Auto-Save',
    description: 'Never lose your work with automatic saving.',
    color: 'accent',
  },
  {
    icon: Cpu,
    title: 'Performance Optimized',
    description: 'Blazing-fast performance with optimized frontend and backend.',
    color: 'primary',
  },
  {
    icon: FileText,
    title: 'File Attachments',
    description: 'Attach files to tasks and share documents with your team.',
    color: 'success',
  },
  {
    icon: Calendar,
    title: 'Due Dates & Reminders',
    description: 'Set deadlines and receive timely reminders for tasks.',
    color: 'secondary',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track team productivity and project progress with detailed analytics.',
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
            Everything You Need to <span className="gradient-text-blue">Boost Productivity</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features included with every plan. No hidden fees, no surprises.
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

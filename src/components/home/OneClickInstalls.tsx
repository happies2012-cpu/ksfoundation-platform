import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

const apps = [
  { name: 'WordPress', category: 'CMS', color: 'from-blue-500 to-blue-600' },
  { name: 'Shopify', category: 'E-commerce', color: 'from-green-500 to-green-600' },
  { name: 'WooCommerce', category: 'E-commerce', color: 'from-purple-500 to-purple-600' },
  { name: 'Joomla', category: 'CMS', color: 'from-orange-500 to-orange-600' },
  { name: 'Drupal', category: 'CMS', color: 'from-blue-400 to-blue-500' },
  { name: 'Magento', category: 'E-commerce', color: 'from-orange-600 to-red-500' },
  { name: 'PrestaShop', category: 'E-commerce', color: 'from-pink-500 to-pink-600' },
  { name: 'Laravel', category: 'Framework', color: 'from-red-500 to-red-600' },
];

const OneClickInstalls = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">One-Click Installer</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Install <span className="gradient-text-orange">100+ Apps</span> in Seconds
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Launch your favorite CMS, e-commerce platform, or framework with just one click. 
              No technical knowledge required. Our AI-powered installer handles everything for you.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                  <span className="text-success font-bold text-sm">1</span>
                </div>
                <span className="text-foreground">Choose your application</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                  <span className="text-success font-bold text-sm">2</span>
                </div>
                <span className="text-foreground">Click install</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                  <span className="text-success font-bold text-sm">3</span>
                </div>
                <span className="text-foreground">Start building your website</span>
              </div>
            </div>

            <Button variant="rocket" size="lg" className="group">
              View All Apps
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Right - Apps Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {apps.map((app, index) => (
                <div
                  key={app.name}
                  className="group relative aspect-square rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col items-center justify-center p-4 cursor-pointer overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${app.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  {/* App Icon Placeholder */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.color} mb-3 flex items-center justify-center text-white font-bold text-lg`}>
                    {app.name.charAt(0)}
                  </div>
                  
                  <span className="text-sm font-semibold text-foreground text-center">
                    {app.name}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {app.category}
                  </span>
                </div>
              ))}
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OneClickInstalls;

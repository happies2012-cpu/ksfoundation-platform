import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Globe, Check, ArrowRight } from 'lucide-react';

const popularTlds = [
  { tld: '.com', price: 9.99, originalPrice: 15.99 },
  { tld: '.io', price: 29.99, originalPrice: 49.99 },
  { tld: '.dev', price: 12.99, originalPrice: 19.99 },
  { tld: '.app', price: 14.99, originalPrice: 24.99 },
  { tld: '.co', price: 7.99, originalPrice: 12.99 },
  { tld: '.net', price: 11.99, originalPrice: 17.99 },
];

const DomainSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      setTimeout(() => setIsSearching(false), 1500);
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-background to-primary/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
              <Globe className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">Domain Registration</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Find Your <span className="gradient-text-blue">Perfect Domain</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Search from millions of available domains. Get started with as low as $0.99/year.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative mb-12">
            <div className="flex flex-col sm:flex-row gap-3 p-3 rounded-2xl bg-card border-2 border-border focus-within:border-primary transition-colors shadow-xl">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter your dream domain name..."
                  className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-lg"
                />
              </div>
              <Button
                variant="rocket"
                size="lg"
                onClick={handleSearch}
                disabled={isSearching}
                className="sm:w-auto w-full"
              >
                {isSearching ? (
                  <>
                    <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    Search Domain
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Popular TLDs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularTlds.map((item) => (
              <div
                key={item.tld}
                className="group p-4 rounded-xl bg-card/50 border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer text-center"
              >
                <span className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {item.tld}
                </span>
                <div className="mt-2">
                  <span className="text-lg font-bold text-success">${item.price}</span>
                  <span className="text-xs text-muted-foreground">/year</span>
                </div>
                <p className="text-xs text-muted-foreground line-through">
                  ${item.originalPrice}
                </p>
              </div>
            ))}
          </div>

          {/* Features Row */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              Free WHOIS Privacy
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              Free DNS Management
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              Easy Domain Transfer
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

export default DomainSearch;

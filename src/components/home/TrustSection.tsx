import { Star, Quote, Award, Users, Globe2, Shield } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'E-commerce Owner',
    avatar: 'SJ',
    rating: 5,
    text: 'KSFoundation transformed my online store. The speed is incredible and support is always there when I need them.',
  },
  {
    name: 'Michael Chen',
    role: 'Web Developer',
    avatar: 'MC',
    rating: 5,
    text: 'Best hosting I\'ve used in 10 years. The one-click WordPress installer saved me hours of work.',
  },
  {
    name: 'Emily Roberts',
    role: 'Blogger',
    avatar: 'ER',
    rating: 5,
    text: 'My blog loads in under a second now! The free SSL and CDN make it a no-brainer choice.',
  },
];

const stats = [
  { icon: Users, value: '3M+', label: 'Happy Customers' },
  { icon: Globe2, value: '50M+', label: 'Websites Hosted' },
  { icon: Shield, value: '99.9%', label: 'Uptime SLA' },
  { icon: Award, value: '4.6/5', label: 'Trustpilot Rating' },
];

const TrustSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-black text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            Loved by <span className="gradient-text-orange">Millions</span> Worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Join millions of satisfied customers who trust us with their online presence.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="relative p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/20 group-hover:text-primary/40 transition-colors" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trustpilot Banner */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 p-8 rounded-2xl bg-card/50 border border-border max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-success text-success" />
              ))}
            </div>
            <span className="text-2xl font-bold text-foreground">4.6/5</span>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-foreground font-semibold">Excellent on Trustpilot</div>
            <div className="text-sm text-muted-foreground">Based on 15,000+ reviews</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;

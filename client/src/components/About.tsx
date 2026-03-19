import { CheckCircle } from 'lucide-react';
import AnimatedCounter from './ui/AnimatedCounter';
import { useContent } from '@/contexts/ContentContext';

interface AboutProps {
  teamImage: string;
}

export default function About({ teamImage }: AboutProps) {
  const { data, loading } = useContent();

  if (loading || !data) {
    return <div className="py-24 bg-background h-96 animate-pulse" />;
  }

  const highlights = data.about.highlights || [];

  return (
    <section id="about" className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="order-2 md:order-1 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] md:aspect-auto">
              <img
                src={teamImage}
                alt="Zespół Fachowo.net.pl - fachowcy z wieloletnim doświadczeniem w usługach budowlanych i remontowych"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            {/* Experience Badge for desktop/tablet */}
            <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 bg-accent p-6 md:p-10 rounded-2xl shadow-xl z-20 hidden sm:block">
              <p className="text-accent-foreground font-display text-4xl md:text-6xl font-bold leading-none">{data.about.stats.years}+</p>
              <p className="text-accent-foreground/90 text-[10px] md:text-sm font-bold uppercase tracking-widest mt-1 md:mt-2">Lat doświadczenia</p>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 md:order-2 space-y-6">
            <div className="space-y-2">
              <span className="font-label text-accent text-sm font-bold uppercase tracking-widest">{data.about.badge}</span>
              <h2 
                className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight"
                dangerouslySetInnerHTML={{ __html: data.about.title }}
              />
              <div className="w-12 h-1 bg-accent" />
            </div>

            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl">
              {data.about.description}
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((highlight: string, index: number) => (
                <div key={index} className="flex items-center gap-3 bg-muted/20 p-3 rounded-xl border border-border/50">
                  <CheckCircle size={18} className="text-accent flex-shrink-0" />
                  <span className="text-foreground font-bold text-sm">{highlight}</span>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
              <div className="text-center md:text-left">
                <p className="text-2xl md:text-4xl font-display font-bold text-foreground leading-none">
                  <AnimatedCounter value={Number(data.about.stats.years)} suffix="+" />
                </p>
                <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-tighter font-bold mt-1">Lat</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-2xl md:text-4xl font-display font-bold text-foreground leading-none">
                  <AnimatedCounter value={Number(data.about.stats.clients)} suffix="+" />
                </p>
                <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-tighter font-bold mt-1">Klientów</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-2xl md:text-4xl font-display font-bold text-foreground leading-none">
                  <AnimatedCounter value={Number(data.about.stats.projects)} suffix="+" />
                </p>
                <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-tighter font-bold mt-1">Projektów</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

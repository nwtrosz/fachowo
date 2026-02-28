import { CheckCircle } from 'lucide-react';
import AnimatedCounter from './ui/AnimatedCounter';

/**
 * About Section Component
 * Fachowo.net.pl - Construction, Renovations & Flooring
 * 
 * Design: Bold Structural Modernism
 * - Image-text alternating layout
 * - Checkmark list for key points
 * - Asymmetric spacing
 * - Animated statistics
 */

interface AboutProps {
  teamImage: string;
}

export default function About({ teamImage }: AboutProps) {
  const highlights = [
    'Szybka i niezawodna realizacja usług',
    'Konkurencyjne ceny',
    'Elastyczne terminy pracy',
    'Profesjonalne podejście',
    'Zadowoleni klienci',
    'Przejrzysta komunikacja',
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="order-2 md:order-1 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] md:aspect-auto">
              <img
                src={teamImage}
                alt="Zespół Fachowo.net.pl - fachowcy z 10-letnim doświadczeniem w usługach budowlanych i remontowych"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            {/* Experience Badge for desktop/tablet */}
            <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 bg-accent p-6 md:p-10 rounded-2xl shadow-xl z-20 hidden sm:block">
              <p className="text-white font-display text-4xl md:text-6xl font-bold leading-none">10+</p>
              <p className="text-white/90 text-[10px] md:text-sm font-bold uppercase tracking-widest mt-1 md:mt-2">Lat doświadczenia</p>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 md:order-2 space-y-6">
            <div className="space-y-2">
              <span className="font-label text-accent text-sm font-bold uppercase tracking-widest">O Nas</span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary leading-tight">
                Fachowość poparta <br className="hidden sm:block" /> doświadczeniem
              </h2>
              <div className="w-12 h-1 bg-accent" />
            </div>

            <p className="text-foreground/70 text-base md:text-lg leading-relaxed max-w-xl">
              Fachowo.net.pl to zespół specjalistów z pasją realizujących usługi budowlane, remontowe i transportowe. Dostarczamy solidne wyniki, dbając o każdy detal Twojego projektu.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-3 bg-secondary/5 p-3 rounded-xl border border-border/50">
                  <CheckCircle size={18} className="text-accent flex-shrink-0" />
                  <span className="text-primary font-bold text-sm">{highlight}</span>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
              <div className="text-center md:text-left">
                <p className="text-2xl md:text-4xl font-display font-bold text-primary leading-none">
                  <AnimatedCounter value={10} suffix="+" />
                </p>
                <p className="text-[10px] md:text-xs text-foreground/60 uppercase tracking-tighter font-bold mt-1">Lat</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-2xl md:text-4xl font-display font-bold text-primary leading-none">
                  <AnimatedCounter value={150} suffix="+" />
                </p>
                <p className="text-[10px] md:text-xs text-foreground/60 uppercase tracking-tighter font-bold mt-1">Klientów</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-2xl md:text-4xl font-display font-bold text-primary leading-none">
                  <AnimatedCounter value={500} suffix="+" />
                </p>
                <p className="text-[10px] md:text-xs text-foreground/60 uppercase tracking-tighter font-bold mt-1">Projektów</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

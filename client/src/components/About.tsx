import { CheckCircle } from 'lucide-react';
import AnimatedCounter from './ui/AnimatedCounter';

/**
 * About Section Component
 * Fachowo.eu - Construction, Renovations & Flooring
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
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="order-2 md:order-1">
            <img
              src={teamImage}
              alt="Zespół Fachowo.eu - fachowcy z 10-letnim doświadczeniem w usługach budowlanych i remontowych"
              className="w-full h-auto rounded shadow-lg"
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="order-1 md:order-2">
            <span className="font-label text-accent text-sm font-bold uppercase tracking-wider">O Nas</span>

            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mt-2 mb-6">
              Fachowość poparta doświadczeniem
            </h2>

            <p className="text-foreground/70 text-lg mb-6 leading-relaxed">
              Fachowo.eu to zespół specjalistów z pasją realizujących usługi budowlane, remontowe i transportowe. Dostarczamy solidne wyniki, dbając o każdy detal Twojego projektu.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-accent flex-shrink-0 mt-1" />
                  <span className="text-foreground font-medium">{highlight}</span>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 py-8 border-t border-border">
              <div className="text-center md:text-left">
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  <AnimatedCounter value={10} suffix="+" />
                </p>
                <p className="text-xs md:text-sm text-foreground/60 uppercase tracking-tighter font-bold">Lat doświadczenia</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  <AnimatedCounter value={150} suffix="+" />
                </p>
                <p className="text-xs md:text-sm text-foreground/60 uppercase tracking-tighter font-bold">Klientów</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  <AnimatedCounter value={500} suffix="+" />
                </p>
                <p className="text-xs md:text-sm text-foreground/60 uppercase tracking-tighter font-bold">Projektów</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

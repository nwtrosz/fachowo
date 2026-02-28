import { ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

/**
 * Hero Section Component
 * Fachowo.net.pl - Construction, Renovations & Flooring
 * 
 * Design: Bold Structural Modernism
 * - Full-width hero with background image
 * - Diagonal section break (clip-path)
 * - Large Oswald headings
 * - Amber accent button
 * - Parallax scroll effect
 */

interface HeroProps {
  backgroundImage: string;
}

export default function Hero({ backgroundImage }: HeroProps) {
  const [, navigate] = useLocation();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section
      ref={ref}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-primary"
      aria-label="Hero section - Professional construction and renovation services"
    >
      {/* Parallax Background Image */}
      <motion.div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          y,
          scale: 1.1 // Slightly larger to avoid white edges during parallax
        }}
      />

      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Diagonal clip-path divider at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 bg-background z-20"
        style={{
          clipPath: 'polygon(0 30%, 100% 0, 100% 100%, 0 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center text-white max-w-3xl pt-12 md:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-label text-accent text-xs md:text-sm tracking-widest uppercase font-bold">
            Witaj w Fachowo.net.pl
          </span>

          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold mt-4 mb-6 leading-[1.1]" itemProp="headline">
            Fachowo – Usługi Budowlane <br className="hidden sm:block" /> i Transportowe Poznań & Warszawa
          </h1>

          <p className="text-base md:text-xl mb-10 text-white/90 font-light max-w-xl mx-auto leading-relaxed">
            Szybkie i niezawodne usługi remontowe, transportowe i sprzątające dla Twojego domu i biura.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/kontakt')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 bg-accent text-primary font-bold rounded-lg hover:bg-accent/90 transition-all hover:gap-3 cursor-pointer shadow-lg shadow-accent/20"
            >
              Poproś o wycenę
              <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => navigate('/portfolio')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-lg hover:bg-white hover:text-primary transition-all cursor-pointer"
            >
              Realizacje
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

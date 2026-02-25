import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PortfolioComponent from '@/components/Portfolio';
import { motion } from 'framer-motion';
import { Link } from 'wouter';

/**
 * Portfolio Page
 * Fachowo.eu - Realizacje
 * 
 * Wyświetla wszystkie projekty z bazy danych
 */

export default function PortfolioPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="py-20 bg-primary text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="font-label text-accent text-sm font-bold uppercase tracking-widest mb-4 block">Nasze Projekty</span>
              <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
                Galeria Realizacji
              </h1>
              <div className="w-20 h-2 bg-accent mb-8"></div>
              <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
                Zobacz nasze ostatnie projekty i przekonaj się o jakości naszych usług budowlanych, remontowych oraz transportowych.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Portfolio Component (Handles its own data fetching) */}
        <PortfolioComponent />

        {/* CTA Section */}
        <section className="py-20 bg-white border-t border-border">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-6">
              Masz podobny projekt w planach?
            </h2>
            <p className="text-lg text-foreground/70 mb-10 max-w-2xl mx-auto">
              Skontaktuj się z nami, aby otrzymać bezpłatną wycenę i fachowe doradztwo techniczne.
            </p>
            <Link 
              href="/kontakt"
              className="inline-block px-10 py-4 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
            >
              Poproś o darmową wycenę
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

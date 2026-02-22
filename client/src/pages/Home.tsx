import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Portfolio from '@/components/Portfolio';
import Testimonials from '@/components/Testimonials';
import Branches from '@/components/Branches';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';
import ScrollProgress from '@/components/ui/ScrollProgress';
import { motion } from 'framer-motion';

/**
 * Home Page
 * Fachowo.eu - Construction, Renovations & Flooring
 * 
 * Design: Bold Structural Modernism
 * - Hero with background image
 * - Services section with cards
 * - About section with team image
 * - Portfolio preview with filters
 * - Contact section with form
 */

export default function Home() {
  const heroImage = '/assets/hero.webp';
  const teamImage = '/assets/team.webp';

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <ScrollProgress />
      <SEOHead />
      <Navigation />

      <main className="flex-1 pt-24">
        <Hero backgroundImage={heroImage} />
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
          <Services />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
          <About teamImage={teamImage} />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
          <Portfolio />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
          <Testimonials />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
          <Branches />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
          <Contact />
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

import { Hammer, Wrench, Layers } from 'lucide-react';
import { Link } from 'wouter';

/**
 * Services Section Component
 * Fachowo.eu - Construction, Renovations & Flooring
 * 
 * Design: Bold Structural Modernism
 * - Three service cards with icons
 * - Amber accent on hover
 * - Asymmetric layout with left-heavy alignment
 */

const services = [
  {
    icon: Hammer,
    title: 'Usługi Budowlane',
    description: 'Od mieszkań mieszkaniowych po duże kompleksy komercyjne, realizujemy projekty budowlane na czas i w ramach budżetu.',
    altText: 'Ikona usług budowlanych - młotek',
    href: '/usluga/kompleksowe-wykonczenie'
  },
  {
    icon: Wrench,
    title: 'Usługi Transportowe',
    description: 'Profesjonalny transport mebli, przeprowadzki i utylizacja odpadów. Kompleksowe rozwiązania transportowe.',
    altText: 'Ikona usług transportowych - klucz',
    href: '/usluga/przeprowadzki-transport'
  },
  {
    icon: Layers,
    title: 'Wykończenia',
    description: 'Profesjonalne wykończenia wnętrz, malowanie, gładzenie ścian i wiele innych usług wykończeniowych.',
    altText: 'Ikona usług wykończeniowych - warstwy',
    href: '/usluga/malowanie'
  },
];

export default function Services() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <span className="font-label text-accent text-sm">Nasze Usługi</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mt-2 mb-4">
            Nasze Oferta Usług
          </h2>
          <div className="w-12 h-1 bg-accent" aria-hidden="true" />
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded border border-border hover:border-accent hover:shadow-lg transition-all group"
              >
                <div className="w-16 h-16 bg-secondary/10 rounded flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors" aria-label={service.altText}>
                  <Icon size={32} className="text-accent" aria-hidden="true" />
                </div>

                <h3 className="font-display text-2xl font-bold text-primary mb-3">
                  {service.title}
                </h3>

                <p className="text-foreground/70 leading-relaxed">
                  {service.description}
                </p>

                <div className="mt-6 pt-6 border-t border-border">
                  <Link
                    href={service.href}
                    className="text-accent font-bold text-sm hover:text-primary transition-colors flex items-center gap-2 group/link cursor-pointer"
                  >
                    Dowiedz się więcej
                    <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

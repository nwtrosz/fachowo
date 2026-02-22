import { Facebook, Linkedin, Twitter } from 'lucide-react';

/**
 * Footer Component
 * Fachowo.eu - Construction, Renovations & Flooring
 * 
 * Design: Bold Structural Modernism
 * - Dark navy background
 * - Social media links
 * - Quick navigation
 */

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-xl font-bold mb-2">Fachowo.eu</h3>
            <p className="text-white/70 text-sm">
              Profesjonalne usługi budowlane i transportowe.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-4">Usługi</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Usługi Budowlane
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Usługi Transportowe
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Wykończenia
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4">Firma</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  O Nas
                </a>
              </li>
              <li>
                <a href="/portfolio" className="hover:text-accent transition-colors">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Kontakt
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold mb-4">Obserwuj Nas</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded flex items-center justify-center hover:bg-accent hover:text-primary transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded flex items-center justify-center hover:bg-accent hover:text-primary transition-colors"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded flex items-center justify-center hover:bg-accent hover:text-primary transition-colors"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-white/70">
            <p>
              &copy; {currentYear} Fachowo.eu. Wszystkie prawa zastrzeżone.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-accent transition-colors">
                Polityka Prywatności
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                Warunki Usługi
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

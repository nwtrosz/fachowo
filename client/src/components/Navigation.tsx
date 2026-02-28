import { useState } from 'react';
import { ChevronDown, Menu, X, Sun, Moon } from 'lucide-react';
import { useLocation } from 'wouter';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Navigation Component
 * Fachowo.net.pl - Usługi budowlane i transportowe
 * 
 * Design: Bold Structural Modernism
 * - Deep slate navy primary (#0F1F38)
 * - Amber accent (#F59E0B) for hover states
 * - Oswald font for bold typography
 * - Two dropdown menus for services
 */

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isBuildingServicesOpen, setIsBuildingServicesOpen] = useState(false);
  const [isTransportServicesOpen, setIsTransportServicesOpen] = useState(false);
  const [, navigate] = useLocation();
  const { theme, toggleTheme, switchable } = useTheme();

  const buildingServices = [
    { name: 'Kompleksowe Wykończenie', href: '/usluga/kompleksowe-wykonczenie' },
    { name: 'Malowanie', href: '/usluga/malowanie' },
    { name: 'Gładzenie Ścian', href: '/usluga/gladzenie-scian' },
    { name: 'Tynkowanie', href: '/usluga/tynkowanie' },
    { name: 'Kładzenie Paneli', href: '/usluga/kladanie-paneli' },
    { name: 'Instalacje Elektryczne', href: '/usluga/instalacje-elektryczne' },
    { name: 'Kładzenie Płytek', href: '/usluga/kladanie-plytek' },
    { name: 'Posadzki', href: '/usluga/posadzki' },
    { name: 'Wyburzenia i Rozbiórki', href: '/usluga/wyburzenia-rozbiorki' },
    { name: 'Kucie Tynków', href: '/usluga/kucie-tynkow' },
    { name: 'Kucie Płytek', href: '/usluga/kucie-plytek' },
    { name: 'Skuwanie Posadzek', href: '/usluga/skuwanie-posadzek' },
    { name: 'Szlifowanie Betonu', href: '/usluga/szlifowanie-betonu' },
    { name: 'Wnoszenie Materiałów', href: '/usluga/wnoszenie-materialow' },
    { name: 'Wynoszenie Gruzu', href: '/usluga/wynoszenie-gruzu' },
    { name: 'Drapanie Ścian', href: '/usluga/drapanie-scian' },
    { name: 'Sprzątanie po Budowie', href: '/usluga/sprzatanie-po-budowie' },
  ];

  const transportServices = [
    { name: 'Przeprowadzki i Transport', href: '/usluga/przeprowadzki-transport' },
    { name: 'Opróżnianie Mieszkań', href: '/usluga/oprozniam-mieszkania' },
    { name: 'Utylizacja Odpadów', href: '/usluga/utylizacja-odpadow' },
    { name: 'Sprzątanie po Najmie', href: '/usluga/sprzatanie-po-najmie' },
    { name: 'Transport Materiałów na Budowę', href: '/usluga/transport-materialow' },
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsOpen(false);
    setIsBuildingServicesOpen(false);
    setIsTransportServicesOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-background/95 backdrop-blur-md border-b border-border shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 h-20 md:h-24 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleNavigation('/')}
          className="flex items-center gap-3 no-underline cursor-pointer group"
        >
          <div className="w-12 h-12 md:w-14 md:h-14 bg-primary rounded flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-primary-foreground font-display text-xl md:text-2xl font-bold">F</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl md:text-2xl font-bold text-foreground leading-none">
              Fachowo.net.pl
            </span>
            <span className="text-[10px] uppercase tracking-widest text-accent font-bold hidden sm:block">Budujemy & Transportujemy</span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {/* Existing desktop items... (no changes needed here but kept for context if necessary) */}
          <button
            onClick={() => handleNavigation('/')}
            className="text-foreground font-medium hover:text-accent transition-colors cursor-pointer"
          >
            Strona główna
          </button>

          <button
            onClick={() => handleNavigation('/portfolio')}
            className="text-foreground font-medium hover:text-accent transition-colors cursor-pointer"
          >
            Portfolio
          </button>

          {/* Building Services Dropdown */}
          <div className="relative">
            <button
              onMouseEnter={() => setIsBuildingServicesOpen(true)}
              onMouseLeave={() => setIsBuildingServicesOpen(false)}
              className="flex items-center gap-2 text-foreground font-medium hover:text-accent transition-colors"
            >
              Usługi budowlane
              <ChevronDown
                size={18}
                className={`transition-transform ${
                  isBuildingServicesOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isBuildingServicesOpen && (
              <div
                className="absolute top-full left-0 mt-0 w-72 bg-card border border-border rounded shadow-lg py-2 max-h-[70vh] overflow-y-auto z-50"
                onMouseEnter={() => setIsBuildingServicesOpen(true)}
                onMouseLeave={() => setIsBuildingServicesOpen(false)}
              >
                {buildingServices.map((service) => (
                  <button
                    key={service.name}
                    onClick={() => handleNavigation(service.href)}
                    className="block w-full text-left px-4 py-2.5 text-card-foreground hover:bg-accent/10 hover:text-accent transition-colors text-sm cursor-pointer"
                  >
                    {service.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Transport Services Dropdown */}
          <div className="relative">
            <button
              onMouseEnter={() => setIsTransportServicesOpen(true)}
              onMouseLeave={() => setIsTransportServicesOpen(false)}
              className="flex items-center gap-2 text-foreground font-medium hover:text-accent transition-colors"
            >
              Usługi transportowe
              <ChevronDown
                size={18}
                className={`transition-transform ${
                  isTransportServicesOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isTransportServicesOpen && (
              <div
                className="absolute top-full left-0 mt-0 w-72 bg-card border border-border rounded shadow-lg py-2 z-50"
                onMouseEnter={() => setIsTransportServicesOpen(true)}
                onMouseLeave={() => setIsTransportServicesOpen(false)}
              >
                {transportServices.map((service) => (
                  <button
                    key={service.name}
                    onClick={() => handleNavigation(service.href)}
                    className="block w-full text-left px-4 py-2.5 text-card-foreground hover:bg-accent/10 hover:text-accent transition-colors text-sm cursor-pointer"
                  >
                    {service.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => handleNavigation('/kontakt')}
            className="text-foreground font-medium hover:text-accent transition-colors cursor-pointer"
          >
            Kontakt
          </button>

          <button
            onClick={() => handleNavigation('/kontakt')}
            className="px-6 py-2 bg-accent text-white font-medium rounded hover:bg-accent/90 transition-all hover:shadow-lg cursor-pointer"
          >
            Darmowa Wycena
          </button>

          {switchable && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-secondary/10 text-primary transition-colors cursor-pointer"
              aria-label="Przełącz motyw"
            >
              {theme === 'dark' ? <Sun size={20} className="text-accent" /> : <Moon size={20} />}
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden w-12 h-12 flex items-center justify-center hover:bg-secondary/10 rounded-full transition-colors z-[110]"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Zamknij menu" : "Otwórz menu"}
        >
          {isOpen ? <X size={28} className="text-primary" /> : <Menu size={28} className="text-primary" />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-0 left-0 w-full h-screen bg-background z-[100] md:hidden overflow-y-auto">
          <div className="container mx-auto px-6 pt-28 pb-12 flex flex-col min-h-full">
            <div className="flex flex-col gap-6 flex-1">
              <button
                onClick={() => handleNavigation('/')}
                className="text-left text-foreground font-display text-3xl font-bold hover:text-accent transition-colors"
              >
                Strona główna
              </button>

              <button
                onClick={() => handleNavigation('/portfolio')}
                className="text-left text-foreground font-display text-3xl font-bold hover:text-accent transition-colors"
              >
                Portfolio
              </button>

              <div className="space-y-4">
                <button
                  className="flex items-center justify-between w-full text-foreground font-display text-2xl font-bold border-b border-border pb-2"
                  onClick={() => setIsBuildingServicesOpen(!isBuildingServicesOpen)}
                >
                  Usługi budowlane
                  <ChevronDown
                    size={24}
                    className={`transition-transform text-accent ${
                      isBuildingServicesOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isBuildingServicesOpen && (
                  <div className="pl-4 flex flex-col gap-3 border-l-2 border-accent/20 animate-in fade-in slide-in-from-top-2">
                    {buildingServices.map((service) => (
                      <button
                        key={service.name}
                        onClick={() => handleNavigation(service.href)}
                        className="text-left text-muted-foreground hover:text-accent transition-colors text-base font-medium py-1"
                      >
                        {service.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <button
                  className="flex items-center justify-between w-full text-foreground font-display text-2xl font-bold border-b border-border pb-2"
                  onClick={() => setIsTransportServicesOpen(!isTransportServicesOpen)}
                >
                  Usługi transportowe
                  <ChevronDown
                    size={24}
                    className={`transition-transform text-accent ${
                      isTransportServicesOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isTransportServicesOpen && (
                  <div className="pl-4 flex flex-col gap-3 border-l-2 border-accent/20 animate-in fade-in slide-in-from-top-2">
                    {transportServices.map((service) => (
                      <button
                        key={service.name}
                        onClick={() => handleNavigation(service.href)}
                        className="text-left text-muted-foreground hover:text-accent transition-colors text-base font-medium py-1"
                      >
                        {service.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleNavigation('/kontakt')}
                className="text-left text-foreground font-display text-3xl font-bold hover:text-accent transition-colors"
              >
                Kontakt
              </button>

              {switchable && (
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-4 text-foreground font-display text-2xl font-bold border-b border-border pb-2 text-left"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun size={24} className="text-accent" /> Tryb jasny
                    </>
                  ) : (
                    <>
                      <Moon size={24} /> Tryb ciemny
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="mt-12 space-y-4 pt-8 border-t border-border">
              <button
                onClick={() => handleNavigation('/kontakt')}
                className="w-full py-5 bg-accent text-accent-foreground font-bold rounded-xl text-xl shadow-lg shadow-accent/20 transition-all active:scale-95"
              >
                Darmowa Wycena
              </button>
              <div className="flex justify-center gap-8 text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                <span>Poznań</span>
                <span className="text-accent">•</span>
                <span>Warszawa</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

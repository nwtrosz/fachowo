import { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useLocation } from 'wouter';

/**
 * Navigation Component
 * Fachowo.eu - Usługi budowlane i transportowe
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

  const buildingServices = [
    { name: 'Kompleksowe wykończenie mieszkań pod klucz', href: '/usluga/kompleksowe-wykonczenie' },
    { name: 'Malowanie', href: '/usluga/malowanie' },
    { name: 'Gładzenie ścian', href: '/usluga/gladzenie-scian' },
    { name: 'Tynkowanie', href: '/usluga/tynkowanie' },
    { name: 'Kładzenie Paneli', href: '/usluga/kladanie-paneli' },
    { name: 'Instalacje elektryczne', href: '/usluga/instalacje-elektryczne' },
    { name: 'Kładzenie Płytek', href: '/usluga/kladanie-plytek' },
    { name: 'Posadzki', href: '/usluga/posadzki' },
    { name: 'Wyburzenia, Rozbiórki', href: '/usluga/wyburzenia-rozbiorki' },
    { name: 'Kucie Tynków', href: '/usluga/kucie-tynkow' },
    { name: 'Kucie płytek', href: '/usluga/kucie-plytek' },
    { name: 'Skuwanie posadzek', href: '/usluga/skuwanie-posadzek' },
    { name: 'Szlifowanie betonu', href: '/usluga/szlifowanie-betonu' },
    { name: 'Wnoszenie materiałów budowlanych', href: '/usluga/wnoszenie-materialow' },
    { name: 'Wynoszenie gruzu', href: '/usluga/wynoszenie-gruzu' },
    { name: 'Drapanie ścian z farby i innych warstw', href: '/usluga/drapanie-scian' },
    { name: 'Sprzątanie po budowie', href: '/usluga/sprzatanie-po-budowie' },
  ];

  const transportServices = [
    { name: 'Przeprowadzki, Transport Mebli', href: '/usluga/przeprowadzki-transport' },
    { name: 'Opróżnianiem mieszkań po lokatorach', href: '/usluga/oprozniam-mieszkania' },
    { name: 'Utylizacją Odpadów', href: '/usluga/utylizacja-odpadow' },
    { name: 'Sprzątaniem po najmie', href: '/usluga/sprzatanie-po-najmie' },
    { name: 'Transport i wnoszenie materiałów budowlanych na budowę', href: '/usluga/transport-materialow' },
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsOpen(false);
    setIsBuildingServicesOpen(false);
    setIsTransportServicesOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleNavigation('/')}
          className="flex items-center gap-2 no-underline cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-14 h-14 bg-primary rounded flex items-center justify-center">
            <span className="text-white font-display text-2xl font-bold">F</span>
          </div>
          <span className="font-display text-2xl font-bold text-primary hidden sm:inline">
            Fachowo.eu
          </span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
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
                className="absolute top-full left-0 mt-0 w-72 bg-white border border-border rounded shadow-lg py-2 max-h-96 overflow-y-auto z-50"
                onMouseEnter={() => setIsBuildingServicesOpen(true)}
                onMouseLeave={() => setIsBuildingServicesOpen(false)}
              >
                {buildingServices.map((service) => (
                  <button
                    key={service.name}
                    onClick={() => handleNavigation(service.href)}
                    className="block w-full text-left px-4 py-2 text-foreground hover:bg-secondary/10 hover:text-accent transition-colors text-sm cursor-pointer"
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
                className="absolute top-full left-0 mt-0 w-72 bg-white border border-border rounded shadow-lg py-2 z-50"
                onMouseEnter={() => setIsTransportServicesOpen(true)}
                onMouseLeave={() => setIsTransportServicesOpen(false)}
              >
                {transportServices.map((service) => (
                  <button
                    key={service.name}
                    onClick={() => handleNavigation(service.href)}
                    className="block w-full text-left px-4 py-2 text-foreground hover:bg-secondary/10 hover:text-accent transition-colors text-sm cursor-pointer"
                  >
                    {service.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => handleNavigation('/kontakt')}
            className="px-6 py-2 bg-accent text-white font-medium rounded hover:bg-accent/90 transition-colors cursor-pointer"
          >
            Darmowa Wycena
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-secondary/10 rounded transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <button
              onClick={() => handleNavigation('/')}
              className="text-left text-foreground font-medium hover:text-accent transition-colors cursor-pointer"
            >
              Strona główna
            </button>

            <button
              onClick={() => handleNavigation('/portfolio')}
              className="text-left text-foreground font-medium hover:text-accent transition-colors cursor-pointer"
            >
              Portfolio
            </button>

            <div>
              <button
                className="flex items-center gap-2 w-full text-foreground font-medium hover:text-accent transition-colors"
                onClick={() => setIsBuildingServicesOpen(!isBuildingServicesOpen)}
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
                <div className="mt-2 ml-4 flex flex-col gap-2">
                  {buildingServices.map((service) => (
                    <button
                      key={service.name}
                      onClick={() => handleNavigation(service.href)}
                      className="text-left text-foreground hover:text-accent transition-colors text-sm cursor-pointer"
                    >
                      {service.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                className="flex items-center gap-2 w-full text-foreground font-medium hover:text-accent transition-colors"
                onClick={() => setIsTransportServicesOpen(!isTransportServicesOpen)}
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
                <div className="mt-2 ml-4 flex flex-col gap-2">
                  {transportServices.map((service) => (
                    <button
                      key={service.name}
                      onClick={() => handleNavigation(service.href)}
                      className="text-left text-foreground hover:text-accent transition-colors text-sm cursor-pointer"
                    >
                      {service.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavigation('/kontakt')}
              className="px-6 py-2 bg-accent text-white font-medium rounded text-center hover:bg-accent/90 transition-colors cursor-pointer"
            >
              Darmowa Wycena
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

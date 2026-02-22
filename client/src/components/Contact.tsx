import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useContactForm } from '@/hooks/useContactForm';
import { Button } from '@/components/ui/button';

/**
 * Contact Section Component
 * Fachowo.eu - Construction, Renovations & Flooring
 * 
 * Design: Bold Structural Modernism
 * - Contact form with validation
 * - Contact information cards
 * - Amber accent buttons
 */

export default function Contact() {
  const { submitted, setSubmitted, loading, submit } = useContactForm();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submit(formData);
    if (result.success) {
      setFormData({ name: '', email: '', phone: '', message: '' });
    } else {
      alert(result.error);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      label: 'Telefon Główny',
      value: '+48 (12) 345-6789',
      href: 'tel:+48123456789',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'info@fachowo.eu',
      href: 'mailto:info@fachowo.eu',
    },
    {
      icon: MapPin,
      label: 'Siedziba Główna',
      value: 'ul. Budowlana 123, 31-999 Kraków',
      href: '#',
    },
  ];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <span className="font-label text-accent text-sm">Skontaktuj się z nami</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mt-2 mb-4">
            Zapytaj o Bezpłatną Wycenę
          </h2>
          <div className="w-12 h-1 bg-accent" aria-hidden="true" />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <p className="text-foreground/70 text-lg mb-8 leading-relaxed">
              Masz projekt w głowie? Skontaktuj się z nami! Oferujemy bezpłatne wyceny dla wszystkich rodzajów usług budowlanych, remontowych i transportowych. Szybko odpowiadamy i pracujemy elastycznie.
            </p>

            <div className="space-y-6">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-start gap-4 p-4 rounded hover:bg-secondary/5 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-accent/10 rounded flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                      <Icon size={24} className="text-accent" />
                    </div>
                    <div>
                      <p className="font-bold text-primary text-sm">{item.label}</p>
                      <p className="text-foreground/70 group-hover:text-accent transition-colors">
                        {item.value}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-background p-8 rounded border border-border">
            {submitted ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-accent" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-primary mb-2">
                    Dziękujemy!
                  </h3>
                  <p className="text-foreground/70 mb-6">
                    Otrzymaliśmy Twoją wiadomość i wkrótce się z Tobą skontaktujemy.
                  </p>
                  <Button 
                    onClick={() => setSubmitted(false)} 
                    variant="outline" 
                    className="border-accent text-accent hover:bg-accent/10"
                  >
                    Wyślij kolejną wiadomość
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">
                    Imię i Nazwisko
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Twoje imię i nazwisko"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-primary mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="twoj@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-primary mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="+48 (12) 345-6789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-primary mb-2">
                    Wiadomość
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    placeholder="Powiedz nam o swoim projekcie..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-primary text-white font-bold rounded hover:bg-primary/90 transition-colors"
                >
                  Wyślij Wiadomość
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

import { Mail, Phone, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useContactForm } from '@/hooks/useContactForm';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
    branch: 'Poznań',
    message: '',
    website: '', // Honeypot
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submit(formData);
    if (result.success) {
      toast.success("Wiadomość została wysłana!");
      setFormData({ name: '', email: '', phone: '', branch: 'Poznań', message: '', website: '' });
    } else {
      toast.error(result.error || "Wystąpił błąd podczas wysyłania.");
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
    <section id="contact" className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 md:mb-16">
          <span className="font-label text-accent text-sm font-bold uppercase tracking-widest">Skontaktuj się z nami</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary mt-2 mb-4 leading-tight">
            Zapytaj o Bezpłatną <br className="hidden sm:block" /> Wycenę
          </h2>
          <div className="w-12 h-1 bg-accent" aria-hidden="true" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Information */}
          <div className="space-y-8">
            <p className="text-foreground/70 text-base md:text-lg leading-relaxed italic border-l-4 border-accent pl-6">
              Masz projekt w głowie? Skontaktuj się z nami! Oferujemy bezpłatne wyceny dla wszystkich rodzajów usług budowlanych, remontowych i transportowych. Szybko odpowiadamy i pracujemy elastycznie.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-start gap-4 p-5 rounded-2xl bg-secondary/5 border border-border/50 hover:bg-white hover:shadow-xl hover:border-accent transition-all duration-500 group"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
                      <Icon size={24} className="text-accent group-hover:text-inherit" />
                    </div>
                    <div>
                      <p className="font-bold text-primary text-xs uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-foreground/70 font-medium group-hover:text-accent transition-colors">
                        {item.value}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-6 md:p-10 rounded-3xl border border-border shadow-2xl shadow-primary/5 relative">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent/10 rounded-full blur-3xl" />
            
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                  <CheckCircle size={40} className="text-accent" />
                </div>
                <h3 className="font-display text-3xl font-bold text-primary mb-4">
                  DZIĘKUJEMY!
                </h3>
                <p className="text-foreground/70 mb-8 max-w-xs mx-auto">
                  Otrzymaliśmy Twoją wiadomość. Nasz zespół skontaktuje się z Tobą w ciągu 24 godzin.
                </p>
                <Button 
                  onClick={() => setSubmitted(false)} 
                  className="bg-primary text-white font-bold px-8 py-4 rounded-xl hover:bg-accent transition-all shadow-lg"
                >
                  Wyślij kolejną
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                {/* Honeypot field - hidden from humans */}
                <div style={{ display: 'none' }}>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Imię i Nazwisko</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-secondary/5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all"
                    placeholder="np. Jan Kowalski"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-secondary/5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all"
                      placeholder="twoj@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Wybierz Filię</label>
                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-secondary/5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option value="Poznań">Filia Poznań</option>
                      <option value="Warszawa">Filia Warszawa</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Telefon</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-secondary/5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all"
                    placeholder="+48 123 456 789"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Wiadomość</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-5 py-4 bg-secondary/5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all resize-none"
                    placeholder="Powiedz nam o swoim projekcie..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-5 bg-primary text-white font-bold rounded-xl hover:bg-accent transition-all shadow-xl shadow-primary/10 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 text-lg cursor-pointer"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Wyślij Wiadomość'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

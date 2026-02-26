import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { Button } from '@/components/ui/button';
import { useContactForm } from '@/hooks/useContactForm';

/**
 * Contact Page - Conversion Optimized
 * Fachowo.eu - Professional Construction Services
 * 
 * Design: Conversion-focused layout
 * - Trust signals and social proof
 * - Clear value proposition
 * - Multiple contact methods
 * - Prominent contact form
 * - FAQ section
 */

export default function Contact() {
  const [location, setLocation] = useLocation();
  const { submitted, setSubmitted, loading, submit } = useContactForm();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    branch: 'Poznań',
    message: '',
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
      setFormData({ name: '', email: '', phone: '', branch: 'Poznań', message: '' });
    } else {
      alert(result.error);
    }
  };

  const branches = [
    {
      city: 'Poznań',
      address: 'ul. Budowlana 123, 61-999 Poznań',
      phone: '+48 (61) 345-6789',
      email: 'poznan@fachowo.eu',
      hours: 'Pn-Pt: 8:00 - 18:00, Sb: 9:00 - 14:00',
    },
    {
      city: 'Warszawa',
      address: 'ul. Konstruktorów 456, 02-999 Warszawa',
      phone: '+48 (22) 987-6543',
      email: 'warszawa@fachowo.eu',
      hours: 'Pn-Pt: 8:00 - 18:00, Sb: 9:00 - 14:00',
    },
  ];

  const trustSignals = [
    { icon: CheckCircle, text: 'Szybka realizacja' },
    { icon: CheckCircle, text: 'Bezpłatna wycena' },
    { icon: CheckCircle, text: 'Konkurencyjne ceny' },
    { icon: CheckCircle, text: 'Niezawodny serwis' },
  ];

  const faqs = [
    {
      question: 'Jak długo trwa udzielenie wyceny?',
      answer: 'Wycenę udzielamy szybko - zazwyczaj w ciągu kilku godzin lub dnia roboczego. Zależy od złożoności projektu.',
    },
    {
      question: 'Czy wycena jest bezpłatna?',
      answer: 'Tak, wszystkie wyceny są całkowicie bezpłatne i bez zobowiązań.',
    },
    {
      question: 'Jakie metody płatności akceptujecie?',
      answer: 'Akceptujemy transfer bankowy, gotówkę i umowy na raty. Szczegóły ustalamy indywidualnie.',
    },
    {
      question: 'Czy pracujecie poza Poznańiem i Warszawą?',
      answer: 'Głównie pracujemy w Poznaniu i Warszawie, ale możemy rozpatrzyć zlecenia w innych miastach - skontaktuj się z nami.',
    },
  ];



  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <button
              onClick={() => setLocation('/')}
              className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-6"
            >
              <ArrowLeft size={20} />
              Powrót
            </button>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">
              Skontaktuj się z nami
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl">
              Otrzymaj bezpłatną wycenę wstępną od naszych ekspertów. Odpowiemy na wszystkie Twoje pytania i pomożemy w wyborze najlepszego rozwiązania.
            </p>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {trustSignals.map((signal, index) => {
                const Icon = signal.icon;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <Icon size={24} className="text-accent flex-shrink-0" />
                    <p className="text-sm font-medium text-foreground">{signal.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-12">
              {/* Contact Form - Primary CTA */}
              <div className="md:col-span-2">
                <div className="bg-white p-8 rounded-lg border border-border shadow-lg">
                  <h2 className="font-display text-3xl font-bold text-primary mb-2">
                    Bezpłatna wycena wstępna
                  </h2>
                  <p className="text-foreground/70 mb-8">
                    Wypełnij formularz poniżej, a my skontaktujemy się z Tobą w ciągu 24 godzin.
                  </p>

                  {submitted ? (
                    <div className="flex items-center justify-center h-96">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle size={48} className="text-accent" />
                        </div>
                        <h3 className="font-display text-2xl font-bold text-primary mb-2">
                          Dziękujemy!
                        </h3>
                        <p className="text-foreground/70 mb-2">
                          Twoja wiadomość została wysłana pomyślnie.
                        </p>
                        <p className="text-sm text-foreground/60 mb-6">
                          Skontaktujemy się z Tobą wkrótce.
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
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-primary mb-2">
                          Imię i Nazwisko *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background"
                          placeholder="Jan Kowalski"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-bold text-primary mb-2">
                            Wybierz Filię *
                          </label>
                          <select
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background"
                          >
                            <option value="Poznań">Poznań</option>
                            <option value="Warszawa">Warszawa</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-primary mb-2">
                            Telefon *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background"
                            placeholder="+48 123 456 789"
                          />
                        </div>
                      </div>



                      <div>
                        <label className="block text-sm font-bold text-primary mb-2">
                          Opis projektu
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={5}
                          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background resize-none"
                          placeholder="Opisz swój projekt, powierzchnię, lokalizację i inne ważne szczegóły..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-4 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                      >
                        {loading ? 'Wysyłanie...' : 'Poproś o bezpłatną wycenę'}
                      </button>

                      <p className="text-xs text-foreground/60 text-center">
                        Gwarantujemy odpowiedź w ciągu 24 godzin.
                      </p>
                    </form>
                  )}
                </div>
              </div>

              {/* Sidebar - Contact Info & Social Proof */}
              <div className="space-y-8">
                {/* Quick Contact */}
                <div className="bg-white p-6 rounded-lg border border-border">
                  <h3 className="font-display text-xl font-bold text-primary mb-6">
                    Szybki kontakt
                  </h3>

                  <div className="space-y-4">
                    <a
                      href="tel:+48123456789"
                      className="flex items-start gap-4 p-4 bg-background rounded-lg hover:bg-accent/5 transition-colors group"
                    >
                      <Phone size={24} className="text-accent flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-sm text-primary">Telefon główny</p>
                        <p className="text-foreground/70 group-hover:text-accent transition-colors">
                          +48 (12) 345-6789
                        </p>
                      </div>
                    </a>

                    <a
                      href="mailto:info@fachowo.eu"
                      className="flex items-start gap-4 p-4 bg-background rounded-lg hover:bg-accent/5 transition-colors group"
                    >
                      <Mail size={24} className="text-accent flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-sm text-primary">Email</p>
                        <p className="text-foreground/70 group-hover:text-accent transition-colors">
                          info@fachowo.eu
                        </p>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Branches */}
                <div className="bg-white p-6 rounded-lg border border-border">
                  <h3 className="font-display text-xl font-bold text-primary mb-6">
                    Nasze filie
                  </h3>

                  <div className="space-y-4">
                    {branches.map((branch) => (
                      <div key={branch.city} className="pb-4 border-b border-border last:border-0 last:pb-0">
                        <p className="font-bold text-primary mb-2">{branch.city}</p>
                        <div className="space-y-2 text-sm text-foreground/70">
                          <div className="flex items-start gap-2">
                            <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                            <p>{branch.address}</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Phone size={16} className="flex-shrink-0 mt-0.5" />
                            <a href={`tel:${branch.phone.replace(/\s/g, '')}`} className="hover:text-accent">
                              {branch.phone}
                            </a>
                          </div>
                          <div className="flex items-start gap-2">
                            <Clock size={16} className="flex-shrink-0 mt-0.5" />
                            <p>{branch.hours}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-accent/10 p-6 rounded-lg border border-accent/20">
                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-bold text-accent">
                        <AnimatedCounter value={100} suffix="%" />
                      </p>
                      <p className="text-sm text-foreground/70">zadowoleni klienci</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-accent">
                        <AnimatedCounter value={24} suffix="h" />
                      </p>
                      <p className="text-sm text-foreground/70">szybka odpowiedź</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-accent">
                        <AnimatedCounter value={0} suffix=" zł" />
                      </p>
                      <p className="text-sm text-foreground/70">koszt wyceny</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
              Często zadawane pytania
            </h2>

            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-background p-6 rounded-lg border border-border hover:border-accent transition-colors cursor-pointer"
                >
                  <summary className="flex items-center justify-between font-bold text-primary">
                    {faq.question}
                    <span className="text-accent group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="text-foreground/70 mt-4 pt-4 border-t border-border">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Gotów na transformację?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Skontaktuj się z nami dzisiaj i otrzymaj bezpłatną wycenę wstępną. Brak zobowiązań.
            </p>
            <button
              onClick={() => document.querySelector('input[name="name"]')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition-colors text-lg"
            >
              Poproś o wycenę
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

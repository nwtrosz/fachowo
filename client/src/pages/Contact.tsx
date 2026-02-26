import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
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

import { toast } from 'sonner';

export default function Contact() {
  const [location, setLocation] = useLocation();
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

      <main className="flex-1 pt-20 md:pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-12 md:py-20 overflow-hidden">
          <div className="container mx-auto px-4 relative">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
            
            <button
              onClick={() => setLocation('/')}
              className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8 font-bold uppercase tracking-widest text-xs"
            >
              <ArrowLeft size={18} />
              Powrót do strony
            </button>
            
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary mb-6 leading-none tracking-tighter">
              Zacznijmy <br className="md:hidden" /> <span className="text-accent italic">Rozmawiać.</span>
            </h1>
            <p className="text-base md:text-xl text-foreground/70 max-w-2xl leading-relaxed">
              Otrzymaj bezpłatną wycenę wstępną od naszych ekspertów. Odpowiemy na wszystkie Twoje pytania i pomożemy w wyborze najlepszego rozwiązania.
            </p>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="py-8 bg-white border-b border-slate-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {trustSignals.map((signal, index) => {
                const Icon = signal.icon;
                return (
                  <div key={index} className="flex items-center gap-3 bg-secondary/5 p-3 rounded-xl border border-border/30">
                    <Icon size={20} className="text-accent flex-shrink-0" />
                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary">{signal.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 md:py-20 bg-slate-50/50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-12 lg:gap-16 items-start">
              
              {/* Contact Form - Primary CTA */}
              <div className="lg:col-span-2">
                <div className="bg-white p-6 md:p-12 rounded-[2.5rem] border border-border shadow-2xl shadow-primary/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -mr-16 -mt-16" />
                  
                  <h2 className="font-display text-3xl font-bold text-primary mb-3">
                    Wycena w 24h
                  </h2>
                  <p className="text-foreground/70 mb-10 leading-relaxed max-w-md">
                    Wypełnij formularz poniżej, a my skontaktujemy się z Tobą w ciągu jednego dnia roboczego.
                  </p>

                  {submitted ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
                      <div className="w-24 h-24 bg-accent/10 rounded-3xl flex items-center justify-center mb-8">
                        <CheckCircle size={48} className="text-accent" />
                      </div>
                      <h3 className="font-display text-3xl font-bold text-primary mb-4 italic">
                        DZIĘKUJEMY!
                      </h3>
                      <p className="text-foreground/70 mb-8 max-w-xs mx-auto text-lg font-light leading-relaxed">
                        Twoja wiadomość została wysłana pomyślnie. Skontaktujemy się z Tobą wkrótce.
                      </p>
                      <Button 
                        onClick={() => setSubmitted(false)}
                        className="bg-primary text-white font-bold px-10 py-4 rounded-xl hover:bg-accent transition-all shadow-xl"
                      >
                        Wyślij kolejną wiadomość
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                      {/* Honeypot field */}
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
                        <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-2 opacity-50">Imię i Nazwisko *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-6 py-4 bg-secondary/5 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all"
                          placeholder="Jan Kowalski"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-2 opacity-50">Email *</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-6 py-4 bg-secondary/5 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all"
                            placeholder="jan@example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-2 opacity-50">Telefon *</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full px-6 py-4 bg-secondary/5 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all"
                            placeholder="+48 123 456 789"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-2 opacity-50">Wybierz Filię *</label>
                        <select
                          name="branch"
                          value={formData.branch}
                          onChange={handleChange}
                          required
                          className="w-full px-6 py-4 bg-secondary/5 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all appearance-none cursor-pointer"
                        >
                          <option value="Poznań">Filia Poznań</option>
                          <option value="Warszawa">Filia Warszawa</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-2 opacity-50">Opis projektu *</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="w-full px-6 py-4 bg-secondary/5 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all resize-none"
                          placeholder="Opisz swój projekt, powierzchnię, lokalizację i inne ważne szczegóły..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-8 py-5 bg-primary text-white font-bold rounded-2xl hover:bg-accent transition-all shadow-2xl shadow-primary/10 active:scale-[0.98] disabled:opacity-50 text-xl flex items-center justify-center gap-3 cursor-pointer"
                      >
                        {loading ? <Loader2 className="animate-spin" /> : 'Poproś o bezpłatną wycenę'}
                      </button>

                      <p className="text-xs text-foreground/40 text-center font-medium italic">
                        Bez zobowiązań. Odpowiadamy w 24h.
                      </p>
                    </form>
                  )}
                </div>
              </div>

              {/* Sidebar - Contact Info & Social Proof */}
              <div className="space-y-8 h-full">
                {/* Quick Contact */}
                <div className="bg-white p-8 rounded-3xl border border-border shadow-lg">
                  <h3 className="font-display text-xl font-bold text-primary mb-8 flex items-center gap-2">
                    <span className="w-8 h-1 bg-accent rounded-full" /> Szybki kontakt
                  </h3>

                  <div className="space-y-4">
                    <a
                      href="tel:+48123456789"
                      className="flex items-center gap-5 p-5 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl hover:border-accent border border-transparent transition-all group"
                    >
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                        <Phone size={22} />
                      </div>
                      <div>
                        <p className="font-bold text-[10px] text-primary uppercase tracking-widest opacity-50 mb-1">Telefon</p>
                        <p className="text-foreground font-bold group-hover:text-accent transition-colors">
                          +48 123 456 789
                        </p>
                      </div>
                    </a>

                    <a
                      href="mailto:info@fachowo.eu"
                      className="flex items-center gap-5 p-5 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl hover:border-accent border border-transparent transition-all group"
                    >
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                        <Mail size={22} />
                      </div>
                      <div>
                        <p className="font-bold text-[10px] text-primary uppercase tracking-widest opacity-50 mb-1">Email</p>
                        <p className="text-foreground font-bold group-hover:text-accent transition-colors">
                          info@fachowo.eu
                        </p>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Branches */}
                <div className="bg-white p-8 rounded-3xl border border-border shadow-lg">
                  <h3 className="font-display text-xl font-bold text-primary mb-8 flex items-center gap-2">
                    <span className="w-8 h-1 bg-accent rounded-full" /> Nasze filie
                  </h3>

                  <div className="space-y-6">
                    {branches.map((branch) => (
                      <div key={branch.city} className="space-y-3 p-2">
                        <p className="font-display text-2xl font-bold text-primary italic">{branch.city}</p>
                        <div className="space-y-3 text-sm text-foreground/70">
                          <div className="flex items-start gap-3">
                            <MapPin size={18} className="text-accent flex-shrink-0 mt-0.5" />
                            <p className="font-medium">{branch.address}</p>
                          </div>
                          <div className="flex items-start gap-3 pt-2">
                            <Clock size={18} className="text-accent flex-shrink-0 mt-0.5" />
                            <p className="font-medium text-[11px] uppercase tracking-tighter leading-tight">{branch.hours}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-primary p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-accent/5 pointer-events-none" />
                  <div className="space-y-8 relative z-10 text-center">
                    <div>
                      <p className="text-5xl font-display font-bold text-accent italic leading-none">
                        <AnimatedCounter value={100} suffix="%" />
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mt-3">Satysfakcji</p>
                    </div>
                    <div className="w-12 h-px bg-white/10 mx-auto" />
                    <div>
                      <p className="text-5xl font-display font-bold text-accent italic leading-none">
                        <AnimatedCounter value={24} suffix="h" />
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mt-3">Czas odpowiedzi</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <span className="font-label text-accent text-sm font-bold uppercase tracking-widest">Wiedza</span>
              <h2 className="font-display text-4xl font-bold text-primary mt-2 italic">
                Często Zadawane Pytania
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-slate-50 p-6 md:p-8 rounded-3xl border border-transparent hover:border-accent/30 hover:bg-white hover:shadow-xl transition-all duration-500 cursor-pointer"
                >
                  <summary className="flex items-center justify-between font-bold text-primary text-lg md:text-xl list-none">
                    {faq.question}
                    <span className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-accent group-open:rotate-180 transition-transform duration-500">▼</span>
                  </summary>
                  <div className="text-foreground/70 mt-6 pt-6 border-t border-slate-200 leading-relaxed text-base animate-in fade-in slide-in-from-top-4">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 italic tracking-tighter">
              Gotów na Nową <br /> Jakość?
            </h2>
            <p className="text-lg md:text-xl text-white/70 mb-12 max-w-xl mx-auto font-light leading-relaxed">
              Skontaktuj się z nami dzisiaj i otrzymaj bezpłatną wycenę wstępną. Twoja wizja zasługuje na fachową realizację.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-12 py-5 bg-accent text-white font-bold rounded-2xl hover:shadow-[0_20px_50px_-10px_rgba(245,158,11,0.5)] transition-all text-xl uppercase tracking-widest active:scale-95"
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

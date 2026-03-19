import { useState } from 'react';
import { Phone, Mail, Clock, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { Button } from '@/components/ui/button';
import { useContactForm } from '@/hooks/useContactForm';
import { toast } from 'sonner';
import { useContent } from '@/contexts/ContentContext';

export default function Contact() {
  const [location, setLocation] = useLocation();
  const { submitted, setSubmitted, loading, submit } = useContactForm();
  const { data } = useContent();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    branch: 'Poznań',
    message: '',
    website: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submit(formData);
    if (result.success) {
      toast.success("Wiadomość została wysłana!");
      setFormData({ name: '', email: '', phone: '', branch: 'Poznań', message: '', website: '' });
    }
  };

  const branches = [
    {
      city: 'Poznań',
      phone: data.contact?.branchPoznanPhone || '+48 61 345 67 89',
      email: data.contact?.emailMain || 'poznan@fachowo.net.pl',
      hours: data.contact?.branchPoznanHours || 'Pn-Pt: 8:00 - 18:00',
    },
    {
      city: 'Warszawa',
      phone: data.contact?.branchWarszawaPhone || '+48 22 987 65 43',
      email: data.contact?.emailMain || 'warszawa@fachowo.net.pl',
      hours: data.contact?.branchWarszawaHours || 'Pn-Pt: 8:00 - 18:00',
    },
  ];
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-8 text-center">
            Kontakt
          </h1>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Formularz */}
            <div className="bg-card p-8 rounded-3xl border border-border shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Napisz do nas</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Imię i Nazwisko" className="w-full p-4 bg-muted/30 border border-border rounded-xl text-foreground" />
                <div className="grid md:grid-cols-2 gap-4">
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email" className="w-full p-4 bg-muted/30 border border-border rounded-xl text-foreground" />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefon" className="w-full p-4 bg-muted/30 border border-border rounded-xl text-foreground" />
                </div>
                <select name="branch" value={formData.branch} onChange={handleChange} className="w-full p-4 bg-muted/30 border border-border rounded-xl text-foreground">
                  <option value="Poznań">Filia Poznań</option>
                  <option value="Warszawa">Filia Warszawa</option>
                </select>
                <textarea name="message" value={formData.message} onChange={handleChange} rows={5} placeholder="W czym możemy pomóc?" className="w-full p-4 bg-muted/30 border border-border rounded-xl text-foreground resize-none" />
                <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-accent transition-all">
                  {loading ? "Wysyłanie..." : "Wyślij zapytanie"}
                </button>
              </form>
            </div>

            {/* Informacje */}
            <div className="space-y-8">
              <div className="bg-card p-8 rounded-3xl border border-border shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-foreground">Nasze Oddziały</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {branches.map(b => (
                    <div key={b.city} className="space-y-2">
                      <h3 className="text-xl font-bold text-accent">{b.city}</h3>
                      <div className="flex items-center gap-2 text-foreground/80 text-sm">
                        <MapPin size={16} className="text-accent" /> <span>{b.area}</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/80">
                        <Phone size={16} className="text-accent" /> <span>{b.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/80 text-sm">
                        <Mail size={16} className="text-accent" /> <span>{b.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-xs pt-2">
                        <Clock size={16} /> <span>{b.hours}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-8 border-t border-border">
                  <p className="text-sm text-muted-foreground italic">
                    Potrzebujesz naszych usług w innym mieście? <br />
                    <span className="text-foreground font-medium">Skontaktuj się z nami!</span> Jesteśmy otwarci na większe zlecenia w całej Polsce.
                  </p>
                </div>
              </div>

              <div className="bg-primary p-8 rounded-3xl text-primary-foreground text-center">
                <p className="text-4xl font-bold mb-2">100%</p>
                <p className="text-sm uppercase tracking-widest opacity-70">Zadowolonych Klientów</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

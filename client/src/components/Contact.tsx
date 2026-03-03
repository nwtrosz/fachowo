import { Mail, Phone, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useContactForm } from '@/hooks/useContactForm';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Contact() {
  const { submitted, setSubmitted, loading, submit } = useContactForm();
  
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

  const contactInfo = [
    {
      icon: Phone,
      label: 'Telefon',
      value: '+48 123 456 789',
      href: 'tel:+48123456789',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'info@fachowo.net.pl',
      href: 'mailto:info@fachowo.net.pl',
    },
  ];

  return (
    <section id="contact" className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-12 md:mb-16">
          <span className="font-label text-accent text-sm font-bold uppercase tracking-widest">Kontakt</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
            Darmowa Wycena i Konsultacja
          </h2>
          <div className="w-12 h-1 bg-accent" aria-hidden="true" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="space-y-8">
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed italic border-l-4 border-accent pl-6">
              Masz projekt? Skontaktuj się z nami! Oferujemy bezpłatne wyceny usług budowlanych i transportowych w Poznaniu oraz Warszawie.
            </p>

            <div className="grid grid-cols-1 gap-4">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border hover:border-accent transition-all group"
                  >
                    <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center flex-shrink-0 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                      <Icon size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-xs uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-muted-foreground font-medium">{item.value}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="bg-card p-6 md:p-10 rounded-3xl border border-border shadow-2xl relative">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <CheckCircle size={48} className="text-accent mb-6" />
                <h3 className="font-display text-3xl font-bold text-foreground mb-4">DZIĘKUJEMY!</h3>
                <Button onClick={() => setSubmitted(false)} className="bg-primary text-primary-foreground">Wyślij kolejną</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Imię i Nazwisko</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-5 py-4 bg-muted/30 border border-border rounded-xl text-foreground" placeholder="Jan Kowalski" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-5 py-4 bg-muted/30 border border-border rounded-xl text-foreground" placeholder="email@przyklad.pl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Filia</label>
                    <select name="branch" value={formData.branch} onChange={handleChange} className="w-full px-5 py-4 bg-muted/30 border border-border rounded-xl text-foreground"><option value="Poznań">Poznań</option><option value="Warszawa">Warszawa</option></select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Wiadomość</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full px-5 py-4 bg-muted/30 border border-border rounded-xl text-foreground resize-none" placeholder="Opisz krótko czego potrzebujesz..." />
                </div>
                <button type="submit" disabled={loading} className="w-full py-5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-accent transition-all cursor-pointer">
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Wyślij Wiadomość'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

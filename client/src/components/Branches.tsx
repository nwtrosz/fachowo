import { Phone, Mail, Clock } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';

export default function Branches() {
  const { data } = useContent();

  const branches = [
    {
      city: 'Poznań',
      phone: data.contact?.branchPoznanPhone || '+48 (61) 345-6789',
      email: data.contact?.emailMain || 'poznan@fachowo.net.pl',
      hours: data.contact?.branchPoznanHours || 'Pn-Pt: 8:00 - 18:00, Sb: 9:00 - 14:00',
    },
    {
      city: 'Warszawa',
      phone: data.contact?.branchWarszawaPhone || '+48 (22) 987-6543',
      email: data.contact?.emailMain || 'warszawa@fachowo.net.pl',
      hours: data.contact?.branchWarszawaHours || 'Pn-Pt: 8:00 - 18:00, Sb: 9:00 - 14:00',
    },
  ];

  return (
    <section id="branches" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-16">
          <span className="font-label text-accent text-sm">Kontakt</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
            Obszar Działania: <br className="hidden sm:block" /> Poznań i Warszawa
          </h2>
          <div className="w-12 h-1 bg-accent" aria-hidden="true" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {branches.map((branch, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded border border-border hover:border-accent hover:shadow-lg transition-all"
            >
              <h3 className="font-display text-3xl font-bold text-foreground mb-6">
                Fachowo.net.pl {branch.city}
              </h3>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-accent/10 rounded flex items-center justify-center flex-shrink-0">
                  <Phone size={24} className="text-accent" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm mb-1">Telefon</p>
                  <a href={`tel:${branch.phone.replace(/\s/g, '')}`} className="text-muted-foreground hover:text-accent transition-colors">
                    {branch.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-accent/10 rounded flex items-center justify-center flex-shrink-0">
                  <Mail size={24} className="text-accent" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm mb-1">Email</p>
                  <a href={`mailto:${branch.email}`} className="text-muted-foreground hover:text-accent transition-colors">
                    {branch.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-6 border-t border-border">
                <div className="w-12 h-12 bg-accent/10 rounded flex items-center justify-center flex-shrink-0">
                  <Clock size={24} className="text-accent" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm mb-1">Dostępność</p>
                  <p className="text-muted-foreground text-sm">{branch.hours}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

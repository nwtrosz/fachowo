import { Quote } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Jan Kowalski',
      role: 'Właściciel Biura',
      content: 'Firma Fachowo.NET.PL wykonała remont naszego biura szybko i profesjonalnie. Polecam!',
      rating: 5,
    },
    {
      id: 2,
      name: 'Anna Nowak',
      role: 'Klient Indywidualny',
      content: 'Bardzo dokładne wykończenie mieszkania. Panowie znają się na swojej robocie.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Marek Wiśniewski',
      role: 'Deweloper',
      content: 'Współpracujemy od lat przy wykończeniach pod klucz. Zawsze terminowo.',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-secondary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="font-label text-accent text-sm">Opinie Klientów</span>
          <h2 className="font-display text-4xl font-bold text-primary mt-2 mb-4">
            Co mówią o nas klienci?
          </h2>
          <div className="w-12 h-1 bg-accent mx-auto" aria-hidden="true" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div key={item.id} className="bg-white p-8 rounded shadow-sm border border-border/50 relative">
              <Quote className="absolute top-6 right-6 text-accent/20 w-10 h-10" />
              <div className="flex gap-1 mb-4 text-accent">
                {[...Array(item.rating)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="text-foreground/80 mb-6 italic">"{item.content}"</p>
              <div>
                <p className="font-bold text-primary">{item.name}</p>
                <p className="text-sm text-foreground/60">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

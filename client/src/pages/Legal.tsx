import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead title="Polityka Prywatności" />
      <Navigation />
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">Polityka Prywatności</h1>
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
            <p className="font-bold">Ostatnia aktualizacja: 26.02.2026</p>
            
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Informacje ogólne</h2>
              <p>Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych przekazywanych przez Użytkowników w związku z korzystaniem z serwisu fachowo.net.pl.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Administrator Danych</h2>
              <p>Administratorem danych osobowych zawartych w serwisie jest Fachowo.net.pl z siedzibą w Poznaniu i Warszawie.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Gromadzone dane</h2>
              <p>Serwis zbiera informacje dobrowolnie podane przez użytkownika w formularzu kontaktowym: imię i nazwisko, adres e-mail, numer telefonu oraz opcjonalnie lokalizację (IP).</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Cel przetwarzania danych</h2>
              <p>Dane przetwarzane są w celu obsługi zapytania ofertowego, kontaktu z klientem oraz przygotowania bezpłatnej wyceny usług budowlanych i transportowych.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Twoje prawa</h2>
              <p>Każdy użytkownik ma prawo do wglądu w swoje dane, ich poprawiania, usunięcia lub ograniczenia przetwarzania. W tym celu prosimy o kontakt pod adresem: kontakt@fachowo.net.pl.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead title="Warunki Usługi" />
      <Navigation />
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">Warunki Usługi</h1>
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
            <p className="font-bold">Ostatnia aktualizacja: 26.02.2026</p>
            
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Postanowienia ogólne</h2>
              <p>Korzystanie z serwisu fachowo.net.pl oznacza akceptację niniejszych warunków. Serwis służy do prezentacji oferty firmy i ułatwienia kontaktu z klientem.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Usługi</h2>
              <p>Wszystkie informacje o usługach (budowlanych, wykończeniowych, transportowych) zamieszczone na stronie nie stanowią oferty handlowej w rozumieniu Kodeksu Cywilnego, lecz są zaproszeniem do zawarcia umowy.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Wyceny</h2>
              <p>Bezpłatna wycena przygotowywana jest na podstawie danych podanych przez klienta. Ostateczny kosztorys ustalany jest po wizji lokalnej lub szczegółowym omówieniu projektu.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Odpowiedzialność</h2>
              <p>Fachowo.net.pl dokłada wszelkich starań, aby dane na stronie były aktualne, jednak nie gwarantuje ich pełnej bezbłędności.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

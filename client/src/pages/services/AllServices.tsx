import { ServicePage } from '@/components/ServicePage';

function createServicePage(
  title: string,
  subtitle: string,
  description: string,
  images: string[],
  benefits: string[]
) {
  return () => <ServicePage title={title} subtitle={subtitle} description={description} images={images} benefits={benefits} />;
}

// CDN Image URLs for each service
const kompleksoweImages = [
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/tlxmUyUoDoEfrvQm.jpg',
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/WWrancoPVHqucVDo.jpg',
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/VyuJTTZAkRShToXs.jpg',
];

const malowanieImages = [
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/RLKBsxwYjzDYLDYF.jpg',
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/tynFLdehXWbzmKtG.jpg',
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/ODvGQxiOGZHStZTX.jpg',
];

const gladzienieImages = [
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/GkuduWzsJtUMutUj.jpg',
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/eoFnkMfJmdOjbqJE.jpg',
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/UANnHpAZHEoGsOBV.jpg',
];

const tynkowanieImages = [
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/EUNqsYGRMvErZevn.jpg',
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/zArqrSMulVVmQKja.jpg',
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/sqTtJmzoSlnnEPUi.jpg',
];

const kladaniePaneliImages = [
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367700931/uFfPDQfqhzERXhts.webp',
];

const instalacjeElektryczneImages = [
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/nQYjkcGNiWdmILaB.jpg',
];

const kladaniePlytekImages = [
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/JUtdsZciGZbolrOq.jpg',
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/KwlGKjLlMpABjHRa.jpg',
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/JUtdsZciGZbolrOq.jpg',
];

const posadzkiImages = [
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367700931/SpOOkcBWnKOxAssC.jpg',
];

const wyburzenieImages = [
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/UkHlNipbZpIpMYZG.jpg',
];

const drapanieImages = [
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/vZzSTMazQjkUXDIH.jpg',
];

const kuciePlytekImages = [
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/wZAGqJyMNdoNkLJv.jpg',
];

const skuwaniePosadzekImages = [
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/aMbCnGsjjvScvbib.jpg',
];

const szlifowanieImages = [
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/wtUNblJIYsbKxvyH.jpg',
];

const kucieTynkowImages = [
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/gQcHDoiOqXYcgWjK.jpg',
];

const wnoszenieImages = [
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/mUUSpdBnGjBHkJBy.jpg',
];

const wynoszenieGruzuImages = [
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/RAHBJBCWsFoWjVZo.jpg',
];

const sprzataniePoBudowieImages = [
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/KPYSLEOmuyFyoyUw.jpg',
];

const transportMebliImages = [
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/rrLiDjUVddLkzcJK.jpg',
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/teHcvRIbghHgiUTb.jpg',
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/rrLiDjUVddLkzcJK.jpg',
];

const oproznianieImages = [
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/cQGbFbNYaroNoZCR.jpg',
];

const utylizacjaImages = [
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/GKqFapHpbZMHTrWl.jpg',
];

const sprzataniePojmieImages = [
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663367396835/hugMhEZKGHouBKPe.jpg',
];

// ===== USŁUGI BUDOWLANE =====

export const KompleksoweWykonczenie = createServicePage(
  'Kompleksowe Wykończenie Mieszkań Warszawa i Poznań',
  'Pełne wykończenie mieszkania pod klucz w Warszawie i Poznaniu',
  'Oferujemy kompleksowe usługi wykończenia mieszkań od podstaw na terenie Warszawy, Poznania i okolic. Nasze doświadczone zespoły zajmują się całym procesem - od przygotowania ścian, poprzez instalacje, aż do ostatnich detali. Gwarantujemy najwyższą jakość i terminowość realizacji.',
  kompleksoweImages,
  ['Kompleksowe rozwiązanie pod klucz', 'Profesjonalny zespół fachowców', 'Gwarancja jakości wykonania', 'Terminowa realizacja projektu w Warszawie i Poznaniu', 'Przystępne i transparentne ceny']
);

export const Malowanie = createServicePage(
  'Malowanie Warszawa i Poznań - Usługi Malarskie',
  'Profesjonalne malowanie ścian i sufitów (Warszawa, Poznań)',
  'Specjalizujemy się w profesjonalnym malowaniu ścian i sufitów dla domów, biur i mieszkań w Warszawie i Poznaniu. Używamy najwyższej jakości farb renomowanych producentów i nowoczesnych technik aplikacji. Dbamy o każdy detal, aby efekt końcowy był perfekcyjny.',
  malowanieImages,
  ['Wysoka jakość farb renomowanych marek', 'Profesjonalne techniki aplikacji', 'Szybka realizacja na terenie Warszawy i Poznania', 'Estetyczne i trwałe efekty', 'Przystępne ceny za m² malowania']
);

export const GladzeniScian = createServicePage(
  'Gładzenie i Szpachlowanie Ścian Warszawa, Poznań',
  'Perfekcyjne wyrównanie i gładzie gipsowe',
  'Usługa gładzenia i szpachlowania ścian pozwala na osiągnięcie idealnie gładkiej powierzchni, gotowej do malowania lub tapetowania. Obsługujemy klientów z Warszawy, Poznania i sąsiednich miejscowości. Nasz zespół dysponuje wieloletnim doświadczeniem i profesjonalnym sprzętem.',
  gladzienieImages,
  ['Idealna gładkość powierzchni', 'Profesjonalny sprzęt i materiały najwyższej jakości', 'Szybka realizacja dużych powierzchni w Warszawie', 'Przygotowanie pod perfekcyjne malowanie', 'Gwarancja na gładzie gipsowe']
);

export const Tynkowanie = createServicePage(
  'Tynkowanie Warszawa i Poznań - Tynki Ręczne i Maszynowe',
  'Profesjonalne tynkowanie ścian wewnętrznych i zewnętrznych',
  'Oferujemy usługi tynkowania w Warszawie i Poznaniu, realizując zlecenia dla domów i mieszkań. Pracujemy z najwyższej jakości materiałami tynkarskimi i gwarantujemy trwałość oraz estetykę. Wykonujemy tynki maszynowe i ręczne.',
  tynkowanieImages,
  ['Najlepsze materiały tynkarskie', 'Doświadczone brygady z Warszawy i Poznania', 'Trwałość i odporność tynków na lata', 'Estetyczne i proste ściany', 'Darmowa wycena i doradztwo']
);

export const KladaniePaneli = createServicePage(
  'Układanie Paneli Podłogowych Warszawa i Poznań',
  'Profesjonalny montaż paneli laminowanych i winylowych',
  'Specjalizujemy się w montażu paneli podłogowych na terenie Warszawy i Poznania. Nasze usługi obejmują przygotowanie podłoża, profesjonalne układanie podkładu, precyzyjny montaż paneli winylowych, laminowanych i desek oraz instalację listew przypodłogowych.',
  kladaniePaneliImages,
  ['Nowoczesne i estetyczne wykończenie podłóg', 'Szybki i precyzyjny montaż', 'Odporne podłogi na lata', 'Profesjonalny sprzęt i ekipy montażowe', 'Obsługa klientów z Warszawy i Poznania']
);

export const InstalacjeElektryczne = createServicePage(
  'Usługi Elektryczne i Instalacje Warszawa, Poznań',
  'Bezpieczne i nowoczesne instalacje elektryczne (Elektryk Warszawa, Poznań)',
  'Nasze doświadczone zespoły wykonują pełne instalacje elektryczne w domach i mieszkaniach w Warszawie i Poznaniu zgodnie z najwyższymi normami bezpieczeństwa. Oferujemy zarówno nowe instalacje, jak i wymianę starych instalacji.',
  instalacjeElektryczneImages,
  ['Zgodność z obowiązującymi normami', 'Najwyższe standardy bezpieczeństwa', 'Doświadczeni elektrycy z uprawnieniami', 'Szybka realizacja i diagnoza na terenie miast', 'Gwarancja na usługi elektryczne']
);

export const KladaniePlytek = createServicePage(
  'Układanie Płytek Warszawa i Poznań - Glazurnik',
  'Profesjonalne kładzenie płytek ceramicznych, gresu i terakoty',
  'Świadczymy usługi glazurnicze najwyższej klasy na obszarze Warszawy i Poznania. Specjalizujemy się w profesjonalnym kładzeniu płytek ceramicznych, gresowych i kamiennych w łazienkach, kuchniach i salonach. Zapewniamy dokładność i świetny wygląd fug.',
  kladaniePlytekImages,
  ['Mistrzowska precyzja i idealne docinki', 'Możliwość pracy z wielkim formatem (spieki)', 'Najlepsi glazurnicy z Warszawy i Poznania', 'Nowoczesne i modne łazienki', 'Dokładne hydroizolacje pod płytkami']
);

export const Posadzki = createServicePage(
  'Posadzki i Wylewki Warszawa i Poznań',
  'Profesjonalne wylewanie posadzek i naprawa podłoża',
  'Oferujemy kompleksowe usługi wylewania posadzek w Warszawie i Poznaniu. Zapewniamy przygotowanie podłoża, solidne wylewki jastrychowe, samopoziomujące oraz innowacyjne rozwiązania takie jak żywice czy mikrocement.',
  posadzkiImages,
  ['Solidne i równe wylewki', 'Przygotowanie pod płytki i panele', 'Szybki czas wiązania materiałów', 'Ekipy realizacyjne z Warszawy i Poznania', 'Trwałe podkłady podłogowe na lata']
);

export const WyburzeniRozbiorki = createServicePage(
  'Wyburzenia i Rozbiórki Ścian Warszawa, Poznań',
  'Szybkie i bezpieczne prace wyburzeniowe',
  'Specjalizujemy się w pracach wyburzeniowych i rozbiórkowych ścian działowych, nośnych oraz całych obiektów w Warszawie i Poznaniu. Posiadamy nowoczesny sprzęt, by przeprowadzić rozbiórkę bez naruszania struktury sąsiednich elementów.',
  wyburzenieImages,
  ['Zaawansowany i bezpieczny sprzęt', 'Wywóz gruzu i odpadów z wyburzeń', 'Prace wykonywane zgodnie ze sztuką budowlaną', 'Zlecenia na terenie Warszawy i Poznania', 'Maksymalne bezpieczeństwo na placu budowy']
);

export const DrapamieScian = createServicePage(
  'Zrywanie Tapet i Drapanie Ścian Warszawa, Poznań',
  'Skuteczne przygotowanie ścian pod gładzie i malowanie',
  'Zapewniamy profesjonalne zrywanie tapet, drapanie starej farby i czyszczenie ścian w Warszawie i Poznaniu. Nasze prace to pierwszy krok do idealnie wykończonego mieszkania - przygotowujemy idealne podłoże przed gruntowaniem i gładzią.',
  drapanieImages,
  ['Szybkie usuwanie uporczywych tapet', 'Dokładne skrobanie łuszczącej się farby', 'Przygotowanie do generalnego remontu', 'Tanie i sprawne usługi dla mieszkańców', 'Zmniejszenie zapylenia dzięki odpowiednim metodom']
);

export const KuciePlytek = createServicePage(
  'Kucie Płytek i Glazury Warszawa, Poznań',
  'Szybkie i bezpieczne usuwanie starej terakoty i gresu',
  'Oferujemy skuteczne kucie starych płytek ze ścian i podłóg w łazienkach oraz kuchniach na terenie Warszawy i Poznania. Pracujemy tak, aby nie uszkodzić instalacji wod-kan przebiegających pod kafelkami.',
  kuciePlytekImages,
  ['Praca wydajnymi elektronarzędziami', 'Ochrona istniejących instalacji', 'Błyskawiczne przygotowanie do nowego wykończenia', 'Kompleksowy wywóz urobku po pracy', 'Obsługa zleceń w Warszawie i Poznaniu']
);

export const SkuwaniePosadzek = createServicePage(
  'Skuwanie Posadzek i Betonu Warszawa, Poznań',
  'Efektywne kruszenie i usuwanie starych wylewek',
  'Wykonujemy skuwanie twardych posadzek betonowych i cementowych w domach, garażach i obiektach komercyjnych (Warszawa, Poznań). Nasi operatorzy ciężkiego sprzętu wyburzeniowego szybko i skutecznie usuną każdy beton.',
  skuwaniePosadzekImages,
  ['Kucie twardego betonu i subitu', 'Profesjonalne młoty wyburzeniowe', 'Oszczędność czasu w trakcie generalnego remontu', 'Znoszenie i utylizacja powstałego gruzu', 'Zlecenia dla klientów indywidualnych i firm']
);

export const SzlifowanieBetonu = createServicePage(
  'Szlifowanie i Frezowanie Betonu Warszawa, Poznań',
  'Wyrównywanie wylewek podłogowych i usuwanie kleju',
  'Specjalizujemy się w bezpyłowym szlifowaniu betonu i frezowaniu posadzek w Warszawie i Poznaniu. Przygotowujemy nierówne powierzchnie pod cienkie podłogi LVT, usuwamy resztki starego kleju, subitu oraz farb.',
  szlifowanieImages,
  ['Nowoczesne maszyny szlifierskie z odciągiem pyłu', 'Idealnie gładkie i równe posadzki', 'Skuteczne usuwanie najtwardszych powłok', 'Usługi na terenie Warszawy, Poznania i okolic', 'Szybka realizacja i perfekcyjne przygotowanie do montażu']
);

export const KucieTynkow = createServicePage(
  'Kucie Tynków Warszawa, Poznań',
  'Usuwanie starych tynków ze ścian i sufitów',
  'Oferujemy fachowe usługi kucia i zbijania starych tynków cementowo-wapiennych i gipsowych na terenie Warszawy i Poznania. Przywracamy ściany do stanu surowego, gotowego do kładzenia nowych tynków.',
  kucieTynkowImages,
  ['Kompleksowe oczyszczenie murów', 'Bezpieczeństwo i ostrożność', 'Prace przygotowawcze pod generalny remont kamienicy', 'Możliwość podstawienia kontenera na odpady', 'Fachowa ekipa z Warszawy i Poznania']
);

export const WnoszenieMateriaw = createServicePage(
  'Wnoszenie Materiałów Budowlanych Warszawa, Poznań',
  'Usługi silnych tragarzy - dostarczanie towarów na piętro',
  'Pomagamy przy wnoszeniu ciężkich materiałów budowlanych na wyższe piętra bez windy w Warszawie i Poznaniu. Wnosimy kleje, tynki, płyty kartonowo-gipsowe, okna oraz stal - zdejmując z Twoich barków najcięższą pracę fizyczną.',
  wnoszenieImages,
  ['Ekipa doświadczonych i silnych tragarzy', 'Szybki i sprawny rozładunek auta', 'Bezpieczne wnoszenie na najwyższe piętra', 'Oszczędność sił i czasu ekipy remontowej', 'Wsparcie na terenie całej Warszawy i Poznania']
);

export const WynoszamieGruzu = createServicePage(
  'Wynoszenie i Wywóz Gruzu Warszawa, Poznań',
  'Znoszenie gruzu w workach i opróżnianie z odpadów budowlanych',
  'Zajmujemy się wynoszeniem gruzu pakowanego w worki (lub luzem) ze strychów i pięter w Warszawie i Poznaniu. Oferujemy także podstawienie aut do wywozu i utylizacji resztek budowlanych po skończonym remoncie.',
  wynoszenieGruzuImages,
  ['Sprawne znoszenie bez brudzenia klatek', 'Legalna utylizacja na odpowiednich wysypiskach', 'Usługi wywozu zładunkiem (nie musisz nosić sam)', 'Różne pojemności aut transportowych', 'Najlepsze ceny dla Warszawy i Poznania']
);

export const SprzataniePoBudowie = createServicePage(
  'Sprzątanie Po Remoncie i Budowie Warszawa, Poznań',
  'Kompleksowe czyszczenie pobudowlane i poremontowe',
  'Oferujemy profesjonalne sprzątanie mieszkań i domów po zakończeniu inwestycji na terenie Warszawy i Poznania. Dokładnie myjemy okna z resztek farb, odkurzamy najdrobniejszy pył budowlany i doprowadzamy wnętrza do nieskazitelnej czystości.',
  sprzataniePoBudowieImages,
  ['Użycie specjalistycznych odkurzaczy i chemii', 'Bezpieczne mycie nowych powierzchni', 'Odświeżenie wnętrz gotowych do zamieszkania', 'Prace wykonywane w Warszawie, Poznaniu i okolicach', 'Krótki czas oczekiwania na realizację']
);

// ===== USŁUGI TRANSPORTOWE =====

export const Przeprowadzki = createServicePage(
  'Przeprowadzki i Transport Mebli Warszawa, Poznań',
  'Tanie przeprowadzki domów i biur (Warszawa, Poznań)',
  'Świadczymy usługi transportowe i przeprowadzkowe na najwyższym poziomie w Warszawie i Poznaniu. Nasi kierowcy i tragarze dbają o idealne zabezpieczenie Twoich mebli, sprzętu AGD i delikatnych rzeczy podczas transportu do nowego domu.',
  transportMebliImages,
  ['Kompleksowe zabezpieczenie mienia', 'Ekipa silnych i ostrożnych tragarzy', 'Obsługa przeprowadzek domów, mieszkań i firm', 'Ubezpieczenie transportowanego ładunku', 'Konkurencyjne ceny w Warszawie i Poznaniu']
);

export const Oprozniam = createServicePage(
  'Opróżnianie Mieszkań i Piwnic Warszawa, Poznań',
  'Wywóz starych mebli i kompleksowa likwidacja lokali',
  'Oferujemy błyskawiczne opróżnianie mieszkań, domów, piwnic i garaży na terenie Warszawy i Poznania. Zajmiemy się wyniesieniem starych mebli, sprzętów, ubrań i zalegających śmieci. Mieszkanie zostawiamy puste i czyste.',
  oproznianieImages,
  ['Znoszenie najcięższych gabarytów', 'Ekologiczna utylizacja sprzętu i mebli', 'Brak ukrytych kosztów za wnoszenie', 'Szybka interwencja po zakupie mieszkania lub po najemcach', 'Usługi dla Warszawy, Poznania i sąsiednich miast']
);

export const Utylizacja = createServicePage(
  'Utylizacja Odpadów Wielkogabarytowych Warszawa, Poznań',
  'Legalny wywóz śmieci i mebli do utylizacji',
  'Zapewniamy zgodną z prawem utylizację odpadów wielkogabarytowych i poremontowych w Warszawie i Poznaniu. Świadczymy usługi wywozu i demontażu szaf, kanap, RTV i innych niechcianych rzeczy bezpośrednio z Twojego lokalu.',
  utylizacjaImages,
  ['Wygodne rozwiązanie bez wynajmowania dużych kontenerów', 'Legalne gospodarowanie odpadami', 'Znoszenie przez naszych pracowników', 'Dbamy o ochronę środowiska', 'Szybki dojazd na terenie Warszawy i Poznania']
);

export const SprzataniePojmie = createServicePage(
  'Sprzątanie Mieszkań Po Wynajmie Warszawa, Poznań',
  'Generalne czyszczenie dla inwestorów i właścicieli',
  'Oferujemy dogłębne sprzątanie i odświeżanie mieszkań po problematycznych lokatorach w Warszawie i Poznaniu. Skutecznie usuwamy tłuszcz, osady z kamienia, nieprzyjemne zapachy i przygotowujemy lokal na przyjęcie nowych najemców.',
  sprzataniePojmieImages,
  ['Czyszczenie silnie zabrudzonych kuchni i łazienek', 'Możliwość ozonowania i prania mebli tapicerowanych', 'Niezbędne dla osób wynajmujących mieszkania w Warszawie i Poznaniu', 'Wysoka skuteczność działania dzięki silnej chemii', 'Podniesienie wartości lokalu na rynku wynajmu']
);

export const TransportMaterialow = createServicePage(
  'Transport Materiałów Budowlanych Warszawa, Poznań',
  'Usługi transportowe z marketów typu Castorama, Leroy Merlin, Obi',
  'Wykonujemy szybki transport materiałów budowlanych ze sklepów bezpośrednio na budowę na terenie Warszawy i Poznania. Dysponujemy pakownymi busami, a nasi kierowcy mogą pomóc we wniesieniu ciężkich palet i paczek pod same drzwi.',
  transportMebliImages,
  ['Błyskawiczne dostawy z marketów budowlanych', 'Duże auta mieszczące palety i długie elementy', 'Możliwość wykupienia opcji wniesienia', 'Oszczędność czasu - dowieziemy wszystko, czego zabrakło', 'Niezawodne wsparcie dla inwestycji w Warszawie i Poznaniu']
);

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
  'Kompleksowe Wykończenie Mieszkań Pod Klucz',
  'Pełne wykończenie mieszkania od A do Z',
  'Oferujemy kompleksowe usługi wykończenia mieszkań od podstaw. Nasze doświadczone zespoły zajmują się całym procesem - od przygotowania ścian, poprzez instalacje, aż do ostatnich detali. Gwarantujemy najwyższą jakość i terminowość realizacji. Każdy projekt traktujemy indywidualnie, dostosowując się do potrzeb i budżetu klienta.',
  kompleksoweImages,
  ['Kompleksowe rozwiązanie pod klucz', 'Profesjonalny zespół fachowców', 'Gwarancja jakości wykonania', 'Terminowa realizacja projektu', 'Przystępne i transparentne ceny']
);

export const Malowanie = createServicePage(
  'Malowanie',
  'Profesjonalne usługi malarskie ścian i sufitów',
  'Specjalizujemy się w profesjonalnym malowaniu ścian i sufitów. Używamy najwyższej jakości farb renomowanych producentów i nowoczesnych technik aplikacji. Nasze usługi obejmują przygotowanie powierzchni, gruntowanie oraz precyzyjne malowanie. Dbamy o każdy detal, aby efekt końcowy był perfekcyjny.',
  malowanieImages,
  ['Wysoka jakość farb renomowanych marek', 'Profesjonalne techniki aplikacji', 'Szybka i terminowa realizacja', 'Estetyczne i trwałe efekty', 'Przystępne ceny za m²']
);

export const GladzeniScian = createServicePage(
  'Gładzenie Ścian',
  'Perfekcyjne wyrównanie i wygładzenie ścian',
  'Usługa gładzenia ścian pozwala na osiągnięcie idealnie gładkiej powierzchni, gotowej do malowania lub tapetowania. Nasz zespół dysponuje wieloletnim doświadczeniem i profesjonalnym sprzętem do wykonania prac na najwyższym poziomie. Stosujemy najlepsze materiały gipsowe zapewniające trwałość.',
  gladzienieImages,
  ['Idealna gładkość powierzchni', 'Profesjonalny sprzęt i materiały', 'Szybka realizacja dużych powierzchni', 'Przygotowanie do malowania lub tapetowania', 'Gwarancja jakości wykonania']
);

export const Tynkowanie = createServicePage(
  'Tynkowanie',
  'Profesjonalne tynkowanie ścian wewnętrznych i zewnętrznych',
  'Oferujemy usługi tynkowania zarówno wewnętrznego jak i zewnętrznego. Pracujemy z najwyższej jakości materiałami tynkarskimi i gwarantujemy trwałość oraz estetykę. Wykonujemy tynki maszynowe i ręczne, dostosowując technologię do potrzeb projektu.',
  tynkowanieImages,
  ['Wysoka jakość materiałów tynkarskich', 'Profesjonalny i doświadczony zespół', 'Trwałość i odporność tynków', 'Estetyczne i równe powierzchnie', 'Gwarancja na wykonane prace']
);

export const KladaniePaneli = createServicePage(
  'Kładzenie Paneli',
  'Profesjonalny montaż paneli podłogowych',
  'Specjalizujemy się w montażu paneli podłogowych różnego typu - laminowanych, winylowych i drewnianych. Nasze usługi obejmują przygotowanie podłoża, układanie podkładu, precyzyjny montaż paneli i wykończenie listew przypodłogowych.',
  kladaniePaneliImages,
  ['Nowoczesny i estetyczny wygląd', 'Szybki i precyzyjny montaż', 'Trwałość i odporność', 'Profesjonalny zespół montażystów', 'Różne opcje materiałów i wzorów']
);

export const InstalacjeElektryczne = createServicePage(
  'Instalacje Elektryczne',
  'Bezpieczne i nowoczesne instalacje elektryczne',
  'Nasze doświadczone zespoły wykonują instalacje elektryczne zgodnie z najwyższymi normami bezpieczeństwa. Oferujemy zarówno nowe instalacje jak i modernizację istniejących systemów. Każda instalacja jest testowana i certyfikowana.',
  instalacjeElektryczneImages,
  ['Pełna zgodność z normami PN-IEC', 'Najwyższe standardy bezpieczeństwa', 'Profesjonalny zespół elektryków', 'Nowoczesne rozwiązania technologiczne', 'Gwarancja na wykonane prace']
);

export const KladaniePlytek = createServicePage(
  'Kładzenie Płytek',
  'Profesjonalne kładzenie płytek ceramicznych i porcelanowych',
  'Specjalizujemy się w profesjonalnym kładzeniu płytek ceramicznych, porcelanowych, gresowych i kamiennych. Nasze prace charakteryzują się precyzją, równymi fugami i estetycznym wyglądem. Wykonujemy układanie na ścianach i podłogach.',
  kladaniePlytekImages,
  ['Precyzyjne i równe kładzenie', 'Różne rodzaje płytek i formatów', 'Profesjonalny zespół glazurników', 'Trwałość i wodoodporność', 'Estetyczne wykończenie fug']
);

export const Posadzki = createServicePage(
  'Posadzki',
  'Profesjonalna instalacja i naprawa posadzek',
  'Oferujemy kompleksowe usługi instalacji posadzek - od przygotowania podłoża, poprzez wylewki, aż do wykończenia. Pracujemy z różnymi materiałami: betonem, żywicą, mikrocementem i innymi nowoczesnymi rozwiązaniami.',
  posadzkiImages,
  ['Różne rodzaje posadzek', 'Profesjonalne przygotowanie podłoża', 'Precyzyjne wylewki i wyrównanie', 'Nowoczesne materiały', 'Trwałość i estetyka']
);

export const WyburzeniRozbiorki = createServicePage(
  'Wyburzenia, Rozbiórki',
  'Profesjonalne prace rozbiórkowe i wyburzeniowe',
  'Specjalizujemy się w profesjonalnych pracach rozbiórkowych i wyburzeniach. Nasz zespół dysponuje nowoczesnym sprzętem i wieloletnim doświadczeniem do bezpiecznego i efektywnego wykonania nawet najtrudniejszych prac.',
  wyburzenieImages,
  ['Nowoczesny sprzęt rozbiórkowy', 'Bezpieczna realizacja prac', 'Profesjonalny i doświadczony zespół', 'Szybka i sprawna realizacja', 'Utylizacja odpadów w cenie']
);

export const DrapamieScian = createServicePage(
  'Drapanie Ścian z Farby i Innych Warstw',
  'Profesjonalne usuwanie starych warstw ze ścian',
  'Oferujemy profesjonalne usługi drapania ścian z farby, tapety i innych warstw. Nasze prace przygotowują powierzchnię do dalszych prac wykończeniowych - malowania, tynkowania lub gładzenia.',
  drapanieImages,
  ['Profesjonalny sprzęt do skrobania', 'Szybka realizacja dużych powierzchni', 'Przygotowanie do dalszych prac', 'Doświadczony zespół pracowników', 'Przystępne ceny za m²']
);

export const KuciePlytek = createServicePage(
  'Kucie Płytek',
  'Bezpieczne usuwanie starych płytek',
  'Specjalizujemy się w profesjonalnym kuciu i usuwaniu starych płytek ceramicznych. Nasze usługi obejmują bezpieczne i efektywne usuwanie płytek ze ścian i podłóg bez uszkodzenia podłoża.',
  kuciePlytekImages,
  ['Bezpieczne usuwanie bez uszkodzeń', 'Profesjonalny sprzęt pneumatyczny', 'Szybka realizacja prac', 'Przygotowanie do nowych płytek', 'Profesjonalny i doświadczony zespół']
);

export const SkuwaniePosadzek = createServicePage(
  'Skuwanie Posadzek',
  'Profesjonalne usuwanie starych posadzek',
  'Oferujemy profesjonalne usługi skuwania i usuwania starych posadzek betonowych, ceramicznych i innych. Nasze prace przygotowują podłoże do nowych posadzek i wylewek.',
  skuwaniePosadzekImages,
  ['Bezpieczne usuwanie posadzek', 'Profesjonalny sprzęt do skuwania', 'Szybka realizacja prac', 'Przygotowanie podłoża do nowych posadzek', 'Profesjonalny zespół pracowników']
);

export const SzlifowanieBetonu = createServicePage(
  'Szlifowanie Betonu',
  'Profesjonalne szlifowanie i polerowanie betonu',
  'Specjalizujemy się w profesjonalnym szlifowaniu betonu. Nasze usługi obejmują przygotowanie powierzchni, szlifowanie diamentowe i polerowanie. Oferujemy różne stopnie gładkości dostosowane do potrzeb klienta.',
  szlifowanieImages,
  ['Profesjonalny sprzęt diamentowy', 'Wysoka jakość szlifowania', 'Szybka realizacja dużych powierzchni', 'Różne stopnie gładkości', 'Gwarancja na wykonane prace']
);

export const KucieTynkow = createServicePage(
  'Kucie Tynków',
  'Profesjonalne usuwanie starych tynków',
  'Oferujemy profesjonalne usługi kucia i usuwania starych tynków ze ścian i sufitów. Nasze prace przygotowują ściany do nowych tynków, gładzenia lub innych materiałów wykończeniowych.',
  kucieTynkowImages,
  ['Bezpieczne usuwanie tynków', 'Profesjonalny sprzęt pneumatyczny', 'Szybka realizacja prac', 'Przygotowanie ścian do nowych tynków', 'Profesjonalny zespół pracowników']
);

export const WnoszenieMateriaw = createServicePage(
  'Wnoszenie Materiałów Budowlanych',
  'Transport materiałów na wyższe piętra',
  'Specjalizujemy się w profesjonalnym wnoszeniu materiałów budowlanych na wyższe piętra. Nasz zespół dysponuje odpowiednim sprzętem i doświadczeniem do bezpiecznego transportu ciężkich materiałów.',
  wnoszenieImages,
  ['Profesjonalny sprzęt transportowy', 'Bezpieczny transport materiałów', 'Szybka realizacja zleceń', 'Różne rodzaje materiałów', 'Przystępne ceny za usługę']
);

export const WynoszamieGruzu = createServicePage(
  'Wynoszenie Gruzu',
  'Profesjonalne usuwanie gruzu i odpadów budowlanych',
  'Oferujemy profesjonalne usługi wynoszenia gruzu i odpadów budowlanych. Nasze prace obejmują załadunek, transport i legalną utylizację wszystkich odpadów poremontowych.',
  wynoszenieGruzuImages,
  ['Szybka realizacja zleceń', 'Profesjonalny sprzęt do transportu', 'Bezpieczny załadunek i transport', 'Legalna utylizacja odpadów', 'Przystępne ceny za kontener']
);

export const SprzataniePoBudowie = createServicePage(
  'Sprzątanie Po Budowie',
  'Kompleksowe sprzątanie po pracach budowlanych',
  'Specjalizujemy się w profesjonalnym sprzątaniu po pracach budowlanych i remontowych. Nasze usługi obejmują usuwanie gruzu, odkurzanie pyłu, czyszczenie ścian, podłóg, okien i wszystkich powierzchni.',
  sprzataniePoBudowieImages,
  ['Kompleksowe sprzątanie całego obiektu', 'Profesjonalny zespół sprzątający', 'Szybka realizacja zleceń', 'Wysokie standardy czystości', 'Przystępne ceny za m²']
);

// ===== USŁUGI TRANSPORTOWE =====

export const Przeprowadzki = createServicePage(
  'Przeprowadzki, Transport Mebli',
  'Profesjonalne usługi przeprowadzek i transportu',
  'Oferujemy profesjonalne usługi przeprowadzek i transportu mebli na terenie całego kraju. Nasz zespół dysponuje odpowiednim sprzętem, pojazdami i doświadczeniem do bezpiecznego transportu Twoich rzeczy.',
  transportMebliImages,
  ['Bezpieczny transport mebli', 'Profesjonalny zespół tragarzy', 'Szybka realizacja przeprowadzki', 'Ubezpieczenie transportu', 'Przystępne ceny za usługę']
);

export const Oprozniam = createServicePage(
  'Opróżnianie Mieszkań Po Lokatorach',
  'Profesjonalne opróżnianie i czyszczenie mieszkań',
  'Specjalizujemy się w profesjonalnym opróżnianiu mieszkań po lokatorach. Nasze usługi obejmują usuwanie mebli, sprzętu AGD, odpadów i wszystkich pozostałości. Przygotowujemy mieszkanie do nowego wynajmu.',
  oproznianieImages,
  ['Szybka realizacja opróżniania', 'Profesjonalny zespół pracowników', 'Bezpieczny transport rzeczy', 'Legalna utylizacja odpadów', 'Przystępne ceny za usługę']
);

export const Utylizacja = createServicePage(
  'Utylizacja Odpadów',
  'Profesjonalna i legalna utylizacja odpadów',
  'Oferujemy profesjonalne usługi utylizacji odpadów budowlanych, remontowych i innych. Pracujemy zgodnie z przepisami ochrony środowiska i posiadamy wszystkie wymagane zezwolenia.',
  utylizacjaImages,
  ['Pełna zgodność z przepisami prawa', 'Profesjonalny zespół logistyczny', 'Bezpieczna i legalna utylizacja', 'Ochrona środowiska naturalnego', 'Przystępne ceny za kontener']
);

export const SprzataniePojmie = createServicePage(
  'Sprzątanie Po Najmie',
  'Kompleksowe sprzątanie po wynajmie mieszkania',
  'Specjalizujemy się w profesjonalnym sprzątaniu pomieszczeń po wynajmie. Nasze usługi obejmują kompleksowe czyszczenie, dezynfekcję, pranie tapicerki i przygotowanie mieszkania do nowych najemców.',
  sprzataniePojmieImages,
  ['Kompleksowe sprzątanie i dezynfekcja', 'Wysokie standardy czystości', 'Szybka realizacja zleceń', 'Profesjonalny zespół sprzątający', 'Mieszkanie gotowe do wynajęcia']
);

export const TransportMaterialow = createServicePage(
  'Transport i Wnoszenie Materiałów Budowlanych na Budowę',
  'Profesjonalny transport materiałów na budowę',
  'Specjalizujemy się w profesjonalnym transporcie i wnoszeniu materiałów budowlanych bezpośrednio na budowę. Nasze usługi obejmują załadunek, transport samochodami dostawczymi i rozładunek na miejscu.',
  transportMebliImages,
  ['Bezpieczny transport materiałów', 'Profesjonalny zespół tragarzy', 'Szybka realizacja dostaw', 'Różne rodzaje materiałów', 'Oszczędność czasu i kosztów']
);

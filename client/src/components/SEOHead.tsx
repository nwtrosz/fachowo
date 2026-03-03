import { useEffect } from 'react';

/**
 * SEO Head Component
 * Fachowo.net.pl - Structured Data & Meta Tags
 * 
 * Provides JSON-LD structured data for Google and other search engines
 */

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
}

export function SEOHead({ title, description, image }: SEOHeadProps) {
  useEffect(() => {
    const defaultTitle = 'Fachowo – Remonty i Transport | Poznań & Warszawa';
    const defaultDesc = 'Fachowo: Profesjonalne remonty i transport w Poznaniu oraz Warszawie. 10 lat doświadczenia i gwarancja rzetelności. Zamów bezpłatną wycenę!';
    // Fallback image using the converted hero.jpg
    const defaultImage = '/assets/hero.jpg';
    
    const fullTitle = title ? `${title} | Fachowo.net.pl` : defaultTitle;
    const fullDesc = description || defaultDesc;

    document.title = fullTitle;

    const updateMeta = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (property) el.setAttribute('property', name);
        else el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    updateMeta('description', fullDesc);
    
    // Build absolute image URL
    const imagePath = image || defaultImage;
    const absoluteImageUrl = imagePath.startsWith('http') 
      ? imagePath 
      : window.location.origin + imagePath;

    // Open Graph
    updateMeta('og:title', fullTitle, true);
    updateMeta('og:description', fullDesc, true);
    updateMeta('og:type', 'website', true);
    updateMeta('og:url', window.location.href, true);
    updateMeta('og:image', absoluteImageUrl, true);

    // Twitter
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', fullDesc);
    updateMeta('twitter:image', absoluteImageUrl);

  }, [title, description]);
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Fachowo.net.pl',
  description: 'Firma budowlana i transportowa obsługująca Poznań i Warszawę.',
  url: 'https://fachowo.net.pl',
  telephone: '+48 123 456 789',
  email: 'info@fachowo.net.pl',
  sameAs: [
    'https://www.facebook.com/fachowo.net.pl',
    'https://www.instagram.com/fachowo.net.pl',
  ],
  priceRange: '$$',
  areaServed: [
    {
      "@type": "City",
      "name": "Warszawa"
    },
    {
      "@type": "City",
      "name": "Poznań"
    }
  ],
  knowsAbout: [
    'Usługi budowlane Warszawa',
    'Remonty Poznań',
    'Układanie płytek',
    'Malowanie ścian',
    'Przeprowadzki Warszawa',
    'Wywóz gruzu Poznań',
  ],
};
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'W jakich miastach świadczycie usługi?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Świadczymy nasze fachowe usługi budowlane i transportowe głównie na terenie miast Poznań i Warszawa oraz w ich okolicach.',
        },
      },
      {
        '@type': 'Question',
        name: 'Czy oferujecie bezpłatną wycenę?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tak, oferujemy całkowicie bezpłatną i niezobowiązującą wycenę wszystkich prac remontowych, budowlanych oraz usług transportowych.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jakie usługi wykończeniowe realizujecie?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Realizujemy kompleksowe wykończenia pod klucz, w tym malowanie, układanie płytek, panele, gładzie gipsowe, tynkowanie oraz instalacje.',
        },
      },
      {
        '@type': 'Question',
        name: 'Czy zajmujecie się przeprowadzkami?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tak, oferujemy profesjonalne usługi transportowe i przeprowadzki dla klientów indywidualnych oraz firm w Warszawie i Poznaniu.',
        },
      },
    ],
  };

  const servicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'Service',
        name: 'Kompleksowe wykończenie mieszkań Warszawa i Poznań',
        description: 'Pełny zakres usług wykończeniowych dla mieszkań i domów.',
        provider: { '@type': 'LocalBusiness', name: 'Fachowo.net.pl' },
      },
      {
        '@type': 'Service',
        name: 'Fachowe Malowanie Warszawa i Poznań',
        description: 'Precyzyjne usługi malarskie dla domów i biur.',
        provider: { '@type': 'LocalBusiness', name: 'Fachowo.net.pl' },
      },
      {
        '@type': 'Service',
        name: 'Wylewki i posadzki maszynowe',
        description: 'Profesjonalna instalacja i naprawa posadzek.',
        provider: { '@type': 'LocalBusiness', name: 'Fachowo.net.pl' },
      },
      {
        '@type': 'Service',
        name: 'Przeprowadzki i transport Poznań, Warszawa',
        description: 'Bezpieczny transport mebli i przeprowadzki lokalne.',
        provider: { '@type': 'LocalBusiness', name: 'Fachowo.net.pl' },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
    </>
  );
}

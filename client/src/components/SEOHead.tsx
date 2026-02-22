import { useEffect } from 'react';

/**
 * SEO Head Component
 * Fachowo.eu - Structured Data & Meta Tags
 * 
 * Provides JSON-LD structured data for Google and other search engines
 */

interface SEOHeadProps {
  title?: string;
  description?: string;
}

export function SEOHead({ title, description }: SEOHeadProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} | Fachowo.eu` : 'Fachowo.eu - Usługi Budowlane i Transportowe';
    document.title = fullTitle;

    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
    }
  }, [title, description]);

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Fachowo.eu',
    description: 'Usługi budowlane, remontowe i transportowe - Poznań i Warszawa',
    url: 'https://fachowo.eu',
    telephone: '+48 61 345 6789',
    email: 'info@fachowo.eu',
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: 'ul. Budowlana 123',
        addressLocality: 'Poznań',
        postalCode: '61-999',
        addressCountry: 'PL',
      },
      {
        '@type': 'PostalAddress',
        streetAddress: 'ul. Konstruktorów 456',
        addressLocality: 'Warszawa',
        postalCode: '02-999',
        addressCountry: 'PL',
      },
    ],
    sameAs: [
      'https://www.facebook.com/fachowo.eu',
      'https://www.instagram.com/fachowo.eu',
    ],
    priceRange: '$$',
    areaServed: ['PL'],
    knowsAbout: [
      'Usługi budowlane',
      'Usługi remontowe',
      'Układanie podłóg',
      'Usługi transportowe',
      'Przeprowadzki',
      'Wywóz gruzu',
    ],
  };

  const servicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'Service',
        name: 'Kompleksowe wykończenie mieszkań pod klucz',
        description: 'Pełny zakres usług wykończeniowych dla mieszkań',
        provider: { '@type': 'LocalBusiness', name: 'Fachowo.eu' },
      },
      {
        '@type': 'Service',
        name: 'Malowanie',
        description: 'Usługi malarskie dla domów i biur',
        provider: { '@type': 'LocalBusiness', name: 'Fachowo.eu' },
      },
      {
        '@type': 'Service',
        name: 'Posadzki',
        description: 'Instalacja i naprawa posadzek betonowych',
        provider: { '@type': 'LocalBusiness', name: 'Fachowo.eu' },
      },
      {
        '@type': 'Service',
        name: 'Transport mebli i przeprowadzki',
        description: 'Transport mebli i przeprowadzki',
        provider: { '@type': 'LocalBusiness', name: 'Fachowo.eu' },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
    </>
  );
}

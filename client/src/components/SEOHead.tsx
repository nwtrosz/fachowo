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
    const defaultTitle = 'Fachowo.net.pl - Usługi Budowlane i Transportowe';
    const defaultDesc = 'Profesjonalne usługi budowlane, remontowe i transportowe w Poznaniu i Warszawie. Darmowa wycena w 24h.';
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
    description: 'Usługi budowlane, remontowe i transportowe - Poznań i Warszawa',
    url: 'https://fachowo.net.pl',
    telephone: '+48 61 345 6789',
    email: 'info@fachowo.net.pl',
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
      'https://www.facebook.com/fachowo.net.pl',
      'https://www.instagram.com/fachowo.net.pl',
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
        provider: { '@type': 'LocalBusiness', name: 'Fachowo.net.pl' },
      },
      {
        '@type': 'Service',
        name: 'Malowanie',
        description: 'Usługi malarskie dla domów i biur',
        provider: { '@type': 'LocalBusiness', name: 'Fachowo.net.pl' },
      },
      {
        '@type': 'Service',
        name: 'Posadzki',
        description: 'Instalacja i naprawa posadzek betonowych',
        provider: { '@type': 'LocalBusiness', name: 'Fachowo.net.pl' },
      },
      {
        '@type': 'Service',
        name: 'Transport mebli i przeprowadzki',
        description: 'Transport mebli i przeprowadzki',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
    </>
  );
}

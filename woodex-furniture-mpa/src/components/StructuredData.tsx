import { useEffect } from 'react';

interface StructuredDataProps {
  data: object;
}

const StructuredData = ({ data }: StructuredDataProps) => {
  useEffect(() => {
    const scriptId = 'structured-data';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(data);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [data]);

  return null;
};

export default StructuredData;

// Structured data generators
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Woodex Furniture',
  description: "Pakistan's premium custom office furniture manufacturer",
  url: 'https://9iexwhl63icz.space.minimax.io',
  logo: 'https://9iexwhl63icz.space.minimax.io/images/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+92-322-4000768',
    contactType: 'Customer Service',
    areaServed: 'PK',
    availableLanguage: ['en', 'ur'],
  },
  sameAs: [
    'https://facebook.com/woodexfurniture',
    'https://instagram.com/woodexfurniture',
    'https://linkedin.com/company/woodexfurniture',
  ],
});

export const getLocalBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://9iexwhl63icz.space.minimax.io/#business',
  name: 'Woodex Furniture',
  description: "Pakistan's premium custom office furniture manufacturer providing design-to-delivery solutions for modern workspaces",
  image: 'https://9iexwhl63icz.space.minimax.io/images/hero_background_7.jpg',
  telephone: '+92-322-4000768',
  email: 'info@woodexfurniture.pk',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'PK',
    addressLocality: 'Karachi',
    addressRegion: 'Sindh',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 24.8607,
    longitude: 67.0011,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '10:30',
      closes: '19:30',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '11:00',
      closes: '17:00',
    },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Office Furniture Solutions',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'Ergonomic Office Chairs',
          description: 'Premium comfort with advanced lumbar support',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'Executive Desks',
          description: 'Sophisticated design meets functionality',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'Office Workstations',
          description: 'Maximize productivity with modular solutions',
        },
      },
    ],
  },
});

export const getWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://9iexwhl63icz.space.minimax.io/#website',
  url: 'https://9iexwhl63icz.space.minimax.io',
  name: 'Woodex Furniture',
  description: "Pakistan's premium office furniture manufacturer",
  publisher: {
    '@id': 'https://9iexwhl63icz.space.minimax.io/#organization',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://9iexwhl63icz.space.minimax.io/products?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
  inLanguage: 'en-PK',
});

export const getProductSchema = (product: {
  name: string;
  description: string;
  image: string;
  category: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.image,
  brand: {
    '@type': 'Brand',
    name: 'Woodex Furniture',
  },
  category: product.category,
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'PKR',
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'Organization',
      name: 'Woodex Furniture',
    },
  },
});

export const getServiceSchema = (service: {
  name: string;
  description: string;
  areaServed?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: service.name,
  description: service.description,
  provider: {
    '@type': 'LocalBusiness',
    name: 'Woodex Furniture',
  },
  areaServed: {
    '@type': 'Country',
    name: service.areaServed || 'Pakistan',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: service.name,
  },
});

export const getFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const getBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

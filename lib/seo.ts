import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { getSiteUrl } from '@/lib/site';
import {
  PHONE_ALT_E164,
  PHONE_WHATSAPP_E164,
  PHONE_WHATSAPP_DISPLAY,
} from '@/lib/contact';

export const SITE_NAME = 'Khiva Shodlik Travel';
export const SITE_NAME_SHORT = 'Shodlik Travel';

/** NAP — keep identical on site, GBP, and directories */
export const BUSINESS = {
  name: SITE_NAME,
  legalName: SITE_NAME,
  email: 'info@khivashodliktravel.uz',
  telephone: PHONE_WHATSAPP_E164,
  telephoneAlt: PHONE_ALT_E164,
  telephoneDisplay: PHONE_WHATSAPP_DISPLAY,
  streetAddress: 'Ichan Kala area',
  addressLocality: 'Khiva',
  addressRegion: 'Xorazm Region',
  addressCountry: 'UZ',
  postalCode: '220900',
  latitude: 41.3783,
  longitude: 60.3639,
  priceRange: '$$',
  openingHours: 'Mo-Su 08:00-20:00',
  sameAs: [
    'https://www.facebook.com/',
    'https://www.instagram.com/',
  ],
} as const;

export const DEFAULT_OG_IMAGE = '/brand/khiva-shodlik-travel-logo.png';

export const PRIMARY_KEYWORDS = [
  'Khiva Tours',
  'Khiva Tour',
  'Khiva Travel Agency',
  'Khiva Excursions',
  'Khiva Guide',
  'Khiva City Tour',
  'Uzbekistan Tours',
  'Uzbekistan Travel Agency',
  'Khiva Day Tour',
  'Khiva Walking Tour',
] as const;

const OG_LOCALE: Record<string, string> = {
  en: 'en_US',
  ru: 'ru_RU',
  uz: 'uz_UZ',
};

type Locale = (typeof routing.locales)[number];

export function localePath(locale: string, path = ''): string {
  const normalized = path.startsWith('/') ? path : path ? `/${path}` : '';
  return `/${locale}${normalized}`;
}

export function absoluteUrl(locale: string, path = ''): string {
  return `${getSiteUrl()}${localePath(locale, path)}`;
}

export function buildLanguageAlternates(path = ''): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = absoluteUrl(locale, path);
  }
  languages['x-default'] = absoluteUrl(routing.defaultLocale, path);
  return languages;
}

export function buildPageMetadata({
  locale,
  path = '',
  title,
  description,
  keywords,
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
}: {
  locale: string;
  path?: string;
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(locale, path);
  const imageUrl = image.startsWith('http') ? image : `${getSiteUrl()}${image}`;
  const keywordList = keywords ?? [...PRIMARY_KEYWORDS];

  return {
    title,
    description,
    keywords: keywordList,
    alternates: {
      canonical: url,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale] ?? 'en_US',
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALE[l] ?? 'en_US'),
      images: [
        {
          url: imageUrl,
          width: 512,
          height: 512,
          alt: `${SITE_NAME} — Khiva tours and Uzbekistan excursions`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
        },
  };
}

export function travelAgencyJsonLd(locale: string) {
  const url = absoluteUrl(locale);
  return {
    '@context': 'https://schema.org',
    '@type': ['TravelAgency', 'LocalBusiness', 'TouristInformationCenter'],
    '@id': `${url}#organization`,
    name: BUSINESS.name,
    url,
    logo: `${getSiteUrl()}${DEFAULT_OG_IMAGE}`,
    image: `${getSiteUrl()}${DEFAULT_OG_IMAGE}`,
    description:
      'Licensed Khiva travel agency offering Khiva tours, city excursions, Khorezm day trips, Aral Sea adventures, and Uzbekistan tour packages.',
    email: BUSINESS.email,
    telephone: BUSINESS.telephone,
    priceRange: BUSINESS.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.addressLocality,
      addressRegion: BUSINESS.addressRegion,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.latitude,
      longitude: BUSINESS.longitude,
    },
    areaServed: [
      { '@type': 'City', name: 'Khiva' },
      { '@type': 'AdministrativeArea', name: 'Xorazm Region' },
      { '@type': 'Country', name: 'Uzbekistan' },
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '08:00',
      closes: '20:00',
    },
    sameAs: BUSINESS.sameAs,
  };
}

export function ichanKalaAttractionJsonLd(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: 'Itchan Kala (Ichan Kala)',
    description:
      'UNESCO World Heritage walled inner city of Khiva — mosques, minarets, madrasahs, and museums.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Khiva',
      addressRegion: 'Xorazm Region',
      addressCountry: 'UZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 41.3775,
      longitude: 60.3619,
    },
    isAccessibleForFree: false,
    touristType: ['Cultural tourism', 'Historical tourism'],
    containedInPlace: {
      '@type': 'City',
      name: 'Khiva',
    },
    url: absoluteUrl(locale, '/khiva-tours'),
  };
}

export function breadcrumbJsonLd(
  locale: string,
  items: { name: string; path?: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path ? absoluteUrl(locale, item.path) : undefined,
    })),
  };
}

export function faqPageJsonLd(faqs: { question: string; answer: string }[]) {
  return {
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
  };
}

export function tourProductJsonLd({
  locale,
  name,
  description,
  slug,
  image,
  price,
  currency,
}: {
  locale: string;
  name: string;
  description: string;
  slug: string;
  image?: string;
  price?: number;
  currency?: string;
}) {
  const url = absoluteUrl(locale, `/tours/${slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name,
    description,
    url,
    image: image?.startsWith('http') ? image : image ? `${getSiteUrl()}${image}` : undefined,
    provider: { '@id': `${absoluteUrl(locale)}#organization` },
    touristType: 'Leisure',
    ...(price != null && currency
      ? {
          offers: {
            '@type': 'Offer',
            price,
            priceCurrency: currency,
            availability: 'https://schema.org/InStock',
            url,
          },
        }
      : {}),
  };
}

export type SeoLocale = Locale;

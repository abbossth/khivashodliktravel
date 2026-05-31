export type Locale = 'en' | 'ru' | 'uz';

export interface LocalizedString {
  en: string;
  ru: string;
  uz: string;
}

export interface LocalizedStringArray {
  en: string[];
  ru: string[];
  uz: string[];
}

export interface ItineraryItem {
  day: number;
  title: LocalizedString;
  description: LocalizedString;
}

export type TourCategory = 'daytrip' | 'multiday' | 'shared' | 'private' | 'transfer';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
export type Currency = 'USD' | 'UZS';

export interface Tour {
  _id: string;
  title: LocalizedString;
  slug: string;
  description: LocalizedString;
  shortDescription: LocalizedString;
  images: string[];
  coverImage: string;
  price: number;
  currency: Currency;
  duration: string;
  groupSize: number;
  category: TourCategory;
  includes: LocalizedStringArray;
  excludes: LocalizedStringArray;
  itinerary: ItineraryItem[];
  highlights: LocalizedStringArray;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  tourId: string;
  tourTitle: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  guests: number;
  message: string;
  status: BookingStatus;
  createdAt: string;
}

export interface BlogPost {
  _id: string;
  title: LocalizedString;
  slug: string;
  content: LocalizedString;
  excerpt: LocalizedString;
  coverImage: string;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export function getLocalizedField(
  field: LocalizedString | undefined | null,
  locale: Locale
): string {
  if (!field) return '';
  return field[locale] || field.en || field.ru || field.uz || '';
}

export function getLocalizedArray(
  field: LocalizedStringArray | undefined | null,
  locale: Locale
): string[] {
  if (!field) return [];
  const localized = field[locale];
  if (Array.isArray(localized) && localized.length > 0) return localized;
  if (Array.isArray(field.en) && field.en.length > 0) return field.en;
  return [];
}

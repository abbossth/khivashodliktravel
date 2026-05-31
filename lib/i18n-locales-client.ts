import type { Locale } from '@/types';
import { isValidLocale, LOCALE_COOKIE } from '@/lib/i18n-locales';

/** Read admin/public locale cookie in the browser (client components only). */
export function getLocaleFromDocumentCookie(fallback: Locale = 'en'): Locale {
  if (typeof document === 'undefined') return fallback;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${LOCALE_COOKIE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`)
  );
  const value = match?.[1] ? decodeURIComponent(match[1]) : undefined;
  return isValidLocale(value) ? value : fallback;
}

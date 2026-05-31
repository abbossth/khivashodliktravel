import type { Locale } from '@/types';

export type { Locale };

export const LOCALES: Locale[] = ['en', 'ru', 'uz'];

export const LOCALE_COOKIE = 'NEXT_LOCALE';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  uz: "O'zbekcha",
};

export function isValidLocale(value: string | undefined | null): value is Locale {
  return Boolean(value && LOCALES.includes(value as Locale));
}

export function getLocaleFromCookie(
  cookieStore: { get: (name: string) => { value: string } | undefined },
  fallback: Locale = 'en'
): Locale {
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return isValidLocale(value) ? value : fallback;
}

export function setLocaleCookie(locale: Locale): void {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
}

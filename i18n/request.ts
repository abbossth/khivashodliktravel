import { getRequestConfig } from 'next-intl/server';
import { APP_TIME_ZONE } from '@/lib/i18n-config';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as 'en' | 'ru' | 'uz')) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: APP_TIME_ZONE,
  };
});

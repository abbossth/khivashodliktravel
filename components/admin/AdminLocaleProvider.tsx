'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { NextIntlClientProvider } from 'next-intl';
import type { Locale } from '@/types';
import { APP_TIME_ZONE } from '@/lib/i18n-config';
import { setLocaleCookie } from '@/lib/i18n-locales';
import { getLocaleFromDocumentCookie } from '@/lib/i18n-locales-client';
import en from '@/messages/en.json';
import ru from '@/messages/ru.json';
import uz from '@/messages/uz.json';

const MESSAGES: Record<Locale, typeof en> = { en, ru, uz };

type AdminLocaleContextValue = {
  locale: Locale;
  setAdminLocale: (locale: Locale) => void;
};

const AdminLocaleContext = createContext<AdminLocaleContextValue | null>(null);

export function useAdminLocale() {
  const ctx = useContext(AdminLocaleContext);
  if (!ctx) {
    throw new Error('useAdminLocale must be used within AdminLocaleProvider');
  }
  return ctx;
}

export default function AdminLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    setLocale(getLocaleFromDocumentCookie('en'));
  }, []);

  const setAdminLocale = useCallback((next: Locale) => {
    setLocaleCookie(next);
    setLocale(next);
  }, []);

  const value = useMemo(() => ({ locale, setAdminLocale }), [locale, setAdminLocale]);

  return (
    <AdminLocaleContext.Provider value={value}>
      <NextIntlClientProvider
        locale={locale}
        messages={MESSAGES[locale]}
        timeZone={APP_TIME_ZONE}
      >
        {children}
      </NextIntlClientProvider>
    </AdminLocaleContext.Provider>
  );
}

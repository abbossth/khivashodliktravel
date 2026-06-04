import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import RouteProgress from '@/components/shared/RouteProgress';
import JsonLd from '@/components/seo/JsonLd';
import SetHtmlLang from '@/components/seo/SetHtmlLang';
import { Toaster } from '@/components/ui/sonner';
import { routing } from '@/i18n/routing';
import { APP_TIME_ZONE } from '@/lib/i18n-config';
import { logError } from '@/lib/safe';
import { buildLanguageAlternates, travelAgencyJsonLd } from '@/lib/seo';
import enMessages from '@/messages/en.json';

const WhatsAppButton = dynamic(() => import('@/components/public/WhatsAppButton'), {
  ssr: false,
  loading: () => null,
});

export const revalidate = 300;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      languages: buildLanguageAlternates(''),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!routing.locales.includes(locale as 'en' | 'ru' | 'uz')) {
    notFound();
  }

  setRequestLocale(locale);

  let messages: Record<string, unknown> = enMessages as Record<string, unknown>;
  try {
    messages = await getMessages();
  } catch (error) {
    logError('LocaleLayout.getMessages', error);
  }

  return (
    <>
      <SetHtmlLang locale={locale} />
      <JsonLd data={travelAgencyJsonLd(locale)} />
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone={APP_TIME_ZONE}
      >
        <ErrorBoundary
          fallbackTitle="Something went wrong"
          fallbackMessage="The page could not load. Refresh the browser or run npm run dev:clean in the terminal."
        >
          <RouteProgress />
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
          <WhatsAppButton />
          <Toaster position="top-right" richColors />
        </ErrorBoundary>
      </NextIntlClientProvider>
    </>
  );
}

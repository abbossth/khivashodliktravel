import dynamic from 'next/dynamic';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import RouteProgress from '@/components/shared/RouteProgress';
import { routing } from '@/i18n/routing';
import { APP_TIME_ZONE } from '@/lib/i18n-config';
import { logError } from '@/lib/safe';

const WhatsAppButton = dynamic(() => import('@/components/public/WhatsAppButton'), {
  ssr: false,
});

const SonnerToaster = dynamic(
  () => import('@/components/ui/sonner').then((mod) => mod.Toaster),
  { ssr: false }
);

/** ISR: public pages revalidate every 5 minutes */
export const revalidate = 300;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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

  let messages: Record<string, unknown> = {};
  try {
    messages = await getMessages();
  } catch (error) {
    logError('LocaleLayout.getMessages', error);
  }

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone={APP_TIME_ZONE}
    >
      <RouteProgress />
      <Navbar />
      <main className="min-h-screen">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <Footer />
      <WhatsAppButton />
      <SonnerToaster position="top-right" richColors />
    </NextIntlClientProvider>
  );
}

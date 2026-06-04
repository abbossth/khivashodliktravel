import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import PageBreadcrumbs from '@/components/seo/PageBreadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import { buildPageMetadata, ichanKalaAttractionJsonLd, travelAgencyJsonLd } from '@/lib/seo';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'seo.about' });
  return buildPageMetadata({
    locale: params.locale,
    path: 'about',
    title: t('metaTitle'),
    description: t('metaDescription'),
    keywords: ['Khiva Travel Agency', 'Khiva Tours', 'Uzbekistan Tours', 'Private Guide in Khiva'],
  });
}

export default async function AboutPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const [seo, about, nav] = await Promise.all([
    getTranslations('seo.about'),
    getTranslations('about'),
    getTranslations('nav'),
  ]);

  return (
    <>
      <JsonLd data={[travelAgencyJsonLd(params.locale), ichanKalaAttractionJsonLd(params.locale)]} />
      <article className="page-shell py-12 md:py-16">
        <PageBreadcrumbs
          locale={params.locale}
          items={[
            { label: nav('home'), href: '/' },
            { label: seo('h1'), href: '/about' },
          ]}
        />
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-brand-blue md:text-4xl">{seo('h1')}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{seo('intro')}</p>
        </header>
        <div className="mx-auto mt-10 max-w-3xl space-y-6 text-muted-foreground">
          <h2 className="text-2xl font-semibold text-brand-blue">{about('title')}</h2>
          <p className="leading-relaxed">{about('body')}</p>
          <p className="leading-relaxed">{about('subtitle')}</p>
        </div>
        <div className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-3">
          <Button asChild className="bg-brand-orange hover:bg-brand-orange/90">
            <Link href="/khiva-tours">Khiva Tours</Link>
          </Button>
          <Button asChild variant="outline" className="border-brand-blue text-brand-blue">
            <Link href="/tours">{nav('tours')}</Link>
          </Button>
          <Button asChild variant="outline" className="border-brand-blue text-brand-blue">
            <Link href="/contact">{nav('contact')}</Link>
          </Button>
        </div>
      </article>
    </>
  );
}

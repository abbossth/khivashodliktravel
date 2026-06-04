import { setRequestLocale } from 'next-intl/server';
import SeoLandingTemplate from '@/components/seo/SeoLandingTemplate';
import { buildPageMetadata } from '@/lib/seo';
import { loadSeoLandingContent } from '@/lib/seo-landing';

export const revalidate = 300;

const PAGE = 'aralSeaTours' as const;
const PATH = 'aral-sea-tours';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const c = await loadSeoLandingContent(params.locale, PAGE);
  return buildPageMetadata({
    locale: params.locale,
    path: PATH,
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: c.keywords,
  });
}

export default async function AralSeaToursPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const c = await loadSeoLandingContent(params.locale, PAGE);

  return (
    <SeoLandingTemplate
      locale={params.locale}
      breadcrumbLabel={c.breadcrumbLabel}
      h1={c.h1}
      intro={c.intro}
      sections={c.sections}
      ctaTitle={c.ctaTitle}
      ctaSubtitle={c.ctaSubtitle}
      ctaContact={c.ctaContact}
      ctaTours={c.ctaTours}
      faqTitle={c.faqTitle}
      faqSubtitle={c.faqSubtitle}
      faqs={c.faqs}
      relatedTitle={c.relatedTitle}
      relatedLinks={c.relatedLinks}
    />
  );
}

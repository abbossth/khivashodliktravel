import { getTranslations } from 'next-intl/server';
import type { FaqItem } from '@/components/seo/FaqSection';

export type SeoLandingPageKey = 'khivaTours' | 'uzbekistanTours' | 'aralSeaTours';

const FAQ_COUNT = 6;

export async function loadSeoLandingContent(locale: string, page: SeoLandingPageKey) {
  const t = await getTranslations({ locale, namespace: `seo.${page}` });
  const common = await getTranslations({ locale, namespace: 'seo.common' });

  const faqs: FaqItem[] = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    question: t(`faqs.${i}.q`),
    answer: t(`faqs.${i}.a`),
  }));

  const sections = [0, 1, 2].map((i) => ({
    heading: t(`sections.${i}.heading`),
    paragraphs: [t(`sections.${i}.p1`), t(`sections.${i}.p2`)].filter(Boolean),
  }));

  const relatedLinks = [0, 1, 2, 3].map((i) => ({
    href: t(`related.${i}.href`),
    label: t(`related.${i}.label`),
  }));

  return {
    metaTitle: t('metaTitle'),
    metaDescription: t('metaDescription'),
    keywords: t.raw('keywords') as string[],
    path: t('path'),
    breadcrumbLabel: t('breadcrumb'),
    h1: t('h1'),
    intro: t('intro'),
    sections,
    ctaTitle: t('ctaTitle'),
    ctaSubtitle: t('ctaSubtitle'),
    faqTitle: t('faqTitle'),
    faqSubtitle: t('faqSubtitle'),
    faqs,
    relatedTitle: common('relatedTitle'),
    ctaContact: common('ctaContact'),
    ctaTours: common('ctaTours'),
    relatedLinks,
  };
}

import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import PageBreadcrumbs from '@/components/seo/PageBreadcrumbs';
import FaqSection, { type FaqItem } from '@/components/seo/FaqSection';
import JsonLd from '@/components/seo/JsonLd';
import { ichanKalaAttractionJsonLd, travelAgencyJsonLd } from '@/lib/seo';

type Section = { heading: string; paragraphs: string[] };

type RelatedLink = { href: string; label: string };

type SeoLandingTemplateProps = {
  locale: string;
  breadcrumbLabel: string;
  h1: string;
  intro: string;
  sections: Section[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaContact: string;
  ctaTours: string;
  faqTitle: string;
  faqSubtitle?: string;
  faqs: FaqItem[];
  relatedTitle: string;
  relatedLinks: RelatedLink[];
};

export default function SeoLandingTemplate({
  locale,
  breadcrumbLabel,
  h1,
  intro,
  sections,
  ctaTitle,
  ctaSubtitle,
  ctaContact,
  ctaTours,
  faqTitle,
  faqSubtitle,
  faqs,
  relatedTitle,
  relatedLinks,
}: SeoLandingTemplateProps) {
  return (
    <>
      <JsonLd data={[travelAgencyJsonLd(locale), ichanKalaAttractionJsonLd(locale)]} />
      <article className="page-shell py-12 md:py-16">
        <PageBreadcrumbs
          locale={locale}
          items={[
            { label: 'Home', href: '/' },
            { label: breadcrumbLabel },
          ]}
        />
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-brand-blue md:text-4xl lg:text-5xl">
            {h1}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{intro}</p>
        </header>

        <div className="mx-auto mt-14 max-w-3xl space-y-12">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-semibold text-brand-blue">{section.heading}</h2>
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="mt-3 leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <aside className="mx-auto mt-14 max-w-3xl rounded-2xl border bg-muted/30 p-6">
          <h2 className="text-lg font-semibold text-brand-blue">{relatedTitle}</h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {relatedLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-brand-orange underline-offset-4 hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div className="mx-auto mt-14 max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-brand-blue">{ctaTitle}</h2>
          <p className="mt-3 text-muted-foreground">{ctaSubtitle}</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-orange/90">
              <Link href="/contact">{ctaContact}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-brand-blue text-brand-blue">
              <Link href="/tours">{ctaTours}</Link>
            </Button>
          </div>
        </div>
      </article>
      <FaqSection title={faqTitle} subtitle={faqSubtitle} items={faqs} />
    </>
  );
}

import JsonLd from '@/components/seo/JsonLd';
import { faqPageJsonLd } from '@/lib/seo';

export type FaqItem = { question: string; answer: string };

type FaqSectionProps = {
  title: string;
  subtitle?: string;
  items: FaqItem[];
  className?: string;
};

export default function FaqSection({ title, subtitle, items, className }: FaqSectionProps) {
  return (
    <section className={className ?? 'page-shell py-16 md:py-20'} aria-labelledby="faq-heading">
      <JsonLd data={faqPageJsonLd(items)} />
      <div className="mx-auto max-w-3xl">
        <h2 id="faq-heading" className="text-center text-3xl font-bold text-brand-blue md:text-4xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-3 text-center text-lg text-muted-foreground">{subtitle}</p>
        ) : null}
        <dl className="mt-10 space-y-4">
          {items.map((faq) => (
            <div
              key={faq.question}
              className="rounded-xl border border-border/80 bg-card p-5 shadow-sm"
            >
              <dt className="text-base font-semibold text-brand-blue">{faq.question}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

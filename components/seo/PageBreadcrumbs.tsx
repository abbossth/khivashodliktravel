import { Link } from '@/i18n/routing';
import { ChevronRight } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd } from '@/lib/seo';

type Crumb = { label: string; href?: string };

type PageBreadcrumbsProps = {
  locale: string;
  items: Crumb[];
};

export default function PageBreadcrumbs({ locale, items }: PageBreadcrumbsProps) {
  const schemaItems = items.map((item) => ({
    name: item.label,
    path: item.href,
  }));

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(locale, schemaItems)} />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-1">
                {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />}
                {item.href && !isLast ? (
                  <Link href={item.href} className="hover:text-brand-blue">
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? 'font-medium text-brand-blue' : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import type { TourCategory } from '@/types';

const categories: (TourCategory | 'all')[] = [
  'all',
  'daytrip',
  'multiday',
  'shared',
  'private',
  'transfer',
];

interface ToursCategoryNavProps {
  active: TourCategory | 'all';
}

export default async function ToursCategoryNav({ active }: ToursCategoryNavProps) {
  const t = await getTranslations('tours');

  return (
    <div className="mb-10 flex flex-wrap justify-center gap-2">
      {categories.map((cat) => {
        const href = cat === 'all' ? '/tours' : `/tours?category=${cat}`;
        const isActive = active === cat;

        return (
          <Link
            key={cat}
            href={href}
            prefetch={true}
            className={cn(
              'inline-flex h-10 items-center justify-center rounded-full border px-4 text-sm font-medium transition-colors',
              isActive
                ? 'border-brand-blue bg-brand-blue text-white shadow-sm'
                : 'border-input bg-background hover:bg-muted'
            )}
          >
            {t(`categories.${cat}`)}
          </Link>
        );
      })}
    </div>
  );
}

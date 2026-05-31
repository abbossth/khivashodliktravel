import { getTranslations, setRequestLocale } from 'next-intl/server';
import TourGrid from '@/components/public/TourGrid';
import ToursCategoryNav from '@/components/public/ToursCategoryNav';
import SectionHeading from '@/components/shared/SectionHeading';
import { getTours } from '@/lib/data';
import type { TourCategory } from '@/types';

export const revalidate = 300;

const VALID_CATEGORIES: TourCategory[] = [
  'daytrip',
  'multiday',
  'shared',
  'private',
  'transfer',
];

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: 'tours' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function ToursPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { category?: string };
}) {
  setRequestLocale(params.locale);

  const rawCategory = searchParams.category;
  const activeCategory: TourCategory | 'all' =
    rawCategory && VALID_CATEGORIES.includes(rawCategory as TourCategory)
      ? (rawCategory as TourCategory)
      : 'all';

  const [t, tours] = await Promise.all([
    getTranslations('tours'),
    getTours({
      category: activeCategory === 'all' ? undefined : activeCategory,
      publishedOnly: true,
    }),
  ]);

  return (
    <div className="page-shell py-16 md:py-20">
      <SectionHeading title={t('title')} subtitle={t('subtitle')} />
      <ToursCategoryNav active={activeCategory} />
      <TourGrid tours={tours} emptyMessage={t('empty')} />
    </div>
  );
}

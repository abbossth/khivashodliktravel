import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { getTranslations, getLocale, setRequestLocale } from 'next-intl/server';
import { Clock, Users, Check, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import JsonLd from '@/components/seo/JsonLd';
import PageBreadcrumbs from '@/components/seo/PageBreadcrumbs';
import { buildPageMetadata, breadcrumbJsonLd, tourProductJsonLd } from '@/lib/seo';
import { normalizeImageUrl } from '@/lib/image-url';
import TourDetailGallery from '@/components/public/TourDetailGallery';
import TourGrid from '@/components/public/TourGrid';
import SectionHeading from '@/components/shared/SectionHeading';
import SafeHtml from '@/components/shared/SafeHtml';
import { getTourBySlug, getTours, getAllTourSlugs } from '@/lib/data';
import { getStaticTourBuildLimit } from '@/lib/static-build';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/types';
import { getLocalizedField, getLocalizedArray } from '@/types';

const BookingForm = dynamic(() => import('@/components/public/BookingForm'), {
  loading: () => (
    <div className="h-96 animate-pulse rounded-xl bg-muted" aria-hidden />
  ),
});

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const slugs = await getAllTourSlugs();
    if (!slugs.length) return [];

    const limit = getStaticTourBuildLimit();
    const buildSlugs = limit ? slugs.slice(0, limit) : slugs;

    return routing.locales.flatMap((locale) =>
      buildSlugs.map((slug) => ({ locale, slug }))
    );
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const tour = await getTourBySlug(params.slug);
  if (!tour) return { title: 'Tour Not Found' };

  const locale = params.locale as Locale;
  const title = getLocalizedField(tour.title, locale);
  const description = getLocalizedField(tour.shortDescription, locale);
  const image = normalizeImageUrl(tour.coverImage);

  return buildPageMetadata({
    locale: params.locale,
    path: `tours/${params.slug}`,
    title: `${title} | Khiva Tour`,
    description,
    image: image || undefined,
    keywords: ['Khiva Tours', 'Khiva Tour', 'Uzbekistan Tours', title],
  });
}

export default async function TourDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(params.locale);

  const [tour, t, nav, locale] = await Promise.all([
    getTourBySlug(params.slug),
    getTranslations('tours'),
    getTranslations('nav'),
    getLocale(),
  ]);
  if (!tour) notFound();

  const loc = locale as Locale;
  const title = getLocalizedField(tour.title, loc);
  const description = getLocalizedField(tour.description, loc);
  const highlights = getLocalizedArray(tour.highlights, loc);
  const includes = getLocalizedArray(tour.includes, loc);
  const excludes = getLocalizedArray(tour.excludes, loc);

  const relatedTours = (
    await getTours({
      category: tour.category,
      limit: 4,
    })
  ).filter((t) => t?._id && t._id !== tour._id).slice(0, 3);

  const cover = normalizeImageUrl(tour.coverImage);

  return (
    <div className="page-shell py-10 md:py-14">
      <PageBreadcrumbs
        locale={params.locale}
        items={[
          { label: nav('home'), href: '/' },
          { label: t('title'), href: '/tours' },
          { label: title, href: `/tours/${params.slug}` },
        ]}
      />
      <JsonLd
        data={[
          breadcrumbJsonLd(params.locale, [
            { name: nav('home'), path: '/' },
            { name: t('title'), path: '/tours' },
            { name: title, path: `/tours/${params.slug}` },
          ]),
          tourProductJsonLd({
            locale: params.locale,
            name: title,
            description: getLocalizedField(tour.shortDescription, loc),
            slug: params.slug,
            image: cover,
            price: tour.price,
            currency: tour.currency,
          }),
        ]}
      />
      <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
        <div className="lg:col-span-2">
          <TourDetailGallery
            coverImage={tour.coverImage}
            images={tour.images}
            title={title}
          />

          <h1 className="mb-4 text-3xl font-bold tracking-tight text-brand-blue md:text-4xl">
            {title}
          </h1>

          <div className="mb-6 flex flex-wrap gap-3">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {tour.duration}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="h-3 w-3" /> {tour.groupSize} {t('groupSize')}
            </Badge>
            <Badge className="bg-brand-orange text-lg">
              {tour.price} {tour.currency}
            </Badge>
          </div>

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
              <TabsTrigger value="itinerary">{t('tabs.itinerary')}</TabsTrigger>
              <TabsTrigger value="includes">{t('tabs.includes')}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <SafeHtml
                html={description.replace(/\n/g, '<br/>')}
                className="rich-content"
              />
              {highlights.length > 0 && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold">{t('highlights')}</h3>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>

            <TabsContent value="itinerary" className="mt-6 space-y-4">
              {tour.itinerary.map((day) => (
                <div key={day.day} className="card-elevated rounded-xl p-5">
                  <h4 className="font-semibold text-brand-blue">
                    {t('day')} {day.day}: {getLocalizedField(day.title, loc)}
                  </h4>
                  <p className="mt-2 text-muted-foreground">
                    {getLocalizedField(day.description, loc)}
                  </p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="includes" className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="mb-3 font-semibold text-green-700">{t('includes')}</h3>
                <ul className="space-y-2">
                  {includes.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-green-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-3 font-semibold text-red-700">{t('excludes')}</h3>
                <ul className="space-y-2">
                  {excludes.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <X className="mt-0.5 h-4 w-4 text-red-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <BookingForm tourId={tour._id} tourTitle={title} />
        </div>
      </div>

      {relatedTours.length > 0 && (
        <section className="mt-20 border-t pt-16">
          <SectionHeading title={t('related')} align="left" className="mb-8" />
          <TourGrid tours={relatedTours} />
        </section>
      )}
    </div>
  );
}

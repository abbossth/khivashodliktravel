import { getTranslations, getLocale } from 'next-intl/server';
import { Star, ExternalLink, Quote } from 'lucide-react';
import SectionHeading from '@/components/shared/SectionHeading';
import { PlatformLogo } from '@/components/public/ReviewPlatformLogos';
import {
  REVIEW_PLATFORMS,
  TRAVELER_REVIEWS,
  GOOGLE_REVIEWS_URL,
  type ReviewPlatform,
} from '@/lib/reviews';
import type { Locale } from '@/types';
import { getLocalizedField } from '@/types';
import { cn } from '@/lib/utils';

function StarRow({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const iconClass = size === 'md' ? 'h-5 w-5' : 'h-4 w-4';
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            iconClass,
            i < rating ? 'fill-brand-orange text-brand-orange' : 'fill-muted/40 text-muted/40'
          )}
        />
      ))}
    </div>
  );
}

const platformAccent: Record<
  ReviewPlatform,
  { ring: string; bg: string; hover: string }
> = {
  google: {
    ring: 'ring-blue-100',
    bg: 'bg-gradient-to-br from-white to-blue-50/80',
    hover: 'hover:border-blue-200 hover:shadow-blue-100/50',
  },
  trustpilot: {
    ring: 'ring-emerald-100',
    bg: 'bg-gradient-to-br from-white to-emerald-50/80',
    hover: 'hover:border-emerald-200 hover:shadow-emerald-100/50',
  },
  tripadvisor: {
    ring: 'ring-teal-100',
    bg: 'bg-gradient-to-br from-white to-teal-50/80',
    hover: 'hover:border-teal-200 hover:shadow-teal-100/50',
  },
};

function PlatformCard({
  platform,
  rating,
  reviewCount,
  url,
  name,
  reviewsLabel,
  readReviews,
}: {
  platform: ReviewPlatform;
  rating: string;
  reviewCount: string;
  url: string;
  name: string;
  reviewsLabel: string;
  readReviews: string;
}) {
  const accent = platformAccent[platform];

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group relative flex flex-col items-center rounded-2xl border border-border/70 p-6 text-center shadow-sm transition-all duration-300',
        accent.bg,
        accent.hover,
        'hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2'
      )}
    >
      <div
        className={cn(
          'mb-4 flex h-14 w-full max-w-[140px] items-center justify-center rounded-xl bg-white p-2 shadow-sm ring-1',
          accent.ring
        )}
      >
        {platform === 'trustpilot' ? (
          <div className="flex items-center gap-2">
            <PlatformLogo platform="trustpilot" className="h-9 w-9 shrink-0" />
            <span className="text-sm font-bold tracking-tight text-[#005128]">Trustpilot</span>
          </div>
        ) : platform === 'tripadvisor' ? (
          <div className="flex items-center gap-2">
            <PlatformLogo platform="tripadvisor" className="h-9 w-9 shrink-0" />
            <span className="text-sm font-bold tracking-tight text-[#000]">Tripadvisor</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <PlatformLogo platform="google" className="h-9 w-9 shrink-0" />
            <span className="text-sm font-bold tracking-tight text-[#4285F4]">Google</span>
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-bold tabular-nums text-brand-blue">{rating}</span>
        <span className="text-lg text-muted-foreground">/ 5</span>
      </div>

      <StarRow rating={5} size="md" />

      <p className="mt-2 text-sm text-muted-foreground">
        {reviewCount} {reviewsLabel}
      </p>

      <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue transition-colors group-hover:text-brand-orange">
        {readReviews}
        <ExternalLink className="h-3.5 w-3.5 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </p>

      <span className="sr-only">
        {name} — {rating}
      </span>
    </a>
  );
}

function ReviewCard({
  author,
  date,
  rating,
  text,
  source,
  postedOn,
}: {
  author: string;
  date: string;
  rating: number;
  text: string;
  source: ReviewPlatform;
  postedOn: string;
}) {
  const accent = platformAccent[source];

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-white p-6 shadow-sm transition-all duration-300',
        'hover:-translate-y-0.5 hover:border-border hover:shadow-md'
      )}
    >
      <Quote
        className="absolute right-4 top-4 h-10 w-10 text-brand-orange/15 transition-colors group-hover:text-brand-orange/25"
        aria-hidden
      />

      <div className="relative mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-brand-blue">{author}</p>
          <p className="text-xs text-muted-foreground">{date}</p>
        </div>
        <StarRow rating={rating} />
      </div>

      <p className="relative flex-1 text-sm leading-relaxed text-foreground/85">
        &ldquo;{text}&rdquo;
      </p>

      <div
        className={cn(
          'mt-5 flex items-center gap-2 border-t border-border/50 pt-4',
        )}
      >
        <div
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white p-1 shadow-sm ring-1',
            accent.ring
          )}
        >
          <PlatformLogo platform={source} className="h-5 w-5" />
        </div>
        <span className="text-xs font-medium text-muted-foreground">{postedOn}</span>
      </div>
    </article>
  );
}

export default async function ReviewsSection() {
  const t = await getTranslations('reviews');
  const locale = (await getLocale()) as Locale;

  const platformNames: Record<ReviewPlatform, string> = {
    google: t('platforms.google'),
    trustpilot: t('platforms.trustpilot'),
    tripadvisor: t('platforms.tripadvisor'),
  };

  const postedOnLabels: Record<ReviewPlatform, string> = {
    google: t('postedOn.google'),
    trustpilot: t('postedOn.trustpilot'),
    tripadvisor: t('postedOn.tripadvisor'),
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-20 md:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--brand-orange)/0.08),transparent)]"
        aria-hidden
      />

      <div className="page-shell relative">
        <SectionHeading title={t('title')} subtitle={t('subtitle')} />

        <p className="-mt-4 mb-8 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
          {t('trustedOn')}
        </p>

        <div className="mb-14 grid gap-4 sm:grid-cols-3 sm:gap-5">
          {REVIEW_PLATFORMS.map((p) => (
            <PlatformCard
              key={p.id}
              platform={p.id}
              rating={p.rating}
              reviewCount={p.reviewCount}
              url={p.url}
              name={platformNames[p.id]}
              reviewsLabel={t('reviewsCount')}
              readReviews={t('readOn', { platform: platformNames[p.id] })}
            />
          ))}
        </div>

        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-border" />
          <h3 className="text-center text-lg font-semibold text-brand-blue">
            {t('highlights')}
          </h3>
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-border" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TRAVELER_REVIEWS.map((review) => (
            <ReviewCard
              key={review.id}
              author={review.author}
              date={review.date}
              rating={review.rating}
              text={getLocalizedField(review.text, locale)}
              source={review.source}
              postedOn={postedOnLabels[review.source]}
            />
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-white px-6 py-3 text-sm font-semibold text-brand-blue shadow-sm transition-all hover:border-brand-orange/30 hover:bg-brand-orange/5 hover:text-brand-orange"
          >
            <PlatformLogo platform="google" className="h-5 w-5" />
            {t('writeReview')}
            <ExternalLink className="h-3.5 w-3.5 opacity-60" />
          </a>
        </div>
      </div>
    </section>
  );
}

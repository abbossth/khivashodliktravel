'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Clock, Users, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SafeImage from '@/components/shared/SafeImage';
import type { Tour, Locale } from '@/types';
import { getLocalizedField } from '@/types';

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  const t = useTranslations('tours');
  const locale = useLocale() as Locale;

  const title = getLocalizedField(tour.title, locale);
  const shortDesc = getLocalizedField(tour.shortDescription, locale);

  return (
    <Card className="group card-elevated overflow-hidden border-0">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <SafeImage
          src={tour.coverImage}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
        {tour.isFeatured && (
          <Badge className="absolute left-3 top-3 border-0 bg-brand-orange shadow-md">
            {t('featuredBadge')}
          </Badge>
        )}
        <p className="absolute bottom-3 left-3 right-3 text-lg font-semibold text-white drop-shadow-md line-clamp-2">
          {title}
        </p>
      </div>
      <CardContent className="p-5">
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {shortDesc}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1">
            <Clock className="h-3.5 w-3.5 text-brand-orange" />
            {tour.duration}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1">
            <Users className="h-3.5 w-3.5 text-brand-orange" />
            {tour.groupSize}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-3 border-t bg-muted/30 p-5">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t('from')}
          </span>
          <p className="text-xl font-bold text-brand-orange">
            {tour.price} {tour.currency}
          </p>
        </div>
        <Button asChild className="bg-brand-blue shadow-sm hover:bg-brand-blue/90">
          <Link href={`/tours/${tour.slug}`}>
            {t('viewDetails')}
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

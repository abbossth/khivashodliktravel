'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, Expand, Grid3X3 } from 'lucide-react';
import SafeImage from '@/components/shared/SafeImage';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface TourDetailGalleryProps {
  coverImage: string;
  images: string[];
  title: string;
}

function buildPhotoList(coverImage: string, images: string[]) {
  const seen = new Set<string>();
  const list: string[] = [];
  for (const src of [coverImage, ...images]) {
    if (src?.trim() && !seen.has(src)) {
      seen.add(src);
      list.push(src);
    }
  }
  return list.length > 0 ? list : [coverImage];
}

type MosaicSlot = {
  index: number;
  className: string;
  showMoreOverlay?: boolean;
};

function getMosaicSlots(count: number): MosaicSlot[] {
  if (count <= 0) return [];
  if (count === 1) {
    return [
      {
        index: 0,
        className: 'col-span-1 aspect-[16/9] min-h-[220px] sm:min-h-[280px] md:min-h-[400px]',
      },
    ];
  }
  if (count === 2) {
    return [
      { index: 0, className: 'col-span-1 min-h-[200px] md:min-h-[400px]' },
      { index: 1, className: 'col-span-1 min-h-[200px] md:min-h-[400px]' },
    ];
  }

  const visible = Math.min(count, 5);
  const slots: MosaicSlot[] = [
    {
      index: 0,
      className: cn(
        'col-span-2 row-span-2 min-h-[180px]',
        count === 3 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-2 md:row-span-2'
      ),
    },
  ];

  const sidePositions =
    count === 3
      ? ['md:col-start-3 md:row-start-1', 'md:col-start-3 md:row-start-2']
      : [
          'md:col-start-3 md:row-start-1',
          'md:col-start-4 md:row-start-1',
          'md:col-start-3 md:row-start-2',
          'md:col-start-4 md:row-start-2',
        ];

  for (let i = 1; i < visible; i++) {
    slots.push({
      index: i,
      className: sidePositions[i - 1] ?? '',
      showMoreOverlay: i === 4 && count > 5,
    });
  }

  return slots;
}

export default function TourDetailGallery({
  coverImage,
  images,
  title,
}: TourDetailGalleryProps) {
  const t = useTranslations('tours.gallery');
  const photos = useMemo(
    () => buildPhotoList(coverImage, images),
    [coverImage, images]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxGrid, setLightboxGrid] = useState(false);

  const count = photos.length;
  const mosaicSlots = getMosaicSlots(count);
  const extraPhotos = count > 5 ? count - 5 : 0;

  const openLightbox = useCallback((index: number, grid = false) => {
    setActiveIndex(index);
    setLightboxGrid(grid);
    setLightboxOpen(true);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i <= 0 ? count - 1 : i - 1));
  }, [count]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i >= count - 1 ? 0 : i + 1));
  }, [count]);

  useEffect(() => {
    if (!lightboxOpen || lightboxGrid) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, lightboxGrid, goPrev, goNext]);

  useEffect(() => {
    if (activeIndex >= count) setActiveIndex(0);
  }, [activeIndex, count]);

  const counterLabel = t('photoCounter', {
    current: activeIndex + 1,
    total: count,
  });

  const renderMosaicCell = (slot: MosaicSlot) => {
    const src = photos[slot.index];
    const isCover = slot.index === 0;
    return (
      <button
        key={`mosaic-${slot.index}-${src}`}
        type="button"
        onClick={() => openLightbox(slot.index)}
        className={cn(
          'group relative min-h-0 overflow-hidden bg-muted text-left ring-offset-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange',
          slot.className,
          activeIndex === slot.index && count > 1 && 'ring-2 ring-brand-orange ring-offset-2'
        )}
        aria-label={t('openPhoto', { n: slot.index + 1 })}
      >
        <SafeImage
          src={src}
          alt={isCover ? title : `${title} — ${slot.index + 1}`}
          fill
          priority={slot.index === 0}
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes={
            slot.index === 0
              ? '(max-width: 768px) 100vw, 50vw'
              : '(max-width: 768px) 50vw, 25vw'
          }
        />
        <span className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
        {isCover && count > 1 && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {t('cover')}
          </span>
        )}
        {slot.showMoreOverlay && extraPhotos > 0 && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-semibold text-white">
            {t('morePhotos', { count: extraPhotos })}
          </span>
        )}
        <span className="pointer-events-none absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
          <Expand className="h-4 w-4" />
        </span>
      </button>
    );
  };

  const filmstrip =
    count > 1 ? (
      <div
        className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:thin] snap-x snap-mandatory [&::-webkit-scrollbar]:h-1.5"
        role="tablist"
        aria-label={t('thumbnails')}
      >
        {photos.map((src, i) => (
          <button
            key={`thumb-${i}-${src}`}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={t('selectPhoto', { n: i + 1 })}
            onClick={() => setActiveIndex(i)}
            onDoubleClick={() => openLightbox(i)}
            className={cn(
              'relative h-[4.5rem] w-[5.5rem] shrink-0 snap-start overflow-hidden rounded-xl bg-muted transition sm:h-20 sm:w-24',
              i === activeIndex
                ? 'ring-2 ring-brand-orange ring-offset-2'
                : 'opacity-75 hover:opacity-100'
            )}
          >
            <SafeImage
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="96px"
            />
          </button>
        ))}
      </div>
    ) : null;

  return (
    <section className="mb-8" aria-label={t('sectionLabel')}>
      {/* Mobile: hero + controls */}
      {count > 1 && (
        <div className="relative mb-3 aspect-[16/9] overflow-hidden rounded-2xl bg-muted shadow-md md:hidden">
          <SafeImage
            src={photos[activeIndex]}
            alt={title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
          <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {counterLabel}
          </span>
          {activeIndex === 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {t('cover')}
            </span>
          )}
          <button
            type="button"
            onClick={() => openLightbox(activeIndex)}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/70"
            aria-label={t('expand')}
          >
            <Expand className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60"
            aria-label={t('previous')}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60"
            aria-label={t('next')}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Desktop mosaic */}
      <div
        className={cn(
          'hidden gap-2 overflow-hidden rounded-2xl shadow-md md:grid',
          count === 1 && 'grid-cols-1',
          count === 2 && 'grid-cols-2 md:min-h-[400px]',
          count === 3 && 'grid-cols-2 md:grid-cols-3 md:grid-rows-2 md:min-h-[420px]',
          count >= 4 && 'grid-cols-2 md:grid-cols-4 md:grid-rows-2 md:min-h-[440px]'
        )}
      >
        {mosaicSlots.map(renderMosaicCell)}
      </div>

      {count === 1 && (
        <button
          type="button"
          onClick={() => openLightbox(0)}
          className="group relative mb-3 block aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted shadow-md md:mb-0"
          aria-label={t('expand')}
        >
          <SafeImage
            src={photos[0]}
            alt={title}
            fill
            priority
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
          <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
            <Expand className="h-4 w-4" />
          </span>
        </button>
      )}

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {count > 1 && <div className="min-w-0 md:hidden">{filmstrip}</div>}
        {count > 5 && <div className="hidden min-w-0 md:block md:flex-1">{filmstrip}</div>}
        {count > 1 && (
          <button
            type="button"
            onClick={() => openLightbox(activeIndex, true)}
            className={cn(
              'inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-brand-blue shadow-sm transition hover:border-brand-orange/40 hover:text-brand-orange sm:self-center',
              !filmstrip && 'w-full'
            )}
          >
            <Grid3X3 className="h-4 w-4" />
            {t('viewAll', { count })}
          </button>
        )}
      </div>

      <Dialog
        open={lightboxOpen}
        onOpenChange={(open) => {
          setLightboxOpen(open);
          if (!open) setLightboxGrid(false);
        }}
      >
        <DialogContent
          showCloseButton
          className={cn(
            'fixed top-0 left-0 flex max-h-[100dvh] w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 bg-black/95 p-0 text-white ring-0 sm:top-0 sm:left-0 sm:max-w-none sm:translate-x-0 sm:translate-y-0',
            lightboxGrid ? 'overflow-y-auto' : 'overflow-hidden'
          )}
        >
          <DialogTitle className="sr-only">{t('lightboxTitle')}</DialogTitle>

          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <p className="text-sm font-medium text-white/90">{counterLabel}</p>
            <div className="flex items-center gap-2">
              {count > 1 && (
                <button
                  type="button"
                  onClick={() => setLightboxGrid((g) => !g)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-white/90 transition hover:bg-white/10"
                >
                  <Grid3X3 className="h-4 w-4" />
                  {lightboxGrid ? t('singleView') : t('gridView')}
                </button>
              )}
            </div>
          </div>

          {lightboxGrid ? (
            <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3 lg:grid-cols-4">
              {photos.map((src, i) => (
                <button
                  key={`lb-grid-${i}-${src}`}
                  type="button"
                  onClick={() => {
                    setActiveIndex(i);
                    setLightboxGrid(false);
                  }}
                  className={cn(
                    'relative aspect-[4/3] overflow-hidden rounded-lg bg-white/10',
                    i === activeIndex && 'ring-2 ring-brand-orange'
                  )}
                >
                  <SafeImage src={src} alt="" fill className="object-cover" sizes="25vw" />
                </button>
              ))}
            </div>
          ) : (
            <div className="relative flex min-h-0 flex-1 flex-col">
              <div className="relative mx-auto aspect-[16/10] w-full max-w-6xl flex-1 px-4 py-6 sm:px-8">
                <SafeImage
                  src={photos[activeIndex]}
                  alt={title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              {count > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-4"
                    aria-label={t('previous')}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-4"
                    aria-label={t('next')}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
              {count > 1 && (
                <div className="border-t border-white/10 px-4 py-3">
                  <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory">
                    {photos.map((src, i) => (
                      <button
                        key={`lb-thumb-${i}-${src}`}
                        type="button"
                        onClick={() => setActiveIndex(i)}
                        className={cn(
                          'relative h-14 w-20 shrink-0 snap-start overflow-hidden rounded-md',
                          i === activeIndex ? 'ring-2 ring-brand-orange' : 'opacity-60 hover:opacity-100'
                        )}
                      >
                        <SafeImage src={src} alt="" fill className="object-cover" sizes="80px" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

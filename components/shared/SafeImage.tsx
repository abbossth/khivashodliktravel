'use client';

import Image, { type ImageProps } from 'next/image';
import { useEffect, useState } from 'react';
import { FALLBACK_TOUR_IMAGE } from '@/lib/images';
import { cn } from '@/lib/utils';

type SafeImageProps = ImageProps & {
  fallbackSrc?: string;
};

export default function SafeImage({
  src,
  alt,
  className,
  fallbackSrc = FALLBACK_TOUR_IMAGE,
  loading,
  priority,
  ...props
}: SafeImageProps) {
  const resolved =
    typeof src === 'string' && src.trim().length > 0 ? src.trim() : fallbackSrc;
  const initial = resolved || fallbackSrc;
  const [imgSrc, setImgSrc] = useState(initial);

  useEffect(() => {
    const next =
      typeof src === 'string' && src.trim().length > 0 ? src.trim() : fallbackSrc;
    setImgSrc(next || fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      priority={priority}
      loading={priority ? undefined : loading ?? 'lazy'}
      className={cn(className)}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}

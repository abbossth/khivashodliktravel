'use client';

import SafeImage from '@/components/shared/SafeImage';
import { KHOREZM_IMAGES } from '@/lib/images';

export default function HeroBackground() {
  return (
    <SafeImage
      src={KHOREZM_IMAGES.ichanKala}
      alt="Ichan Kala, Khiva — Khorezm, Uzbekistan"
      fill
      priority
      className="object-cover scale-105"
      sizes="100vw"
    />
  );
}

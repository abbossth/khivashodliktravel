/** Local photos: Khiva, Khorezm fortresses, Aral Sea (public/images). Run `npm run images:download` to fetch. */
export const KHOREZM_IMAGES = {
  ichanKala: '/images/hero-ichan-kala.jpg',
  kaltaMinor: '/images/khiva-kalta-minor.jpg',
  kunyaArk: '/images/kunya-ark.jpg',
  ayazKala: '/images/ayaz-kala.jpg',
  ayazKalaOasis: '/images/ayaz-kala-oasis.jpg',
  toprakKala: '/images/toprak-kala.jpg',
  aralMoynaq: '/images/aral-moynaq.jpg',
} as const;

export const FALLBACK_TOUR_IMAGE = KHOREZM_IMAGES.ichanKala;

export const GALLERY_IMAGES: { src: string; alt: string }[] = [
  { src: KHOREZM_IMAGES.ichanKala, alt: 'Ichan Kala walls, Khiva' },
  { src: KHOREZM_IMAGES.kaltaMinor, alt: 'Kalta Minor minaret, Khiva' },
  { src: KHOREZM_IMAGES.ayazKala, alt: 'Ayaz Kala fortress, Khorezm' },
  { src: KHOREZM_IMAGES.toprakKala, alt: 'Toprak Kala palace ruins, Khorezm' },
  { src: KHOREZM_IMAGES.aralMoynaq, alt: 'Ship cemetery, Moynaq, Aral Sea' },
  { src: KHOREZM_IMAGES.kunyaArk, alt: 'Kunya Ark citadel, Ichan Kala, Khiva' },
  { src: KHOREZM_IMAGES.ayazKalaOasis, alt: 'Ayaz Kala in the Kyzylkum desert' },
];

/** Local Khorezm / Khiva / Aral images under public/images (see npm run images:download) */
export const IMG = {
  ichanKala: '/images/hero-ichan-kala.jpg',
  kaltaMinor: '/images/khiva-kalta-minor.jpg',
  kunyaArk: '/images/kunya-ark.jpg',
  ayazKala: '/images/ayaz-kala.jpg',
  ayazKalaOasis: '/images/ayaz-kala-oasis.jpg',
  toprakKala: '/images/toprak-kala.jpg',
  aralMoynaq: '/images/aral-moynaq.jpg',
};

/** @deprecated use IMG — kept for seed script compatibility */
export const img = {
  fortress: IMG.ayazKala,
  khiva: IMG.ichanKala,
  architecture: IMG.kaltaMinor,
  aral: IMG.aralMoynaq,
  toprak: IMG.toprakKala,
};

export function pickTourCover(titleEn) {
  const t = titleEn.toLowerCase();
  if (/muynak|aral|moynaq|ustyurt|sudochie/i.test(t)) return IMG.aralMoynaq;
  if (/khiva.*city|ichan kala|guided tour/i.test(t)) return IMG.ichanKala;
  if (/toprak/i.test(t)) return IMG.toprakKala;
  if (/mizdakhan|nukus|chilpik/i.test(t)) return IMG.ayazKalaOasis;
  if (/transfer|airport|border|urgench|bukhara|samarkand/i.test(t)) return IMG.kunyaArk;
  if (/fortress|qal|kala/i.test(t)) return IMG.ayazKala;
  return IMG.ayazKala;
}

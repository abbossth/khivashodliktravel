import { getTranslations } from 'next-intl/server';
import SectionHeading from '@/components/shared/SectionHeading';
import SafeImage from '@/components/shared/SafeImage';
import { GALLERY_IMAGES } from '@/lib/images';

export default async function GallerySection() {
  const t = await getTranslations('gallery');

  return (
    <section className="bg-slate-50 py-20">
      <div className="page-shell">
        <SectionHeading title={t('title')} subtitle={t('subtitle')} />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {GALLERY_IMAGES.map((img, i) => (
            <div
              key={img.src}
              className={`relative overflow-hidden rounded-xl bg-muted shadow-sm ${
                i === 0 ? 'col-span-2 row-span-2 aspect-[4/3] md:aspect-auto md:min-h-[320px]' : 'aspect-square'
              }`}
            >
              <SafeImage
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

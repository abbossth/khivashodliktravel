'use client';

import SafeImage from '@/components/shared/SafeImage';

interface TourDetailGalleryProps {
  coverImage: string;
  images: string[];
  title: string;
}

export default function TourDetailGallery({
  coverImage,
  images,
  title,
}: TourDetailGalleryProps) {
  const gallery = images.length > 0 ? images : [coverImage];

  return (
    <>
      <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-2xl bg-muted shadow-md">
        <SafeImage
          src={coverImage}
          alt={title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
      </div>

      {gallery.length > 1 && (
        <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {gallery.slice(0, 4).map((img) => (
            <div
              key={img}
              className="relative aspect-square overflow-hidden rounded-xl bg-muted"
            >
              <SafeImage src={img} alt="" fill className="object-cover" sizes="150px" />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

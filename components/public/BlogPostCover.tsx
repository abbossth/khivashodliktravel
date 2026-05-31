'use client';

import SafeImage from '@/components/shared/SafeImage';

interface BlogPostCoverProps {
  src: string;
  alt: string;
}

export default function BlogPostCover({ src, alt }: BlogPostCoverProps) {
  return (
    <div className="relative mb-8 aspect-[21/9] overflow-hidden rounded-2xl bg-muted shadow-md">
      <SafeImage src={src} alt={alt} fill priority className="object-cover" sizes="896px" />
    </div>
  );
}

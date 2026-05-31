'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SafeImage from '@/components/shared/SafeImage';
import type { BlogPost, Locale } from '@/types';
import { getLocalizedField } from '@/types';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const t = useTranslations('blog');
  const locale = useLocale() as Locale;

  const title = getLocalizedField(post.title, locale);
  const excerpt = getLocalizedField(post.excerpt, locale);

  return (
    <Card className="group card-elevated overflow-hidden border-0">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <SafeImage
          src={post.coverImage}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <CardContent className="p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>
        <time className="text-xs font-medium text-muted-foreground">
          {format(new Date(post.createdAt), 'MMMM d, yyyy')}
        </time>
        <h3 className="mt-2 text-lg font-semibold text-brand-blue line-clamp-2 group-hover:text-brand-orange">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {excerpt}
        </p>
        <Link
          href={`/blog/${post.slug}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-orange hover:gap-2 transition-all"
        >
          {t('readMore')}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

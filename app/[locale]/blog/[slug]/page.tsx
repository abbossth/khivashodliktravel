import { notFound } from 'next/navigation';
import { getTranslations, getLocale, setRequestLocale } from 'next-intl/server';
import { format } from 'date-fns';
import { Link } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';
import BlogPostCover from '@/components/public/BlogPostCover';
import SafeHtml from '@/components/shared/SafeHtml';
import { getBlogPostBySlug } from '@/lib/data';
import type { Locale } from '@/types';
import { getLocalizedField } from '@/types';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return { title: 'Post Not Found' };

  const locale = params.locale as Locale;
  return {
    title: getLocalizedField(post.title, locale),
    description: getLocalizedField(post.excerpt, locale),
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(params.locale);

  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const t = await getTranslations('blog');
  const locale = (await getLocale()) as Locale;

  const title = getLocalizedField(post.title, locale);
  const content = getLocalizedField(post.content, locale);

  return (
    <article className="page-shell max-w-4xl py-12 md:py-16">
      <Link
        href="/blog"
        className="mb-8 inline-flex text-sm font-medium text-brand-orange hover:underline"
      >
        ← {t('backToBlog')}
      </Link>

      <BlogPostCover src={post.coverImage} alt={title} />

      <div className="mb-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>

      <time className="text-sm font-medium text-muted-foreground">
        {format(new Date(post.createdAt), 'MMMM d, yyyy')}
      </time>

      <h1 className="mt-3 mb-8 text-3xl font-bold tracking-tight text-brand-blue md:text-4xl">
        {title}
      </h1>

      <SafeHtml html={content} className="rich-content" />
    </article>
  );
}

import { getTranslations, setRequestLocale } from 'next-intl/server';
import BlogCard from '@/components/public/BlogCard';
import { buildPageMetadata } from '@/lib/seo';
import SectionHeading from '@/components/shared/SectionHeading';
import { getBlogPosts } from '@/lib/data';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: 'blog' });
  return buildPageMetadata({
    locale: params.locale,
    path: 'blog',
    title: `${t('title')} | Khiva Travel Tips`,
    description: t('subtitle'),
    keywords: ['Things to do in Khiva', 'Khiva Tours', 'Uzbekistan Tours', 'Silk Road Tours Uzbekistan'],
  });
}

export default async function BlogPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  const [t, posts] = await Promise.all([
    getTranslations('blog'),
    getBlogPosts(),
  ]);

  return (
    <div className="page-shell py-16 md:py-20">
      <SectionHeading title={t('title')} subtitle={t('subtitle')} />

      {posts.length === 0 ? (
        <p className="rounded-xl border border-dashed py-16 text-center text-muted-foreground">
          {t('empty')}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

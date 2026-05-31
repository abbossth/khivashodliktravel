import dynamic from 'next/dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import HeroSection from '@/components/public/HeroSection';
import ServicesSection from '@/components/public/ServicesSection';
import TourGrid from '@/components/public/TourGrid';
import BlogCard from '@/components/public/BlogCard';
import SectionHeading from '@/components/shared/SectionHeading';
import { Button } from '@/components/ui/button';
import { getTours, getBlogPosts } from '@/lib/data';

const AboutSection = dynamic(() => import('@/components/public/AboutSection'));
const GallerySection = dynamic(() => import('@/components/public/GallerySection'));
const ReviewsSection = dynamic(() => import('@/components/public/ReviewsSection'));

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: 'hero' });
  return {
    title: 'Khiva Shodlik Travel',
    description: t('subtitle'),
  };
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  const [t, featuredTours, recentPosts] = await Promise.all([
    getTranslations(),
    getTours({ featured: true, limit: 6 }),
    getBlogPosts({ limit: 3 }),
  ]);

  return (
    <>
      <HeroSection />
      <ServicesSection />

      <section className="page-shell py-20">
        <SectionHeading title={t('tours.featured')} subtitle={t('tours.subtitle')} />
        <TourGrid tours={featuredTours} emptyMessage={t('tours.empty')} />
        <div className="mt-10 text-center">
          <Button asChild size="lg" className="bg-brand-blue">
            <Link href="/tours">{t('tours.allTours')}</Link>
          </Button>
        </div>
      </section>

      <AboutSection />
      <GallerySection />
      <ReviewsSection />

      {recentPosts.length > 0 && (
        <section className="page-shell py-20">
          <SectionHeading title={t('blog.recent')} subtitle={t('blog.subtitle')} />
          <div className="grid gap-6 md:grid-cols-3">
            {recentPosts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      )}

      <section className="relative overflow-hidden bg-brand-blue py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-orange/20 via-transparent to-transparent" />
        <div className="page-shell relative text-center">
          <h2 className="text-3xl font-bold md:text-4xl">{t('cta.title')}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">{t('cta.subtitle')}</p>
          <Button
            asChild
            size="lg"
            className="mt-8 h-12 bg-brand-orange px-8 shadow-lg hover:bg-brand-orange/90"
          >
            <Link href="/contact">{t('cta.button')}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}

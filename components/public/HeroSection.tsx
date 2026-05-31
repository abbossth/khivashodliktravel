import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin } from 'lucide-react';
import HeroBackground from './HeroBackground';

export default async function HeroSection() {
  const t = await getTranslations('hero');

  return (
    <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden">
      <HeroBackground />
      <div className="absolute inset-0 hero-gradient" />
      <div className="relative z-10 page-shell py-20 text-center text-white">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
          <MapPin className="h-4 w-4 text-brand-orange" />
          {t('badge')}
        </p>
        <h1 className="mb-5 text-balance text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
          {t('title')}
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-blue-50/95 md:text-xl">
          {t('subtitle')}
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-12 bg-brand-orange px-8 text-base shadow-lg shadow-brand-orange/25 hover:bg-brand-orange/90"
          >
            <Link href="/tours">
              {t('cta')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 border-white/40 bg-white/10 px-8 text-base text-white backdrop-blur hover:bg-white/20"
          >
            <Link href="/contact">{t('ctaSecondary')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

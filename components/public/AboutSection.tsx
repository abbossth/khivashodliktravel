import { getTranslations } from 'next-intl/server';
import SectionHeading from '@/components/shared/SectionHeading';

export default async function AboutSection() {
  const t = await getTranslations('about');

  return (
    <section className="bg-brand-blue py-20 text-white">
      <div className="page-shell max-w-3xl text-center">
        <SectionHeading
          title={t('title')}
          subtitle={t('subtitle')}
          className="[&_h2]:text-white [&_p]:text-blue-100 [&_div]:bg-brand-orange"
        />
        <p className="text-lg leading-relaxed text-blue-50/95">{t('body')}</p>
      </div>
    </section>
  );
}

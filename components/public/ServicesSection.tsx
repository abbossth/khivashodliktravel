import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Map, Users, Tent, Waves, Car, Bus } from 'lucide-react';
import SectionHeading from '@/components/shared/SectionHeading';

const services = [
  { key: 'privateDay', icon: Map, href: '/tours?category=private' },
  { key: 'sharedDay', icon: Users, href: '/tours?category=shared' },
  { key: 'twoDay', icon: Tent, href: '/tours?category=multiday' },
  { key: 'aral', icon: Waves, href: '/tours?category=multiday' },
  { key: 'transfers', icon: Car, href: '/tours?category=transfer' },
  { key: 'team', icon: Bus, href: '/contact' },
] as const;

export default async function ServicesSection() {
  const t = await getTranslations('services');

  return (
    <section className="page-shell py-20">
      <SectionHeading title={t('title')} subtitle={t('subtitle')} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map(({ key, icon: Icon, href }) => (
          <Link
            key={key}
            href={href}
            className="card-elevated group flex flex-col rounded-xl p-6 transition-transform hover:-translate-y-0.5"
          >
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10 transition-colors group-hover:bg-brand-orange/20">
              <Icon className="h-6 w-6 text-brand-orange" />
            </span>
            <h3 className="mb-2 text-lg font-semibold text-brand-blue">{t(`items.${key}.title`)}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t(`items.${key}.description`)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

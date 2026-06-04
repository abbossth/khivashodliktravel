import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { MapPin, Phone, Mail } from 'lucide-react';
import BrandLogo from '@/components/shared/BrandLogo';
import {
  PHONE_ALT_DISPLAY,
  PHONE_ALT_E164,
  PHONE_WHATSAPP_DISPLAY,
  PHONE_WHATSAPP_E164,
} from '@/lib/contact';

export default async function Footer() {
  const t = await getTranslations('footer');
  const nav = await getTranslations('nav');

  return (
    <footer className="border-t border-brand-blue/20 bg-brand-blue text-white">
      <div className="page-shell py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <BrandLogo
              variant="mark"
              theme="dark"
              className="mb-5"
              markClassName="h-14 w-14 sm:h-16 sm:w-16"
            />
            <p className="max-w-sm text-sm leading-relaxed text-blue-100/90">{t('description')}</p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-orange">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-2.5 text-sm text-blue-100">
              {[
                { href: '/', label: nav('home') },
                { href: '/khiva-tours', label: nav('khivaTours') },
                { href: '/uzbekistan-tours', label: nav('uzbekistanTours') },
                { href: '/aral-sea-tours', label: nav('aralTours') },
                { href: '/tours', label: nav('tours') },
                { href: '/about', label: nav('about') },
                { href: '/blog', label: nav('blog') },
                { href: '/contact', label: nav('contact') },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-orange">
              {t('contactInfo')}
            </h4>
            <ul className="space-y-3 text-sm text-blue-100">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
                {t('address')}
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-brand-orange" />
                <a href={`tel:${PHONE_WHATSAPP_E164}`} className="hover:text-white">
                  {PHONE_WHATSAPP_DISPLAY}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-brand-orange" />
                <a href={`tel:${PHONE_ALT_E164}`} className="hover:text-white">
                  {PHONE_ALT_DISPLAY}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-brand-orange" />
                <a href="mailto:info@khivashodliktravel.uz" className="hover:text-white">
                  info@khivashodliktravel.uz
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/15 pt-8 text-center text-sm text-blue-200/80">
          © {new Date().getFullYear()} Khiva Shodlik Travel. {t('rights')}
        </div>
      </div>
    </footer>
  );
}

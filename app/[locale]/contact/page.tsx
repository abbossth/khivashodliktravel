import { getTranslations, setRequestLocale } from 'next-intl/server';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import SectionHeading from '@/components/shared/SectionHeading';
import ContactInquiryForm from '@/components/public/ContactInquiryForm';
import { Card, CardContent } from '@/components/ui/card';
import {
  PHONE_ALT_DISPLAY,
  PHONE_ALT_E164,
  PHONE_WHATSAPP_DISPLAY,
  PHONE_WHATSAPP_E164,
} from '@/lib/contact';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: 'contact' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function ContactPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  const t = await getTranslations('contact');

  const contactItems = [
    { icon: MapPin, label: t('addressLabel'), value: t('address') },
    {
      icon: Phone,
      label: t('phone'),
      value: PHONE_WHATSAPP_DISPLAY,
      href: `tel:${PHONE_WHATSAPP_E164}`,
    },
    {
      icon: Phone,
      label: t('phoneAlt'),
      value: PHONE_ALT_DISPLAY,
      href: `tel:${PHONE_ALT_E164}`,
    },
    {
      icon: Mail,
      label: t('email'),
      value: 'info@khivashodliktravel.uz',
      href: 'mailto:info@khivashodliktravel.uz',
    },
    { icon: Clock, label: t('hours'), value: t('hoursValue') },
  ];

  return (
    <div className="page-shell py-16 md:py-20">
      <SectionHeading title={t('title')} subtitle={t('subtitle')} />

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          {contactItems.map(({ icon: Icon, label, value, href }) => (
            <Card key={label} className="card-elevated border-0">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10">
                  <Icon className="h-5 w-5 text-brand-orange" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{label}</p>
                  {href ? (
                    <a href={href} className="font-semibold text-brand-blue hover:text-brand-orange">
                      {value}
                    </a>
                  ) : (
                    <p className="font-semibold text-brand-blue">{value}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="overflow-hidden rounded-2xl border shadow-sm">
            <iframe
              title="Khiva map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.2!2d60.3633!3d41.3783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x41f9c8c8b8b8b8b9%3A0x0!2z0KLQtdGB0YLQuNC90YHQutC40Y8g0KXQtdGA0LXQvQ!5e0!3m2!1sen!2s!4v1"
              width="100%"
              height="280"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <ContactInquiryForm />
      </div>
    </div>
  );
}

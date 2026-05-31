'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { Mail } from 'lucide-react';
import WhatsAppIcon from '@/components/shared/WhatsAppIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  buildBookingMailtoUrl,
  buildBookingWhatsAppUrl,
  type BookingMessageLabels,
} from '@/lib/booking-outreach';
import { bookingFormSchema, type BookingFormValues } from '@/lib/validations';

interface BookingFormProps {
  tourId: string;
  tourTitle: string;
}

export default function BookingForm({ tourTitle }: BookingFormProps) {
  const t = useTranslations('booking');
  const locale = useLocale();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      date: '',
      guests: '1',
      message: '',
    },
  });

  const labels: BookingMessageLabels = {
    intro: t('whatsappIntro'),
    tour: t('labelTour'),
    name: t('name'),
    email: t('email'),
    phone: t('phone'),
    date: t('date'),
    guests: t('guests'),
    message: t('message'),
    emailSubject: t('emailSubject'),
    none: t('none'),
  };

  const toPayload = (data: BookingFormValues) => ({
    tourTitle,
    name: data.name,
    email: data.email,
    phone: data.phone,
    date: data.date,
    guests: data.guests,
    message: data.message,
  });

  const openWhatsApp = handleSubmit((data) => {
    const url = buildBookingWhatsAppUrl(toPayload(data), labels, locale);
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  const openEmail = handleSubmit((data) => {
    window.location.href = buildBookingMailtoUrl(toPayload(data), labels, locale);
  });

  const fieldError = (key: keyof BookingFormValues) =>
    errors[key]?.message ? (
      <p className="mt-1 text-xs text-destructive">{String(errors[key]?.message)}</p>
    ) : null;

  return (
    <Card className="overflow-hidden border-0 shadow-xl ring-1 ring-brand-blue/10">
      <CardHeader className="bg-gradient-to-r from-brand-blue to-brand-blue/90 py-5 text-white">
        <CardTitle className="text-lg">{t('title')}</CardTitle>
        <p className="text-sm text-blue-100/90 line-clamp-1">{tourTitle}</p>
      </CardHeader>
      <CardContent className="p-6">
        <p className="mb-4 text-sm text-muted-foreground">{t('subtitle')}</p>
        <form className="space-y-4" noValidate onSubmit={(e) => e.preventDefault()}>
          <div>
            <Label htmlFor="booking-name">{t('name')}</Label>
            <Input id="booking-name" autoComplete="name" {...register('name')} className="mt-1" />
            {fieldError('name')}
          </div>

          <div>
            <Label htmlFor="booking-email">{t('email')}</Label>
            <Input
              id="booking-email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className="mt-1"
            />
            {fieldError('email')}
          </div>

          <div>
            <Label htmlFor="booking-phone">{t('phone')}</Label>
            <Input
              id="booking-phone"
              type="tel"
              autoComplete="tel"
              {...register('phone')}
              className="mt-1"
            />
            {fieldError('phone')}
          </div>

          <div>
            <Label htmlFor="booking-date">{t('date')}</Label>
            <Input
              id="booking-date"
              type="date"
              className="mt-1"
              min={new Date().toISOString().split('T')[0]}
              {...register('date')}
            />
            {fieldError('date')}
          </div>

          <div>
            <Label htmlFor="booking-guests">{t('guests')}</Label>
            <Input
              id="booking-guests"
              type="number"
              min={1}
              max={50}
              {...register('guests')}
              className="mt-1"
            />
            {fieldError('guests')}
          </div>

          <div>
            <Label htmlFor="booking-message">{t('message')}</Label>
            <Textarea id="booking-message" {...register('message')} className="mt-1" rows={3} />
          </div>

          <div className="flex flex-col gap-2 pt-1 sm:flex-row">
            <Button
              type="button"
              className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] text-white"
              onClick={openWhatsApp}
            >
              <span className="mr-2 inline-flex h-4 w-4 shrink-0">
                <WhatsAppIcon className="text-white" />
              </span>
              {t('bookWhatsApp')}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-brand-blue text-brand-blue hover:bg-brand-blue/5"
              onClick={openEmail}
            >
              <Mail className="mr-2 h-4 w-4" />
              {t('bookEmail')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

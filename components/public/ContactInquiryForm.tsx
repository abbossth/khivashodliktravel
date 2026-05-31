'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Mail } from 'lucide-react';
import WhatsAppIcon from '@/components/shared/WhatsAppIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  buildInquiryMailtoUrl,
  buildInquiryWhatsAppUrl,
  type InquiryMessageLabels,
} from '@/lib/inquiry-outreach';
import { inquiryFormSchema, type InquiryFormValues } from '@/lib/validations';
import { logError } from '@/lib/safe';

async function saveInquiryInBackground(
  data: InquiryFormValues,
  defaultSubject: string
): Promise<void> {
  try {
    await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        subject: data.tourInterest?.trim() || defaultSubject,
      }),
    });
  } catch (error) {
    logError('saveInquiryInBackground', error);
  }
}

export default function ContactInquiryForm() {
  const t = useTranslations('contact');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      tourInterest: '',
      message: '',
    },
  });

  const labels: InquiryMessageLabels = {
    intro: t('form.whatsappIntro'),
    name: t('form.name'),
    email: t('form.email'),
    phone: t('form.phone'),
    tourInterest: t('form.tourInterest'),
    message: t('form.message'),
    emailSubject: t('form.emailSubject'),
    none: t('form.none'),
  };

  const toPayload = (data: InquiryFormValues) => ({
    name: data.name,
    email: data.email,
    phone: data.phone,
    tourInterest: data.tourInterest,
    message: data.message,
  });

  const openWhatsApp = handleSubmit((data) => {
    void saveInquiryInBackground(data, t('form.defaultSubject'));
    window.open(buildInquiryWhatsAppUrl(toPayload(data), labels), '_blank', 'noopener,noreferrer');
  });

  const openEmail = handleSubmit((data) => {
    void saveInquiryInBackground(data, t('form.defaultSubject'));
    window.location.href = buildInquiryMailtoUrl(toPayload(data), labels);
  });

  const fieldError = (key: keyof InquiryFormValues) =>
    errors[key]?.message ? (
      <p className="mt-1 text-xs text-destructive">{String(errors[key]?.message)}</p>
    ) : null;

  return (
    <Card className="card-elevated border-0">
      <CardHeader>
        <CardTitle className="text-brand-blue">{t('form.title')}</CardTitle>
        <p className="text-sm text-muted-foreground">{t('form.subtitle')}</p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" noValidate onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="inq-name">{t('form.name')}</Label>
              <Input id="inq-name" autoComplete="name" {...register('name')} className="mt-1" />
              {fieldError('name')}
            </div>
            <div>
              <Label htmlFor="inq-phone">{t('form.phone')}</Label>
              <Input
                id="inq-phone"
                type="tel"
                autoComplete="tel"
                {...register('phone')}
                className="mt-1"
              />
              {fieldError('phone')}
            </div>
          </div>
          <div>
            <Label htmlFor="inq-email">{t('form.email')}</Label>
            <Input
              id="inq-email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className="mt-1"
            />
            {fieldError('email')}
          </div>
          <div>
            <Label htmlFor="inq-tour">{t('form.tourInterest')}</Label>
            <Input
              id="inq-tour"
              placeholder={t('form.tourPlaceholder')}
              {...register('tourInterest')}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="inq-message">{t('form.message')}</Label>
            <Textarea id="inq-message" rows={4} {...register('message')} className="mt-1" />
            {fieldError('message')}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] text-white"
              onClick={openWhatsApp}
            >
              <span className="mr-2 inline-flex h-4 w-4 shrink-0">
                <WhatsAppIcon className="text-white" />
              </span>
              {t('form.sendWhatsApp')}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-brand-blue text-brand-blue hover:bg-brand-blue/5"
              onClick={openEmail}
            >
              <Mail className="mr-2 h-4 w-4" />
              {t('form.sendEmail')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

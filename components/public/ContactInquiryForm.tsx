'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Loader2, Mail } from 'lucide-react';
import WhatsAppIcon from '@/components/shared/WhatsAppIcon';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { parseJsonResponse } from '@/hooks/useSafeFetch';
import { getWhatsAppDigits } from '@/lib/contact';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  tourInterest: z.string().optional(),
  message: z.string().min(10),
});

type FormValues = z.infer<typeof schema>;

export default function ContactInquiryForm() {
  const whatsapp = getWhatsAppDigits();
  const t = useTranslations('contact');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          subject: data.tourInterest || t('form.defaultSubject'),
        }),
      });
      const parsed = await parseJsonResponse(res);
      if (!parsed.ok) {
        throw new Error(parsed.error ?? 'Failed');
      }
      toast.success(t('form.success'));
      reset();
    } catch {
      toast.error(t('form.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    const v = getValues();
    const text = encodeURIComponent(
      `${t('form.whatsappIntro')}\n${v.name || ''}\n${v.tourInterest || ''}\n${v.message || ''}`
    );
    window.open(`https://wa.me/${whatsapp}?text=${text}`, '_blank');
  };

  return (
    <Card className="card-elevated border-0">
      <CardHeader>
        <CardTitle className="text-brand-blue">{t('form.title')}</CardTitle>
        <p className="text-sm text-muted-foreground">{t('form.subtitle')}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="inq-name">{t('form.name')}</Label>
              <Input id="inq-name" {...register('name')} className="mt-1" />
              {errors.name && (
                <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="inq-phone">{t('form.phone')}</Label>
              <Input id="inq-phone" {...register('phone')} className="mt-1" />
              {errors.phone && (
                <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="inq-email">{t('form.email')}</Label>
            <Input id="inq-email" type="email" {...register('email')} className="mt-1" />
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
            )}
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
            {errors.message && (
              <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="submit" className="flex-1 bg-brand-blue" disabled={submitting}>
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  {t('form.submit')}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-[#25D366] text-[#128C7E] hover:bg-[#25D366]/10"
              onClick={openWhatsApp}
            >
              <span className="mr-2 inline-flex h-4 w-4 shrink-0">
                <WhatsAppIcon />
              </span>
              WhatsApp
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

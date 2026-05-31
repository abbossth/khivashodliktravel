'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { parseJsonResponse } from '@/hooks/useSafeFetch';
import { bookingFormSchema, type BookingFormValues } from '@/lib/validations';

interface BookingFormProps {
  tourId: string;
  tourTitle: string;
}

export default function BookingForm({ tourId, tourTitle }: BookingFormProps) {
  const t = useTranslations('booking');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
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

  const onSubmit = async (data: BookingFormValues) => {
    setSubmitting(true);
    try {
      const parsedDate = new Date(`${data.date}T12:00:00`);
      if (Number.isNaN(parsedDate.getTime())) {
        toast.error(t('error'));
        return;
      }

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourId,
          tourTitle,
          name: data.name,
          email: data.email,
          phone: data.phone,
          date: parsedDate.toISOString(),
          guests: Number(data.guests),
          message: data.message ?? '',
        }),
      });

      const parsed = await parseJsonResponse(res);
      if (!parsed.ok) {
        throw new Error(parsed.error ?? 'Failed');
      }

      toast.success(t('success'));
      reset({
        name: '',
        email: '',
        phone: '',
        date: '',
        guests: '1',
        message: '',
      });
    } catch {
      toast.error(t('error'));
    } finally {
      setSubmitting(false);
    }
  };

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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

          <Button
            type="submit"
            className="w-full bg-brand-orange hover:bg-brand-orange/90"
            disabled={submitting}
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : t('submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

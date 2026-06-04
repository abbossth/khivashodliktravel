'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import {
  CalendarDays,
  Mail,
  MessageSquare,
  Minus,
  Plus,
  Phone,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import WhatsAppIcon from '@/components/shared/WhatsAppIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  buildBookingEmailParts,
  buildBookingWhatsAppUrl,
  getAgencyEmail,
  type BookingMessageLabels,
} from '@/lib/booking-outreach';
import { openEmailOutreach } from '@/lib/open-email-outreach';
import { bookingFormSchema, type BookingFormValues } from '@/lib/validations';
import { logError } from '@/lib/safe';

interface BookingFormProps {
  tourId: string;
  tourTitle: string;
}

async function saveBookingInBackground(
  data: BookingFormValues,
  tourId: string,
  tourTitle: string
): Promise<void> {
  try {
    await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tourId,
        tourTitle,
        name: data.name,
        email: data.email,
        phone: data.phone,
        date: data.date,
        guests: Number(data.guests),
        message: data.message ?? '',
      }),
    });
  } catch (error) {
    logError('saveBookingInBackground', error);
  }
}

function BookingField({
  id,
  label,
  icon: Icon,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  icon: LucideIcon;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('min-w-0', className)}>
      <Label
        htmlFor={id}
        className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-blue/80"
      >
        <Icon className="h-3.5 w-3.5 shrink-0 text-brand-orange" aria-hidden />
        {label}
      </Label>
      <div
        className={cn(
          'rounded-xl border border-border/80 bg-white shadow-sm transition-[border-color,box-shadow]',
          'focus-within:border-brand-orange/45 focus-within:ring-2 focus-within:ring-brand-orange/15',
          error && 'border-destructive/80 focus-within:border-destructive focus-within:ring-destructive/15'
        )}
      >
        {children}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const fieldInputClass =
  'h-11 border-0 bg-transparent px-3.5 text-base shadow-none focus-visible:border-0 focus-visible:ring-0 md:text-sm';

const fieldInputWithIconClass = cn(fieldInputClass, 'pl-10');

export default function BookingForm({ tourId, tourTitle }: BookingFormProps) {
  const t = useTranslations('booking');
  const locale = useLocale();
  const minDate = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    setError,
    clearErrors,
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

  const guestCount = watch('guests');

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

  const applyValidationErrors = (data: BookingFormValues): data is BookingFormValues => {
    const parsed = bookingFormSchema.safeParse(data);
    if (parsed.success) {
      clearErrors();
      return true;
    }
    clearErrors();
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === 'string') {
        setError(field as keyof BookingFormValues, { type: 'manual', message: issue.message });
      }
    }
    return false;
  };

  const openWhatsApp = handleSubmit((data) => {
    void saveBookingInBackground(data, tourId, tourTitle);
    const url = buildBookingWhatsAppUrl(toPayload(data), labels, locale);
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  const openEmail = () => {
    const data = getValues();
    if (!applyValidationErrors(data)) return;

    void saveBookingInBackground(data, tourId, tourTitle);
    openEmailOutreach(buildBookingEmailParts(toPayload(data), labels, locale));
    toast.message(t('emailHint'), {
      description: t('emailHintDesc', { email: getAgencyEmail() }),
    });
  };

  const err = (key: keyof BookingFormValues) =>
    errors[key]?.message ? String(errors[key]?.message) : undefined;

  const adjustGuests = (delta: number) => {
    const next = Math.min(50, Math.max(1, Number(guestCount || 1) + delta));
    setValue('guests', String(next), { shouldValidate: true });
  };

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-[0_8px_40px_-12px_rgba(30,58,95,0.35)] ring-1 ring-brand-blue/10">
      <header className="relative overflow-hidden bg-gradient-to-br from-brand-blue via-brand-blue to-[#152a45] px-5 py-6 text-white sm:px-6">
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-brand-orange/25 blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-black/15 to-transparent"
          aria-hidden
        />
        <div className="relative flex gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-inner backdrop-blur-sm"
            aria-hidden
          >
            <Sparkles className="h-6 w-6 text-brand-orange" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-heading text-xl font-bold tracking-tight">{t('title')}</h2>
            <p className="mt-1 line-clamp-2 text-sm leading-snug text-blue-100/95">{tourTitle}</p>
          </div>
        </div>
      </header>

      <div className="border-b border-border/60 bg-gradient-to-r from-muted/40 via-background to-muted/30 px-5 py-3.5 sm:px-6">
        <p className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" aria-hidden />
          <span>{t('subtitle')}</span>
        </p>
      </div>

      <form className="px-5 py-5 sm:px-6 sm:py-6" noValidate onSubmit={(e) => e.preventDefault()}>
        <fieldset className="space-y-3.5">
          <legend className="mb-3 block w-full border-b border-border/50 pb-2 text-[11px] font-bold uppercase tracking-widest text-brand-orange">
            {t('sectionContact')}
          </legend>

          <BookingField id="booking-name" label={t('name')} icon={User} error={err('name')}>
            <div className="relative">
              <User
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50"
                aria-hidden
              />
              <Input
                id="booking-name"
                autoComplete="name"
                aria-invalid={!!errors.name}
                {...register('name')}
                className={fieldInputWithIconClass}
                placeholder={t('placeholderName')}
              />
            </div>
          </BookingField>

          <BookingField id="booking-email" label={t('email')} icon={Mail} error={err('email')}>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50"
                aria-hidden
              />
              <Input
                id="booking-email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register('email')}
                className={fieldInputWithIconClass}
                placeholder={t('placeholderEmail')}
              />
            </div>
          </BookingField>

          <BookingField id="booking-phone" label={t('phone')} icon={Phone} error={err('phone')}>
            <div className="relative">
              <Phone
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50"
                aria-hidden
              />
              <Input
                id="booking-phone"
                type="tel"
                autoComplete="tel"
                aria-invalid={!!errors.phone}
                {...register('phone')}
                className={fieldInputWithIconClass}
                placeholder={t('placeholderPhone')}
              />
            </div>
          </BookingField>
        </fieldset>

        <fieldset className="mt-6 space-y-3.5">
          <legend className="mb-3 block w-full border-b border-border/50 pb-2 text-[11px] font-bold uppercase tracking-widest text-brand-orange">
            {t('sectionTrip')}
          </legend>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <BookingField
              id="booking-date"
              label={t('date')}
              icon={CalendarDays}
              error={err('date')}
            >
              <div className="relative">
                <CalendarDays
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50"
                  aria-hidden
                />
                <Input
                  id="booking-date"
                  type="date"
                  min={minDate}
                  aria-invalid={!!errors.date}
                  {...register('date')}
                  className={cn(fieldInputWithIconClass, '[color-scheme:light]')}
                />
              </div>
            </BookingField>

            <BookingField
              id="booking-guests"
              label={t('guests')}
              icon={Users}
              error={err('guests')}
            >
              <div className="flex h-11 items-stretch">
                <button
                  type="button"
                  onClick={() => adjustGuests(-1)}
                  className="flex w-11 shrink-0 items-center justify-center rounded-l-xl border-r border-border/60 text-brand-blue transition hover:bg-muted/60"
                  aria-label={t('guestsDecrease')}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <Input
                  id="booking-guests"
                  type="number"
                  min={1}
                  max={50}
                  aria-invalid={!!errors.guests}
                  {...register('guests')}
                  className="h-full flex-1 border-0 bg-transparent text-center font-semibold tabular-nums shadow-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => adjustGuests(1)}
                  className="flex w-11 shrink-0 items-center justify-center rounded-r-xl border-l border-border/60 text-brand-blue transition hover:bg-muted/60"
                  aria-label={t('guestsIncrease')}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </BookingField>
          </div>

          <BookingField
            id="booking-message"
            label={t('message')}
            icon={MessageSquare}
            error={err('message')}
          >
            <Textarea
              id="booking-message"
              aria-invalid={!!errors.message}
              {...register('message')}
              rows={3}
              placeholder={t('placeholderMessage')}
              className="min-h-[88px] resize-y border-0 bg-transparent px-3.5 py-3 text-base shadow-none focus-visible:ring-0 md:text-sm"
            />
          </BookingField>
        </fieldset>

        <div className="mt-6 rounded-2xl border border-border/70 bg-gradient-to-b from-muted/30 to-background p-4 sm:p-5">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t('sendVia')}
          </p>
          <div className="grid grid-cols-1 gap-2.5">
            <Button
              type="button"
              className="h-12 w-full gap-2.5 rounded-xl bg-[#25D366] px-4 text-sm font-semibold text-white shadow-md shadow-[#25D366]/25 transition hover:bg-[#20BD5A] hover:shadow-lg sm:text-base"
              onClick={openWhatsApp}
            >
              <WhatsAppIcon className="h-5 w-5 shrink-0 text-white" />
              {t('bookWhatsApp')}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full gap-2.5 rounded-xl border-2 border-brand-blue/20 bg-white px-4 text-sm font-semibold text-brand-blue shadow-sm transition hover:border-brand-blue/40 hover:bg-brand-blue/[0.04] sm:text-base"
              onClick={openEmail}
            >
              <Mail className="h-5 w-5 shrink-0" />
              {t('bookEmail')}
            </Button>
          </div>
          <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
            {t('noPaymentNote')}
          </p>
        </div>
      </form>
    </div>
  );
}

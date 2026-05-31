import { getWhatsAppDigits } from '@/lib/contact';

export type BookingOutreachPayload = {
  tourTitle: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  guests: string;
  message?: string;
};

export type BookingMessageLabels = {
  intro: string;
  tour: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  guests: string;
  message: string;
  emailSubject: string;
  none: string;
};

export function getAgencyEmail(): string {
  const fromEnv = process.env.NEXT_PUBLIC_AGENCY_EMAIL?.trim();
  return fromEnv && fromEnv.includes('@') ? fromEnv : 'info@khivashodliktravel.uz';
}

export function formatBookingDate(dateStr: string, locale: string): string {
  const parsed = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(parsed);
  } catch {
    return dateStr;
  }
}

function buildBookingLines(
  payload: BookingOutreachPayload,
  labels: BookingMessageLabels,
  locale: string
): string[] {
  const dateLabel = formatBookingDate(payload.date, locale);
  const message = payload.message?.trim();

  return [
    labels.intro,
    '',
    `${labels.tour}: ${payload.tourTitle}`,
    `${labels.name}: ${payload.name}`,
    `${labels.email}: ${payload.email}`,
    `${labels.phone}: ${payload.phone}`,
    `${labels.date}: ${dateLabel}`,
    `${labels.guests}: ${payload.guests}`,
    `${labels.message}: ${message || labels.none}`,
  ];
}

export function buildBookingWhatsAppUrl(
  payload: BookingOutreachPayload,
  labels: BookingMessageLabels,
  locale: string
): string {
  const text = encodeURIComponent(buildBookingLines(payload, labels, locale).join('\n'));
  return `https://wa.me/${getWhatsAppDigits()}?text=${text}`;
}

export function buildBookingMailtoUrl(
  payload: BookingOutreachPayload,
  labels: BookingMessageLabels,
  locale: string
): string {
  const subject = encodeURIComponent(`${labels.emailSubject}: ${payload.tourTitle}`);
  const body = encodeURIComponent(buildBookingLines(payload, labels, locale).join('\n'));
  return `mailto:${getAgencyEmail()}?subject=${subject}&body=${body}`;
}

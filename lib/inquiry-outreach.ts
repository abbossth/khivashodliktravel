import { getAgencyEmail } from '@/lib/booking-outreach';
import { getWhatsAppDigits } from '@/lib/contact';

export type InquiryOutreachPayload = {
  name: string;
  email: string;
  phone: string;
  tourInterest?: string;
  message: string;
};

export type InquiryMessageLabels = {
  intro: string;
  name: string;
  email: string;
  phone: string;
  tourInterest: string;
  message: string;
  emailSubject: string;
  none: string;
};

function buildInquiryLines(
  payload: InquiryOutreachPayload,
  labels: InquiryMessageLabels
): string[] {
  const tour = payload.tourInterest?.trim();

  return [
    labels.intro,
    '',
    `${labels.name}: ${payload.name}`,
    `${labels.email}: ${payload.email}`,
    `${labels.phone}: ${payload.phone}`,
    `${labels.tourInterest}: ${tour || labels.none}`,
    '',
    `${labels.message}:`,
    payload.message.trim(),
  ];
}

export function buildInquiryWhatsAppUrl(
  payload: InquiryOutreachPayload,
  labels: InquiryMessageLabels
): string {
  const text = encodeURIComponent(buildInquiryLines(payload, labels).join('\n'));
  return `https://wa.me/${getWhatsAppDigits()}?text=${text}`;
}

export function buildInquiryMailtoUrl(
  payload: InquiryOutreachPayload,
  labels: InquiryMessageLabels
): string {
  const subject = encodeURIComponent(
    `${labels.emailSubject}${payload.tourInterest?.trim() ? `: ${payload.tourInterest.trim()}` : ''}`
  );
  const body = encodeURIComponent(buildInquiryLines(payload, labels).join('\n'));
  return `mailto:${getAgencyEmail()}?subject=${subject}&body=${body}`;
}

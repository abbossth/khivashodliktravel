/** Public contact numbers (E.164 without spaces) */
export const PHONE_WHATSAPP_E164 = '+998919896867';
export const PHONE_WHATSAPP_DIGITS = '998919896867';

export const PHONE_ALT_E164 = '+998902246969';
export const PHONE_ALT_DIGITS = '998902246969';

export function getWhatsAppDigits(): string {
  const fromEnv = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '');
  return fromEnv && fromEnv.length >= 9 ? fromEnv : PHONE_WHATSAPP_DIGITS;
}

/** +998 91 989 68 67 */
export function formatPhoneDisplay(e164: string): string {
  const digits = e164.replace(/\D/g, '');
  if (!digits.startsWith('998') || digits.length < 12) return e164;
  const rest = digits.slice(3);
  const parts = [rest.slice(0, 2), rest.slice(2, 5), rest.slice(5, 7), rest.slice(7, 9)].filter(
    Boolean
  );
  return `+998 ${parts.join(' ')}`.trim();
}

export const PHONE_WHATSAPP_DISPLAY = formatPhoneDisplay(PHONE_WHATSAPP_E164);
export const PHONE_ALT_DISPLAY = formatPhoneDisplay(PHONE_ALT_E164);

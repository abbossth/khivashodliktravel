export type EmailOutreachParts = {
  to: string;
  subject: string;
  body: string;
};

/** Keep mailto URLs within limits for iOS / Android mail handlers. */
const MAILTO_SAFE_URL_LENGTH = 1800;

function buildMailtoUrl({ to, subject, body }: EmailOutreachParts): string {
  const params = new URLSearchParams();
  params.set('subject', subject);
  params.set('body', body);
  return `mailto:${to}?${params.toString()}`;
}

/** Gmail web compose — works on iPhone, Android, and Windows without a mail app. */
export function buildGmailComposeUrl(parts: EmailOutreachParts): string {
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: parts.to,
    su: parts.subject,
    body: parts.body,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

function tryOpenMailto(mailtoUrl: string): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('a');
  link.href = mailtoUrl;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

function trimBodyForMailto(body: string, maxChars: number): string {
  if (body.length <= maxChars) return body;
  return `${body.slice(0, maxChars)}\n\n[Message truncated for email app limits]`;
}

/**
 * Opens the user's email flow in a way that works on iOS, Android, and Windows.
 * Tries the native mail app first; on mobile also opens Gmail in a new tab as a reliable fallback.
 */
export function openEmailOutreach(parts: EmailOutreachParts): void {
  let body = parts.body;
  let mailtoUrl = buildMailtoUrl(parts);

  if (mailtoUrl.length > MAILTO_SAFE_URL_LENGTH) {
    body = trimBodyForMailto(body, 900);
    mailtoUrl = buildMailtoUrl({ ...parts, body });
  }

  const gmailUrl = buildGmailComposeUrl({ ...parts, body });

  tryOpenMailto(mailtoUrl);

  // iOS / Android / Windows often block or ignore mailto — Gmail in the browser is reliable.
  const needsWebFallback =
    isMobileDevice() ||
    /Windows/i.test(navigator.userAgent) ||
    mailtoUrl.length > MAILTO_SAFE_URL_LENGTH;

  if (needsWebFallback) {
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  }
}

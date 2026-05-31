/** Canonical production origin (no trailing slash). Vercel redirects apex → www. */
export const PRODUCTION_SITE_URL = 'https://www.khivashodliktravel.uz';

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (!raw) return PRODUCTION_SITE_URL;

  try {
    return new URL(raw).origin;
  } catch {
    return PRODUCTION_SITE_URL;
  }
}

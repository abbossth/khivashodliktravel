const ADMIN_COOKIE = 'admin-token';
/** 7 days — Firebase ID token is refreshed client-side via AuthGuard */
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function buildCookieAttributes(maxAge: number): string {
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
  return `path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
}

export function setAdminAuthCookie(token: string): void {
  if (typeof document === 'undefined') return;

  const value = encodeURIComponent(token);
  document.cookie = `${ADMIN_COOKIE}=${value}; ${buildCookieAttributes(MAX_AGE_SECONDS)}`;
}

export function clearAdminAuthCookie(): void {
  if (typeof document === 'undefined') return;

  document.cookie = `${ADMIN_COOKIE}=; ${buildCookieAttributes(0)}`;
}

/** Returns true when the admin-token cookie is present in the browser. */
export function hasAdminAuthCookie(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some((part) => part.trim().startsWith(`${ADMIN_COOKIE}=`));
}

export function getAdminAuthCookieName(): string {
  return ADMIN_COOKIE;
}

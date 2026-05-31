const ADMIN_COOKIE = 'admin-token';
const MAX_AGE_SECONDS = 3600;

export function setAdminAuthCookie(token: string): void {
  if (typeof document === 'undefined') return;

  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${ADMIN_COOKIE}=${token}; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

export function clearAdminAuthCookie(): void {
  if (typeof document === 'undefined') return;

  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${ADMIN_COOKIE}=; path=/; max-age=0; SameSite=Lax${secure}`;
}

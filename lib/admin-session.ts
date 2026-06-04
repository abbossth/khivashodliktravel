import type { User } from 'firebase/auth';
import { setAdminAuthCookie, hasAdminAuthCookie } from '@/lib/auth-cookie';

export async function saveAdminSession(
  user: User,
  setUser: (user: User | null) => void,
  setToken: (token: string | null) => void
): Promise<string> {
  const token = await user.getIdToken();
  setAdminAuthCookie(token);
  setUser(user);
  setToken(token);

  if (!hasAdminAuthCookie()) {
    throw new Error('Could not save login session cookie. Disable browser cookie blocking and try again.');
  }

  return token;
}

/** Full page navigation so middleware receives the new cookie. */
export function goToAdminDashboard(): void {
  window.location.assign('/admin');
}

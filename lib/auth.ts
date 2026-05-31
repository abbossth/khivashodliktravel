import { getAdminAuth, isFirebaseAdminConfigured } from './firebase-admin';

export async function verifyAdminToken(request: Request): Promise<boolean> {
  if (!isFirebaseAdminConfigured()) return false;

  const token = request.headers.get('Authorization')?.split('Bearer ')[1];
  if (!token) return false;

  const auth = getAdminAuth();
  if (!auth) return false;

  try {
    await auth.verifyIdToken(token);
    return true;
  } catch {
    return false;
  }
}

export async function getAdminEmailFromToken(request: Request): Promise<string | null> {
  if (!isFirebaseAdminConfigured()) return null;

  const token = request.headers.get('Authorization')?.split('Bearer ')[1];
  if (!token) return null;

  const auth = getAdminAuth();
  if (!auth) return null;

  try {
    const decoded = await auth.verifyIdToken(token);
    return decoded.email ?? null;
  } catch {
    return null;
  }
}

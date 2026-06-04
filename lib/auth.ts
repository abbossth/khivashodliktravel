import { verifyFirebaseIdToken } from './verify-firebase-token';

export async function verifyAdminToken(request: Request): Promise<boolean> {
  const token = request.headers.get('Authorization')?.split('Bearer ')[1];
  if (!token) return false;

  const payload = await verifyFirebaseIdToken(token);
  return payload !== null;
}

export async function getAdminEmailFromToken(request: Request): Promise<string | null> {
  const token = request.headers.get('Authorization')?.split('Bearer ')[1];
  if (!token) return null;

  const payload = await verifyFirebaseIdToken(token);
  if (!payload) return null;

  const email = payload.email;
  return typeof email === 'string' ? email : null;
}

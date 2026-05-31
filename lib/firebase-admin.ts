import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getStorage, type Storage } from 'firebase-admin/storage';
import { logError } from '@/lib/safe';

let adminApp: App | undefined;

export function isFirebaseAdminConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
      process.env.FIREBASE_ADMIN_PRIVATE_KEY
  );
}

function getAdminApp(): App | null {
  if (!isFirebaseAdminConfigured()) return null;

  try {
    if (adminApp) return adminApp;

    if (getApps().length > 0) {
      adminApp = getApps()[0];
      return adminApp;
    }

    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
        privateKey: privateKey!,
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });

    return adminApp;
  } catch (error) {
    logError('getAdminApp', error);
    return null;
  }
}

export function getAdminAuth(): Auth | null {
  const app = getAdminApp();
  if (!app) return null;
  try {
    return getAuth(app);
  } catch (error) {
    logError('getAdminAuth', error);
    return null;
  }
}

export function getAdminStorage(): Storage | null {
  const app = getAdminApp();
  if (!app) return null;
  try {
    return getStorage(app);
  } catch (error) {
    logError('getAdminStorage', error);
    return null;
  }
}

export const adminAuth = {
  verifyIdToken: async (token: string) => {
    const auth = getAdminAuth();
    if (!auth) throw new Error('Firebase Admin not configured');
    return auth.verifyIdToken(token);
  },
};

export const adminStorage = {
  bucket: () => {
    const storage = getAdminStorage();
    if (!storage) throw new Error('Firebase Admin storage not configured');
    return storage.bucket();
  },
};

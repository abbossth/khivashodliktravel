import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

/** Public web config (shodlik-travel-4dbbf) — env vars override when set. */
const defaultFirebaseConfig = {
  apiKey: 'AIzaSyDLhDB18mwQLMIy692spXUziTSRdigO3Es',
  authDomain: 'shodlik-travel-4dbbf.firebaseapp.com',
  projectId: 'shodlik-travel-4dbbf',
  storageBucket: 'shodlik-travel-4dbbf.firebasestorage.app',
  messagingSenderId: '850568155688',
  appId: '1:850568155688:web:49c2484c3cc9b7194d5b1d',
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? defaultFirebaseConfig.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? defaultFirebaseConfig.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? defaultFirebaseConfig.projectId,
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? defaultFirebaseConfig.storageBucket,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? defaultFirebaseConfig.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? defaultFirebaseConfig.appId,
};

export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}

function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;

  try {
    const projectId = firebaseConfig.projectId;
    const existing = getApps().find((app) => app.options.projectId === projectId);
    if (existing) return existing;

    return initializeApp(firebaseConfig);
  } catch {
    return null;
  }
}

export function getFirebaseStorageBucket(): string | undefined {
  return firebaseConfig.storageBucket;
}

export function getFirebaseAuth(): Auth {
  const app = getFirebaseApp();
  if (!app) {
    throw new Error('Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* env variables.');
  }
  return getAuth(app);
}

export function getFirebaseAuthSafe(): Auth | null {
  const app = getFirebaseApp();
  if (!app) return null;
  try {
    return getAuth(app);
  } catch {
    return null;
  }
}

function resolveStorage(app: FirebaseApp): FirebaseStorage {
  const bucket = firebaseConfig.storageBucket;
  return bucket ? getStorage(app, `gs://${bucket}`) : getStorage(app);
}

export function getFirebaseStorage(): FirebaseStorage {
  const app = getFirebaseApp();
  if (!app) {
    throw new Error('Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* env variables.');
  }
  return resolveStorage(app);
}

export function getFirebaseStorageSafe(): FirebaseStorage | null {
  const app = getFirebaseApp();
  if (!app) return null;
  try {
    return resolveStorage(app);
  } catch {
    return null;
  }
}

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}

function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;

  try {
    if (getApps().length > 0) {
      return getApps()[0];
    }
    return initializeApp(firebaseConfig);
  } catch {
    return null;
  }
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

export function getFirebaseStorage(): FirebaseStorage {
  const app = getFirebaseApp();
  if (!app) {
    throw new Error('Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* env variables.');
  }
  return getStorage(app);
}

export function getFirebaseStorageSafe(): FirebaseStorage | null {
  const app = getFirebaseApp();
  if (!app) return null;
  try {
    return getStorage(app);
  } catch {
    return null;
  }
}

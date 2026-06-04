import { onAuthStateChanged, type User } from 'firebase/auth';
import { getFirebaseAuthSafe } from '@/lib/firebase';

/** Wait until Firebase Auth has a signed-in user (needed before Storage upload). */
export function waitForFirebaseUser(timeoutMs = 12_000): Promise<User> {
  const auth = getFirebaseAuthSafe();
  if (!auth) {
    return Promise.reject(new Error('Firebase Auth is not configured'));
  }

  if (auth.currentUser) {
    return Promise.resolve(auth.currentUser);
  }

  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      unsubscribe();
      reject(new Error('Firebase: tizimga qayta kiring (sessiya topilmadi).'));
    }, timeoutMs);

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (!user) return;
        window.clearTimeout(timer);
        unsubscribe();
        resolve(user);
      },
      (error) => {
        window.clearTimeout(timer);
        unsubscribe();
        reject(error);
      }
    );
  });
}

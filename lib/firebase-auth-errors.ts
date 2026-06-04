import type { FirebaseError } from 'firebase/app';

export function getFirebaseAuthErrorMessage(
  error: unknown,
  fallback: string
): string {
  const code =
    error && typeof error === 'object' && 'code' in error
      ? String((error as FirebaseError).code)
      : '';

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-email':
      return fallback;
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a few minutes and try again.';
    case 'auth/user-disabled':
      return 'This account is disabled. Contact the administrator.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is disabled in Firebase. Enable it in Authentication → Sign-in method.';
    default:
      return code ? `${fallback} (${code})` : fallback;
  }
}

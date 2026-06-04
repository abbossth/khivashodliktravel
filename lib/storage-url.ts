import { randomUUID } from 'crypto';

/** Build a Firebase Storage download URL (works without makePublic). */
export function buildFirebaseStorageDownloadUrl(bucketName: string, objectPath: string, token: string): string {
  const encoded = encodeURIComponent(objectPath);
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encoded}?alt=media&token=${token}`;
}

export function createStorageDownloadToken(): string {
  return randomUUID();
}

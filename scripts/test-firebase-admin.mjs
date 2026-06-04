/**
 * Firebase Admin + Storage smoke test (node scripts/test-firebase-admin.mjs)
 */
import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import { randomUUID } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function loadEnvLocal() {
  const raw = readFileSync(resolve(root, '.env.local'), 'utf8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    let val = trimmed.slice(eq + 1);
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val.replace(/\\n/g, '\n');
  }
}

loadEnvLocal();

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
const bucketName =
  process.env.TEST_STORAGE_BUCKET ||
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
  'shodlik-travel-4dbbf.firebasestorage.app';

console.log('Admin project:', projectId);
console.log('Admin email:', clientEmail);
console.log('Storage bucket:', bucketName);

if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing FIREBASE_ADMIN_* env');
  process.exit(1);
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket: bucketName,
  });
}

const auth = getAuth();
console.log('Auth SDK: ok');

const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);
const fileName = `uploads/debug-${Date.now()}.png`;
const bucket = getStorage().bucket();
const fileRef = bucket.file(fileName);
const token = randomUUID();

await fileRef.save(png, {
  metadata: {
    contentType: 'image/png',
    metadata: { firebaseStorageDownloadTokens: token },
  },
});

const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${token}`;
console.log('Upload OK:', url);

const res = await fetch(url);
console.log('Download HTTP:', res.status, res.headers.get('content-type'));

await fileRef.delete();
console.log('Cleanup OK');

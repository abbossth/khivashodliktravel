/**
 * Admin / Firebase / upload diagnostics (run: node scripts/debug-admin.mjs)
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function loadEnvLocal() {
  try {
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
      if (!process.env[key]) process.env[key] = val.replace(/\\n/g, '\n');
    }
  } catch {
    /* no .env.local */
  }
}

loadEnvLocal();

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

function section(title) {
  console.log('\n===', title, '===');
}

async function main() {
  section('Env');
  const pub = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'set' : 'missing',
  };
  const admin = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY ? 'set' : 'missing',
  };
  console.log('Client:', pub);
  console.log('Admin:', admin);

  const projectMismatch =
    pub.projectId &&
    admin.projectId &&
    pub.projectId !== admin.projectId;
  const emailMismatch =
    admin.clientEmail &&
    pub.projectId &&
    !admin.clientEmail.includes(pub.projectId.replace(/-/g, '')) &&
    !admin.clientEmail.includes(pub.projectId);
  if (projectMismatch) {
    console.warn(
      'NOTE: Client/Admin project differ — API auth uses JWKS (NEXT_PUBLIC_FIREBASE_PROJECT_ID); server Storage upload still needs matching FIREBASE_ADMIN_*.'
    );
  }
  if (admin.clientEmail && pub.projectId === 'shodlik-travel-4dbbf' && admin.clientEmail.includes('@shodlik-travel.iam')) {
    console.warn(
      'WARN: FIREBASE_ADMIN is for shodlik-travel — server-side Storage upload to 4dbbf bucket will 403. Use client drag-and-drop or add 4dbbf service account.'
    );
  }

  section('Firebase Admin SDK');
  try {
    const { isFirebaseAdminConfigured, getAdminAuth } = await import('../lib/firebase-admin.ts');
    console.log('configured:', isFirebaseAdminConfigured());
    const auth = getAdminAuth();
    console.log('auth instance:', auth ? 'ok' : 'null');
  } catch (e) {
    console.error('Admin SDK error:', e.message);
  }

  section('HTTP API (no token)');
  for (const path of ['/api/tours?all=true', '/api/blog?all=true', '/api/upload']) {
    try {
      const method = path.includes('upload') ? 'POST' : 'GET';
      const res = await fetch(`${BASE}${path}`, { method });
      const text = await res.text();
      let body = text.slice(0, 200);
      try {
        body = JSON.stringify(JSON.parse(text));
      } catch {
        /* raw */
      }
      console.log(`${method} ${path} → ${res.status}`, body);
    } catch (e) {
      console.error(path, e.message);
    }
  }

  section('Upload API (no file)');
  try {
    const res = await fetch(`${BASE}/api/upload`, {
      method: 'POST',
      headers: { Authorization: 'Bearer invalid' },
    });
    console.log('POST /api/upload (bad token) →', res.status, await res.text());
  } catch (e) {
    console.error(e.message);
  }

  section('Image URL helpers');
  const { normalizeImageUrl, isValidImageUrl } = await import('../lib/image-url.ts');
  const sample =
    'gs://shodlik-travel-4dbbf.firebasestorage.app/tours/test.jpg';
  console.log(sample, '→', normalizeImageUrl(sample), isValidImageUrl(sample));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

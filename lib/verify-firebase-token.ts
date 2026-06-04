import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';

const FIREBASE_JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
);

function getFirebaseProjectId(): string | null {
  return (
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ||
    'shodlik-travel-4dbbf'
  );
}

export async function verifyFirebaseIdToken(idToken: string): Promise<JWTPayload | null> {
  const projectId = getFirebaseProjectId();
  if (!projectId) return null;

  try {
    const { payload } = await jwtVerify(idToken, FIREBASE_JWKS, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });
    return payload;
  } catch {
    return null;
  }
}

export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { isFirebaseAdminConfigured } from '@/lib/firebase-admin';
import { adminStorage } from '@/lib/firebase-admin';
import { logError } from '@/lib/safe';

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminToken(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isFirebaseAdminConfigured()) {
      return NextResponse.json({ error: 'File storage is not configured' }, { status: 503 });
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (error) {
      logError('upload formData', error);
      return NextResponse.json({ error: 'Invalid upload request' }, { status: 400 });
    }

    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'uploads';

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    let bucket;
    try {
      bucket = adminStorage.bucket();
    } catch {
      return NextResponse.json({ error: 'File storage is not configured' }, { status: 503 });
    }
    const fileRef = bucket.file(fileName);

    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type || 'application/octet-stream',
      },
    });

    await fileRef.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    logError('POST /api/upload', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

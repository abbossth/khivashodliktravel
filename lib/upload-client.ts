import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirebaseStorageSafe } from '@/lib/firebase';
import { waitForFirebaseUser } from '@/lib/firebase-auth-user';
import { validateImageUploadSize } from '@/lib/upload-limits';

function mapStorageError(error: unknown): string {
  const code =
    error && typeof error === 'object' && 'code' in error
      ? String((error as { code: string }).code)
      : '';

  if (code === 'storage/unauthenticated') {
    return 'Firebase Storage: tizimga kirmagansiz. Admin paneldan chiqib qayta kiring.';
  }
  if (code === 'storage/unauthorized') {
    return (
      'Firebase Storage: ruxsat yo‘q. Firebase Console → Storage → Rules bo‘limiga kirib quyidagi qoidalarni Publish qiling (shodlik-travel-4dbbf loyihasi).'
    );
  }
  if (code === 'storage/canceled') {
    return 'Yuklash bekor qilindi.';
  }

  return error instanceof Error ? error.message : 'Firebase Storage ga yuklash muvaffaqiyatsiz';
}

/** Upload file to Firebase Storage; returns public download URL. Requires signed-in Firebase user. */
export async function uploadImageToFirebaseStorage(file: File, folder: string): Promise<string> {
  const sizeCheck = validateImageUploadSize(file);
  if (!sizeCheck.ok) {
    throw new Error(sizeCheck.message);
  }

  const user = await waitForFirebaseUser();

  const storage = getFirebaseStorageSafe();
  if (!storage) {
    throw new Error('Firebase Storage sozlanmagan.');
  }

  await user.getIdToken(true);

  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `${folder}/${Date.now()}-${safeName}`;
  const storageRef = ref(storage, path);

  try {
    await uploadBytes(storageRef, file, {
      contentType: file.type || 'application/octet-stream',
    });
    return await getDownloadURL(storageRef);
  } catch (error) {
    throw new Error(mapStorageError(error));
  }
}

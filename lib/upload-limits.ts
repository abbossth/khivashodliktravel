/** Max image upload size for Firebase / admin uploads (5 MB). */
export const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024;

export const MAX_IMAGE_UPLOAD_MB = 5;

export function formatFileSizeMb(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

export function validateImageUploadSize(
  file: Pick<File, 'size' | 'name'>
): { ok: true } | { ok: false; message: string } {
  if (file.size <= MAX_IMAGE_UPLOAD_BYTES) {
    return { ok: true };
  }

  const actualMb = formatFileSizeMb(file.size);
  return {
    ok: false,
    message: `File is too large (${actualMb} MB). Maximum size is ${MAX_IMAGE_UPLOAD_MB} MB.`,
  };
}

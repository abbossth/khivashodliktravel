const HTTP_URL = /^https?:\/\/.+/i;

/** Local public path or remote http(s) URL — matches imageRefSchema. */
export function isValidImageUrl(value: string): boolean {
  const normalized = normalizeImageUrl(value);
  if (!normalized) return false;
  return normalized.startsWith('/images/') || HTTP_URL.test(normalized);
}

/**
 * Trim and normalize pasted URLs (including gs:// Firebase Storage paths).
 */
export function normalizeImageUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('gs://')) {
    const withoutScheme = trimmed.slice(5);
    const slash = withoutScheme.indexOf('/');
    if (slash === -1) return trimmed;
    const bucket = withoutScheme.slice(0, slash);
    const objectPath = withoutScheme.slice(slash + 1);
    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(objectPath)}?alt=media`;
  }

  return trimmed;
}

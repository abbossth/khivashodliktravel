/** Local public path or remote http(s) URL — matches imageRefSchema. */
export function isValidImageUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return trimmed.startsWith('/images/') || /^https?:\/\/.+/i.test(trimmed);
}

export function normalizeImageUrl(value: string): string {
  return value.trim();
}

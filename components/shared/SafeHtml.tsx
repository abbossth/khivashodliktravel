'use client';

import { sanitizeHtml } from '@/lib/sanitize';

interface SafeHtmlProps {
  html: string;
  className?: string;
}

export default function SafeHtml({ html, className }: SafeHtmlProps) {
  const safe = sanitizeHtml(html);
  if (!safe) return null;

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}

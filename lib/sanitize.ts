/** Basic HTML sanitization for CMS content — prevents script injection and broken markup */

const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'h2', 'h3', 'h4', 'a', 'span', 'div',
]);

export function sanitizeHtml(html: string | undefined | null): string {
  if (!html || typeof html !== 'string') return '';

  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/<(\/?)([\w]+)([^>]*)>/gi, (match, slash, tag) => {
      const name = String(tag).toLowerCase();
      if (!ALLOWED_TAGS.has(name)) return '';
      if (name === 'a' && !slash) {
        return match.replace(/href\s*=\s*("|')javascript:[^"']*\1/gi, 'href="#"');
      }
      return match;
    });
}

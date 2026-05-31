import type { MetadataRoute } from 'next';
import { getAllTourSlugs } from '@/lib/data';
import { getSiteUrl } from '@/lib/site';
import { routing } from '@/i18n/routing';

const PUBLIC_PATHS = ['', '/tours', '/blog', '/contact'] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of PUBLIC_PATHS) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === '' ? 'weekly' : 'daily',
        priority: path === '' ? 1 : 0.8,
      });
    }
  }

  try {
    const slugs = await getAllTourSlugs();
    for (const locale of routing.locales) {
      for (const slug of slugs) {
        entries.push({
          url: `${base}/${locale}/tours/${slug}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }
  } catch {
    // Build/runtime without DB — static routes only
  }

  return entries;
}

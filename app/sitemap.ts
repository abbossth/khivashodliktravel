import type { MetadataRoute } from 'next';
import { getAllTourSlugs, getAllBlogSlugs } from '@/lib/data';
import { getSiteUrl } from '@/lib/site';
import { routing } from '@/i18n/routing';

const PUBLIC_PATHS = [
  '',
  '/tours',
  '/khiva-tours',
  '/uzbekistan-tours',
  '/aral-sea-tours',
  '/about',
  '/blog',
  '/contact',
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of PUBLIC_PATHS) {
      const isHome = path === '';
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: now,
        changeFrequency: isHome ? 'weekly' : 'weekly',
        priority: isHome ? 1 : path.includes('tours') ? 0.9 : 0.75,
      });
    }
  }

  try {
    const [tourSlugs, blogSlugs] = await Promise.all([getAllTourSlugs(), getAllBlogSlugs()]);
    for (const locale of routing.locales) {
      for (const slug of tourSlugs) {
        entries.push({
          url: `${base}/${locale}/tours/${slug}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
      for (const slug of blogSlugs) {
        entries.push({
          url: `${base}/${locale}/blog/${slug}`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  } catch {
    // DB unavailable at build — static routes only
  }

  return entries;
}

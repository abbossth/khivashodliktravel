import { unstable_cache } from 'next/cache';
import { connectDBSafe } from '@/lib/mongodb';
import TourModel from '@/models/Tour';
import BlogPostModel from '@/models/BlogPost';
import type { Tour, BlogPost, TourCategory } from '@/types';
import { logError, safeJsonParse } from '@/lib/safe';

const REVALIDATE_SECONDS = 300;

const TOUR_LIST_FIELDS =
  'title slug shortDescription coverImage price currency duration groupSize category isFeatured createdAt';

const BLOG_LIST_FIELDS =
  'title slug excerpt coverImage tags isPublished createdAt';

function serialize<T>(doc: unknown): T | null {
  if (doc == null) return null;
  try {
    return safeJsonParse<T>(JSON.stringify(doc), null as T);
  } catch (error) {
    logError('serialize', error);
    return null;
  }
}

function serializeArray<T>(docs: unknown[]): T[] {
  if (!Array.isArray(docs)) return [];
  return docs
    .map((doc) => serialize<T>(doc))
    .filter((item): item is T => item != null);
}

async function fetchTours(options?: {
  category?: TourCategory;
  featured?: boolean;
  limit?: number;
  publishedOnly?: boolean;
}): Promise<Tour[]> {
  if (!(await connectDBSafe())) return [];

  try {
    const filter: Record<string, unknown> = {};
    if (options?.publishedOnly !== false) filter.isPublished = true;
    if (options?.category) filter.category = options.category;
    if (options?.featured) filter.isFeatured = true;

    let query = TourModel.find(filter).select(TOUR_LIST_FIELDS).sort({ createdAt: -1 }).lean();
    if (options?.limit) query = query.limit(options.limit);

    const tours = await query;
    return serializeArray<Tour>(tours as unknown[]);
  } catch (error) {
    logError('fetchTours', error);
    return [];
  }
}

export async function getTours(options?: {
  category?: TourCategory;
  featured?: boolean;
  limit?: number;
  publishedOnly?: boolean;
}): Promise<Tour[]> {
  const cacheKey = JSON.stringify(options ?? {});
  return unstable_cache(() => fetchTours(options), ['tours', cacheKey], {
    revalidate: REVALIDATE_SECONDS,
    tags: ['tours'],
  })();
}

async function fetchTourBySlug(slug: string, publishedOnly = true): Promise<Tour | null> {
  if (!slug || !(await connectDBSafe())) return null;

  try {
    const filter: Record<string, unknown> = { slug };
    if (publishedOnly) filter.isPublished = true;

    const tour = await TourModel.findOne(filter).lean();
    return serialize<Tour>(tour);
  } catch (error) {
    logError('fetchTourBySlug', error);
    return null;
  }
}

export async function getTourBySlug(
  slug: string,
  publishedOnly = true
): Promise<Tour | null> {
  return unstable_cache(() => fetchTourBySlug(slug, publishedOnly), ['tour', slug], {
    revalidate: REVALIDATE_SECONDS,
    tags: ['tours', `tour-${slug}`],
  })();
}

export async function getTourById(id: string): Promise<Tour | null> {
  if (!id || !(await connectDBSafe())) return null;

  try {
    const tour = await TourModel.findById(id).lean();
    return serialize<Tour>(tour);
  } catch (error) {
    logError('getTourById', error);
    return null;
  }
}

async function fetchBlogPosts(options?: {
  limit?: number;
  publishedOnly?: boolean;
}): Promise<BlogPost[]> {
  if (!(await connectDBSafe())) return [];

  try {
    const filter: Record<string, unknown> = {};
    if (options?.publishedOnly !== false) filter.isPublished = true;

    let query = BlogPostModel.find(filter).select(BLOG_LIST_FIELDS).sort({ createdAt: -1 }).lean();
    if (options?.limit) query = query.limit(options.limit);

    const posts = await query;
    return serializeArray<BlogPost>(posts as unknown[]);
  } catch (error) {
    logError('fetchBlogPosts', error);
    return [];
  }
}

export async function getBlogPosts(options?: {
  limit?: number;
  publishedOnly?: boolean;
}): Promise<BlogPost[]> {
  const cacheKey = JSON.stringify(options ?? {});
  return unstable_cache(() => fetchBlogPosts(options), ['blog', cacheKey], {
    revalidate: REVALIDATE_SECONDS,
    tags: ['blog'],
  })();
}

async function fetchBlogPostBySlug(slug: string, publishedOnly = true): Promise<BlogPost | null> {
  if (!slug || !(await connectDBSafe())) return null;

  try {
    const filter: Record<string, unknown> = { slug };
    if (publishedOnly) filter.isPublished = true;

    const post = await BlogPostModel.findOne(filter).lean();
    return serialize<BlogPost>(post);
  } catch (error) {
    logError('fetchBlogPostBySlug', error);
    return null;
  }
}

export async function getBlogPostBySlug(
  slug: string,
  publishedOnly = true
): Promise<BlogPost | null> {
  return unstable_cache(() => fetchBlogPostBySlug(slug, publishedOnly), ['blog-post', slug], {
    revalidate: REVALIDATE_SECONDS,
    tags: ['blog', `blog-${slug}`],
  })();
}

export async function getAllTourSlugs(): Promise<string[]> {
  if (!(await connectDBSafe())) return [];

  try {
    const rows = await TourModel.find({ isPublished: true }).select('slug').lean();
    return rows.map((r) => String((r as { slug: string }).slug)).filter(Boolean);
  } catch (error) {
    logError('getAllTourSlugs', error);
    return [];
  }
}

export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import BlogPost from '@/models/BlogPost';
import { verifyAdminToken } from '@/lib/auth';
import { blogPostSchema, buildSlugFromTitle } from '@/lib/validations';
import { ensureUniqueSlug } from '@/lib/unique-slug';
import { requireDatabase, parseRequestBody } from '@/lib/api-db';
import { logError } from '@/lib/safe';
import { revalidatePublicContent } from '@/lib/revalidate-public';

export async function GET(request: NextRequest) {
  try {
    const dbError = await requireDatabase();
    if (dbError) return dbError;

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const limit = searchParams.get('limit');
    const all = searchParams.get('all');

    const isAdmin = all === 'true' && (await verifyAdminToken(request));

    if (slug) {
      const query = isAdmin ? { slug } : { slug, isPublished: true };
      const post = await BlogPost.findOne(query).lean();
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      return NextResponse.json({ post });
    }

    const filter = isAdmin ? {} : { isPublished: true };
    let query = BlogPost.find(filter).sort({ createdAt: -1 });
    if (limit) query = query.limit(Number(limit));

    const posts = await query.lean();
    return NextResponse.json({ posts: posts ?? [] });
  } catch (error) {
    logError('GET /api/blog', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminToken(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: body, error: bodyError } = await parseRequestBody<unknown>(request);
    if (bodyError) return bodyError;

    const parsed = blogPostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const dbError = await requireDatabase();
    if (dbError) return dbError;

    const baseSlug = buildSlugFromTitle(parsed.data.title.en, 'post');
    const slug = await ensureUniqueSlug(baseSlug, BlogPost);
    const post = await BlogPost.create({ ...parsed.data, slug });
    revalidatePublicContent(['blog']);
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    logError('POST /api/blog', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

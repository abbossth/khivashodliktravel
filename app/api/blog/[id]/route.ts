export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import BlogPost from '@/models/BlogPost';
import { verifyAdminToken } from '@/lib/auth';
import { blogPostSchema, buildSlugFromTitle } from '@/lib/validations';
import { ensureUniqueSlug } from '@/lib/unique-slug';
import { requireDatabase, parseRequestBody } from '@/lib/api-db';
import { logError } from '@/lib/safe';
import { revalidatePublicContent } from '@/lib/revalidate-public';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dbError = await requireDatabase();
    if (dbError) return dbError;

    const post = await BlogPost.findById(params.id).lean();

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const isAdmin = await verifyAdminToken(request);
    if (!post.isPublished && !isAdmin) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    logError('GET /api/blog/[id]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const baseSlug = buildSlugFromTitle(parsed.data.title.en, parsed.data.slug || 'post');
    const slug = await ensureUniqueSlug(baseSlug, BlogPost, params.id);

    const post = await BlogPost.findByIdAndUpdate(
      params.id,
      { ...parsed.data, slug },
      { new: true, runValidators: true }
    ).lean();

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    revalidatePublicContent(['blog']);
    return NextResponse.json({ post });
  } catch (error) {
    logError('PUT /api/blog/[id]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAdmin = await verifyAdminToken(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbError = await requireDatabase();
    if (dbError) return dbError;

    const post = await BlogPost.findByIdAndDelete(params.id);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    revalidatePublicContent(['blog']);
    return NextResponse.json({ success: true });
  } catch (error) {
    logError('DELETE /api/blog/[id]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

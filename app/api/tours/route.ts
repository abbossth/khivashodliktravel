export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import Tour from '@/models/Tour';
import { verifyAdminToken } from '@/lib/auth';
import { tourSchema } from '@/lib/validations';
import { requireDatabase, parseRequestBody } from '@/lib/api-db';
import { logError } from '@/lib/safe';
import { revalidatePublicContent } from '@/lib/revalidate-public';

export async function GET(request: NextRequest) {
  try {
    const dbError = await requireDatabase();
    if (dbError) return dbError;

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const slug = searchParams.get('slug');
    const all = searchParams.get('all');

    const isAdmin = all === 'true' && (await verifyAdminToken(request));

    if (slug) {
      const query = isAdmin ? { slug } : { slug, isPublished: true };
      const tour = await Tour.findOne(query).lean();
      if (!tour) {
        return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
      }
      return NextResponse.json({ tour });
    }

    const filter: Record<string, unknown> = isAdmin ? {} : { isPublished: true };

    if (category) filter.category = category;
    if (featured === 'true') filter.isFeatured = true;

    let query = Tour.find(filter).select(
      'title slug shortDescription coverImage price currency duration groupSize category isFeatured createdAt'
    ).sort({ createdAt: -1 });
    if (limit) query = query.limit(Number(limit));

    const tours = await query.lean();
    const response = NextResponse.json({ tours });
    if (!isAdmin) {
      response.headers.set(
        'Cache-Control',
        'public, s-maxage=300, stale-while-revalidate=600'
      );
    }
    return response;
  } catch (error) {
    logError('GET /api/tours', error);
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

    const parsed = tourSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const dbError = await requireDatabase();
    if (dbError) return dbError;

    const existing = await Tour.findOne({ slug: parsed.data.slug });
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }

    const tour = await Tour.create(parsed.data);
    revalidatePublicContent(['tours']);
    return NextResponse.json({ tour }, { status: 201 });
  } catch (error) {
    logError('POST /api/tours', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

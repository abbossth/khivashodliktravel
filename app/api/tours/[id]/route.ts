export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import Tour from '@/models/Tour';
import { verifyAdminToken } from '@/lib/auth';
import { tourSchema } from '@/lib/validations';
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

    const tour = await Tour.findById(params.id).lean();

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    const isAdmin = await verifyAdminToken(request);
    if (!tour.isPublished && !isAdmin) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    return NextResponse.json({ tour });
  } catch (error) {
    logError('GET /api/tours/[id]', error);
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

    const parsed = tourSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const dbError = await requireDatabase();
    if (dbError) return dbError;

    const existing = await Tour.findOne({
      slug: parsed.data.slug,
      _id: { $ne: params.id },
    });
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }

    const tour = await Tour.findByIdAndUpdate(params.id, parsed.data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    revalidatePublicContent(['tours']);
    return NextResponse.json({ tour });
  } catch (error) {
    logError('PUT /api/tours/[id]', error);
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

    const tour = await Tour.findByIdAndDelete(params.id);

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    revalidatePublicContent(['tours']);
    return NextResponse.json({ success: true });
  } catch (error) {
    logError('DELETE /api/tours/[id]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import Booking from '@/models/Booking';
import '@/models/Tour'; // ensure Tour model is registered for populate
import { verifyAdminToken } from '@/lib/auth';
import { bookingSchema, bookingStatusSchema } from '@/lib/validations';
import { sendBookingNotification } from '@/lib/email';
import { requireDatabase, parseRequestBody } from '@/lib/api-db';
import { logError } from '@/lib/safe';

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminToken(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbError = await requireDatabase();
    if (dbError) return dbError;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const filter: Record<string, unknown> = {};
    if (status) {
      const parsed = bookingStatusSchema.safeParse(status);
      if (parsed.success) filter.status = parsed.data;
    }

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .populate('tourId', 'title slug')
      .lean();

    return NextResponse.json({ bookings: bookings ?? [] });
  } catch (error) {
    logError('GET /api/bookings', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { data: body, error: bodyError } = await parseRequestBody<unknown>(request);
    if (bodyError) return bodyError;

    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const dbError = await requireDatabase();
    if (dbError) return dbError;

    const booking = await Booking.create({
      ...parsed.data,
      date: new Date(parsed.data.date),
    });

    try {
      await sendBookingNotification(booking);
    } catch (emailError) {
      logError('booking email', emailError);
    }

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    logError('POST /api/bookings', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminToken(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: body, error: bodyError } = await parseRequestBody<{
      id?: string;
      status?: string;
    }>(request);
    if (bodyError) return bodyError;

    const { id, status } = body ?? {};

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    const parsed = bookingStatusSchema.safeParse(status);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const dbError = await requireDatabase();
    if (dbError) return dbError;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: parsed.data },
      { new: true }
    ).lean();

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    logError('PATCH /api/bookings', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

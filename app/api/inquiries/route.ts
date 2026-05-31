export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import Inquiry from '@/models/Inquiry';
import { verifyAdminToken } from '@/lib/auth';
import { inquirySchema } from '@/lib/validations';
import { sendInquiryNotification } from '@/lib/email';
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

    const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ inquiries: inquiries ?? [] });
  } catch (error) {
    logError('GET /api/inquiries', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { data: body, error: bodyError } = await parseRequestBody<unknown>(request);
    if (bodyError) return bodyError;

    const parsed = inquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const dbError = await requireDatabase();
    if (dbError) return dbError;

    const inquiry = await Inquiry.create(parsed.data);

    try {
      await sendInquiryNotification(inquiry);
    } catch (emailError) {
      logError('inquiry email', emailError);
    }

    return NextResponse.json({ inquiry }, { status: 201 });
  } catch (error) {
    logError('POST /api/inquiries', error);
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
    if (!id || !['new', 'replied', 'closed'].includes(status ?? '')) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const dbError = await requireDatabase();
    if (dbError) return dbError;

    const inquiry = await Inquiry.findByIdAndUpdate(id, { status }, { new: true }).lean();

    if (!inquiry) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ inquiry });
  } catch (error) {
    logError('PATCH /api/inquiries', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

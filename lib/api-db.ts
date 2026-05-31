import { NextResponse } from 'next/server';
import { connectDBSafe } from '@/lib/mongodb';
import { logError } from '@/lib/safe';

export async function requireDatabase(): Promise<NextResponse | null> {
  const connected = await connectDBSafe();
  if (!connected) {
    return NextResponse.json(
      { error: 'Service temporarily unavailable. Please try again later.' },
      { status: 503 }
    );
  }
  return null;
}

export async function parseRequestBody<T>(
  request: Request
): Promise<{ data: T | null; error: NextResponse | null }> {
  try {
    const data = (await request.json()) as T;
    return { data, error: null };
  } catch (error) {
    logError('parseRequestBody', error);
    return {
      data: null,
      error: NextResponse.json({ error: 'Invalid request body' }, { status: 400 }),
    };
  }
}

export function apiError(message: string, status = 500): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

import mongoose from 'mongoose';
import { logError } from '@/lib/safe';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

function resetCache(): void {
  cached.conn = null;
  cached.promise = null;
}

/** Returns true if connected; never throws */
export async function connectDBSafe(): Promise<boolean> {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    return false;
  }

  try {
    if (cached.conn) {
      return true;
    }

    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 8000,
        socketTimeoutMS: 45000,
      });
    }

    cached.conn = await cached.promise;
    return true;
  } catch (error) {
    logError('connectDBSafe', error);
    resetCache();
    return false;
  }
}

/** @throws only when MONGODB_URI is missing — prefer connectDBSafe in new code */
export default async function connectDB(): Promise<typeof mongoose> {
  const ok = await connectDBSafe();
  if (!ok) {
    throw new Error('Database connection unavailable');
  }
  return cached.conn!;
}

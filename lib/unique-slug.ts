import type { Model } from 'mongoose';

async function slugTaken(
  slug: string,
  model: Model<unknown>,
  excludeId?: string
): Promise<boolean> {
  const filter: Record<string, unknown> = { slug };
  if (excludeId) {
    filter._id = { $ne: excludeId };
  }
  const existing = await model.findOne(filter).select('_id').lean();
  return Boolean(existing);
}

/**
 * Returns a slug that is unique in the given collection.
 * Appends -2, -3, … when the base slug is already used.
 */
export async function ensureUniqueSlug(
  baseSlug: string,
  model: Model<unknown>,
  excludeId?: string
): Promise<string> {
  const base = baseSlug.trim().replace(/-+$/, '') || 'item';
  let candidate = base;
  let suffix = 2;

  while (await slugTaken(candidate, model, excludeId)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
    if (suffix > 200) {
      throw new Error('Could not generate a unique URL slug');
    }
  }

  return candidate;
}

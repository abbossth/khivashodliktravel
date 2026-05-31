import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { islambekTours } from './islambek-tours-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const envPath = resolve(__dirname, '../.env.local');
  const content = readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    let val = trimmed.slice(eq + 1);
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val.replace(/\\n/g, '\n');
  }
}

loadEnv();

const tourSchema = new mongoose.Schema(
  {
    title: { en: String, ru: String, uz: String },
    slug: { type: String, unique: true },
    description: { en: String, ru: String, uz: String },
    shortDescription: { en: String, ru: String, uz: String },
    images: [String],
    coverImage: String,
    price: Number,
    currency: { type: String, enum: ['USD', 'UZS'] },
    duration: String,
    groupSize: Number,
    category: {
      type: String,
      enum: ['daytrip', 'multiday', 'shared', 'private', 'transfer'],
    },
    includes: { en: [String], ru: [String], uz: [String] },
    excludes: { en: [String], ru: [String], uz: [String] },
    itinerary: [
      {
        day: Number,
        title: { en: String, ru: String, uz: String },
        description: { en: String, ru: String, uz: String },
      },
    ],
    highlights: { en: [String], ru: [String], uz: [String] },
    isPublished: Boolean,
    isFeatured: Boolean,
  },
  { timestamps: true }
);

const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

  const slugs = islambekTours.map((t) => t.slug);
  const removed = await Tour.deleteMany({ slug: { $nin: slugs } });
  if (removed.deletedCount) {
    console.log(`Removed ${removed.deletedCount} tours not in catalog`);
  }

  let count = 0;
  for (const tour of islambekTours) {
    await Tour.findOneAndUpdate(
      { slug: tour.slug },
      tour,
      { upsert: true, returnDocument: 'after' }
    );
    console.log(`✓ ${tour.slug}`);
    count++;
  }

  console.log(`\nDone: ${count} tours seeded from islambektravel.uz catalog.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

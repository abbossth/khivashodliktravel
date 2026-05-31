import { z } from 'zod';

/** Site images under /images/ or remote URLs (e.g. Firebase upload). */
export const imageRefSchema = z
  .string()
  .min(1)
  .refine(
    (value) => value.startsWith('/images/') || /^https?:\/\/.+/i.test(value),
    'Image must be a /images/ path or http(s) URL'
  );

export const localizedStringSchema = z.object({
  en: z.string().min(1),
  ru: z.string().min(1),
  uz: z.string().min(1),
});

export const localizedStringArraySchema = z.object({
  en: z.array(z.string()),
  ru: z.array(z.string()),
  uz: z.array(z.string()),
});

export const itineraryItemSchema = z.object({
  day: z.number().int().min(1),
  title: localizedStringSchema,
  description: localizedStringSchema,
});

export const tourSchema = z.object({
  title: localizedStringSchema,
  slug: z.string().min(1),
  description: localizedStringSchema,
  shortDescription: localizedStringSchema,
  images: z.array(imageRefSchema),
  coverImage: imageRefSchema,
  price: z.number().min(0),
  currency: z.enum(['USD', 'UZS']),
  duration: z.string().min(1),
  groupSize: z.number().int().min(1),
  category: z.enum(['daytrip', 'multiday', 'shared', 'private', 'transfer']),
  includes: localizedStringArraySchema,
  excludes: localizedStringArraySchema,
  itinerary: z.array(itineraryItemSchema),
  highlights: localizedStringArraySchema,
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
});

/** Client booking form (strings from HTML inputs, coerced on submit). */
export const bookingFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().min(5, 'Enter a valid phone number'),
  date: z.string().min(1, 'Please select a date'),
  guests: z
    .string()
    .min(1, 'Enter number of guests')
    .refine((v) => {
      const n = Number(v);
      return !Number.isNaN(n) && Number.isInteger(n) && n >= 1 && n <= 50;
    }, 'Between 1 and 50 guests'),
  message: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export const bookingSchema = z.object({
  tourId: z.string().min(1),
  tourTitle: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  date: z.union([z.string().min(1), z.date()]),
  guests: z.coerce.number().int().min(1),
  message: z.string().optional().default(''),
});

export const blogPostSchema = z.object({
  title: localizedStringSchema,
  slug: z.string().min(1),
  content: localizedStringSchema,
  excerpt: localizedStringSchema,
  coverImage: imageRefSchema,
  tags: z.array(z.string()),
  isPublished: z.boolean(),
});

export const bookingStatusSchema = z.enum(['pending', 'confirmed', 'cancelled']);

export const inquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  subject: z.string().min(1).optional().default('General inquiry'),
  message: z.string().min(10),
  tourInterest: z.string().optional().default(''),
});

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

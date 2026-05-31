import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILocalizedString {
  en: string;
  ru: string;
  uz: string;
}

export interface ILocalizedStringArray {
  en: string[];
  ru: string[];
  uz: string[];
}

export interface IItineraryItem {
  day: number;
  title: ILocalizedString;
  description: ILocalizedString;
}

export interface ITour extends Document {
  title: ILocalizedString;
  slug: string;
  description: ILocalizedString;
  shortDescription: ILocalizedString;
  images: string[];
  coverImage: string;
  price: number;
  currency: 'USD' | 'UZS';
  duration: string;
  groupSize: number;
  category: 'daytrip' | 'multiday' | 'shared' | 'private' | 'transfer';
  includes: ILocalizedStringArray;
  excludes: ILocalizedStringArray;
  itinerary: IItineraryItem[];
  highlights: ILocalizedStringArray;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const localizedStringSchema = new Schema(
  {
    en: { type: String, required: true },
    ru: { type: String, required: true },
    uz: { type: String, required: true },
  },
  { _id: false }
);

const localizedStringArraySchema = new Schema(
  {
    en: [{ type: String }],
    ru: [{ type: String }],
    uz: [{ type: String }],
  },
  { _id: false }
);

const itineraryItemSchema = new Schema(
  {
    day: { type: Number, required: true },
    title: localizedStringSchema,
    description: localizedStringSchema,
  },
  { _id: false }
);

const tourSchema = new Schema<ITour>(
  {
    title: localizedStringSchema,
    slug: { type: String, required: true, unique: true },
    description: localizedStringSchema,
    shortDescription: localizedStringSchema,
    images: [{ type: String }],
    coverImage: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, enum: ['USD', 'UZS'], default: 'USD' },
    duration: { type: String, required: true },
    groupSize: { type: Number, required: true },
    category: {
      type: String,
      enum: ['daytrip', 'multiday', 'shared', 'private', 'transfer'],
      required: true,
    },
    includes: localizedStringArraySchema,
    excludes: localizedStringArraySchema,
    itinerary: [itineraryItemSchema],
    highlights: localizedStringArraySchema,
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Tour: Model<ITour> =
  mongoose.models.Tour || mongoose.model<ITour>('Tour', tourSchema);

export default Tour;

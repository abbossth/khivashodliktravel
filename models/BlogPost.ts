import mongoose, { Schema, Document, Model } from 'mongoose';
import type { ILocalizedString } from './Tour';

export interface IBlogPost extends Document {
  title: ILocalizedString;
  slug: string;
  content: ILocalizedString;
  excerpt: ILocalizedString;
  coverImage: string;
  tags: string[];
  isPublished: boolean;
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

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: localizedStringSchema,
    slug: { type: String, required: true, unique: true },
    content: localizedStringSchema,
    excerpt: localizedStringSchema,
    coverImage: { type: String, required: true },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', blogPostSchema);

export default BlogPost;

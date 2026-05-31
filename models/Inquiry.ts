import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInquiry extends Document {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  tourInterest?: string;
  status: 'new' | 'replied' | 'closed';
  createdAt: Date;
}

const inquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    subject: { type: String, default: 'General inquiry' },
    message: { type: String, required: true },
    tourInterest: { type: String, default: '' },
    status: {
      type: String,
      enum: ['new', 'replied', 'closed'],
      default: 'new',
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', inquirySchema);

export default Inquiry;

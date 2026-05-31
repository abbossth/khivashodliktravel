import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import type { IBooking } from '@/models/Booking';
import type { IInquiry } from '@/models/Inquiry';
import { logError } from '@/lib/safe';

let transporter: Transporter | null = null;

function isEmailConfigured(): boolean {
  return Boolean(
    process.env.EMAIL_HOST &&
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASS &&
      process.env.ADMIN_EMAIL
  );
}

function getTransporter(): Transporter | null {
  if (!isEmailConfigured()) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  return transporter;
}

export async function sendBookingNotification(booking: IBooking): Promise<void> {
  const transport = getTransporter();
  if (!transport) return;

  const adminEmail = process.env.ADMIN_EMAIL!;

  try {
    await transport.sendMail({
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: `New Booking Request: ${booking.tourTitle}`,
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Tour:</strong> ${booking.tourTitle}</p>
        <p><strong>Name:</strong> ${booking.name}</p>
        <p><strong>Email:</strong> ${booking.email}</p>
        <p><strong>Phone:</strong> ${booking.phone}</p>
        <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
        <p><strong>Guests:</strong> ${booking.guests}</p>
        <p><strong>Message:</strong> ${booking.message || 'N/A'}</p>
      `,
    });
  } catch (error) {
    logError('sendBookingNotification', error);
  }
}

export async function sendInquiryNotification(inquiry: IInquiry): Promise<void> {
  const transport = getTransporter();
  if (!transport) return;

  const adminEmail = process.env.ADMIN_EMAIL!;

  try {
    await transport.sendMail({
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: `Contact: ${inquiry.subject}`,
      html: `
        <h2>New contact inquiry</h2>
        <p><strong>Name:</strong> ${inquiry.name}</p>
        <p><strong>Email:</strong> ${inquiry.email}</p>
        <p><strong>Phone:</strong> ${inquiry.phone}</p>
        <p><strong>Tour interest:</strong> ${inquiry.tourInterest || '—'}</p>
        <p><strong>Message:</strong></p>
        <p>${inquiry.message.replace(/\n/g, '<br/>')}</p>
      `,
    });
  } catch (error) {
    logError('sendInquiryNotification', error);
  }
}

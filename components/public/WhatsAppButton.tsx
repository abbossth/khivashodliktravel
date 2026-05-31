'use client';

import WhatsAppIcon from '@/components/shared/WhatsAppIcon';
import { getWhatsAppDigits } from '@/lib/contact';

export default function WhatsAppButton() {
  const whatsapp = getWhatsAppDigits();

  return (
    <a
      href={`https://wa.me/${whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] p-3 text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
      aria-label="WhatsApp"
    >
      <WhatsAppIcon className="h-8 w-8" />
    </a>
  );
}

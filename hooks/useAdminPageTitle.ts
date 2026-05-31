'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function useAdminPageTitle(): string {
  const pathname = usePathname();
  const t = useTranslations('admin.pages');

  if (pathname === '/admin') return t('dashboard');
  if (pathname === '/admin/tours') return t('tours');
  if (pathname === '/admin/tours/new') return t('newTour');
  if (pathname.match(/\/admin\/tours\/[^/]+\/edit$/)) return t('editTour');
  if (pathname === '/admin/blog') return t('blog');
  if (pathname === '/admin/blog/new') return t('newPost');
  if (pathname.match(/\/admin\/blog\/[^/]+\/edit$/)) return t('editPost');
  if (pathname === '/admin/bookings') return t('bookings');
  if (pathname === '/admin/inquiries') return t('inquiries');
  return t('default');
}

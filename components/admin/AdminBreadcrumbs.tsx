'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

const SEGMENT_KEYS: Record<string, string> = {
  admin: 'badge',
  tours: 'tours',
  blog: 'blog',
  bookings: 'bookings',
  inquiries: 'inquiries',
  new: 'newTour',
  edit: 'editTour',
};

export default function AdminBreadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname();
  const t = useTranslations('admin');

  if (pathname === '/admin/login') return null;

  const parts = pathname.split('/').filter(Boolean);
  const crumbs: { href: string; label: string }[] = [];

  let href = '';
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    href += `/${part}`;

    if (part === 'admin' && i === 0) {
      crumbs.push({ href, label: t('badge') });
      continue;
    }
    if (part.match(/^[a-f0-9]{24}$/i)) continue;
    if (part === 'new') {
      const parent = parts[i - 1];
      if (parent === 'tours') crumbs.push({ href, label: t('pages.newTour') });
      else if (parent === 'blog') crumbs.push({ href, label: t('pages.newPost') });
      continue;
    }
    if (part === 'edit') {
      const parent = parts[i - 2] ?? parts[i - 1];
      if (parent === 'tours') crumbs.push({ href: pathname, label: t('pages.editTour') });
      else if (parent === 'blog') crumbs.push({ href: pathname, label: t('pages.editPost') });
      continue;
    }

    const key = SEGMENT_KEYS[part];
    const label = key === 'badge' ? t('badge') : key ? t(`pages.${key}` as 'pages.tours') : part;
    crumbs.push({ href, label });
  }

  if (crumbs.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('mb-4 flex flex-wrap items-center gap-1 text-sm text-[#64748B]', className)}
    >
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={crumb.href + crumb.label} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden />}
            {isLast ? (
              <span className="font-medium text-[#1E293B]">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-[#F97316] transition-colors">
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

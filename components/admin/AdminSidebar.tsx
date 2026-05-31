'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  Map,
  FileText,
  CalendarCheck,
  MessageSquare,
  LogOut,
} from 'lucide-react';
import BrandLogo from '@/components/shared/BrandLogo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { clearAdminAuthCookie } from '@/lib/auth-cookie';
import { getFirebaseAuthSafe } from '@/lib/firebase';

const NAV_ITEMS = [
  { href: '/admin', key: 'dashboard' as const, icon: LayoutDashboard },
  { href: '/admin/tours', key: 'tours' as const, icon: Map },
  { href: '/admin/blog', key: 'blog' as const, icon: FileText },
  { href: '/admin/bookings', key: 'bookings' as const, icon: CalendarCheck },
  { href: '/admin/inquiries', key: 'inquiries' as const, icon: MessageSquare },
];

interface AdminSidebarProps {
  onNavigate?: () => void;
  className?: string;
}

export default function AdminSidebar({ onNavigate, className }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('admin');

  const handleLogout = async () => {
    try {
      const auth = getFirebaseAuthSafe();
      if (auth) await signOut(auth);
    } catch {
      /* ignore */
    }
    clearAdminAuthCookie();
    router.push('/admin/login');
  };

  return (
    <aside
      className={cn(
        'flex w-64 flex-col border-r border-white/10 bg-brand-blue text-white',
        className
      )}
    >
      <div className="border-b border-white/10 p-6">
        <Link href="/admin" className="block rounded-lg transition-opacity hover:opacity-90">
          <BrandLogo variant="mark" theme="dark" showText markClassName="h-10 w-10 bg-white/10" />
          <p className="mt-2 text-xs text-blue-200/90">{t('panel')}</p>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-orange text-white shadow-md'
                  : 'text-blue-100 hover:bg-white/10'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {t(`nav.${link.key}`)}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-3">
        <Button
          variant="ghost"
          className="w-full justify-start text-blue-100 hover:bg-white/10 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t('logout')}
        </Button>
      </div>
    </aside>
  );
}

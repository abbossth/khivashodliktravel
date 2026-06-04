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

const NAV_MAIN = [
  { href: '/admin', key: 'dashboard' as const, icon: LayoutDashboard },
  { href: '/admin/tours', key: 'tours' as const, icon: Map },
  { href: '/admin/blog', key: 'blog' as const, icon: FileText },
] as const;

const NAV_OPS = [
  { href: '/admin/bookings', key: 'bookings' as const, icon: CalendarCheck },
  { href: '/admin/inquiries', key: 'inquiries' as const, icon: MessageSquare },
] as const;

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

  const navLink = (link: (typeof NAV_MAIN)[number] | (typeof NAV_OPS)[number]) => {
    const Icon = link.icon;
    const isActive =
      link.href === '/admin' ? pathname === '/admin' : pathname.startsWith(link.href);

    return (
      <Link
        key={link.href}
        href={link.href}
        onClick={onNavigate}
        className={cn(
          'flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all',
          isActive
            ? 'bg-[#F97316] text-white shadow-md shadow-orange-500/25'
            : 'text-slate-300 hover:bg-white/10 hover:text-white'
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {t(`nav.${link.key}`)}
      </Link>
    );
  };

  return (
    <aside
      className={cn('flex w-[260px] shrink-0 flex-col bg-[#0F172A] text-white', className)}
    >
      <div className="relative overflow-hidden border-b border-white/10 px-5 py-6">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'linear-gradient(135deg, #1E3A5F 0%, transparent 50%), radial-gradient(circle at 80% 20%, #F9731633, transparent 45%)',
          }}
          aria-hidden
        />
        <Link
          href="/admin"
          onClick={onNavigate}
          className="relative block rounded-xl transition-opacity hover:opacity-90"
        >
          <BrandLogo variant="mark" theme="dark" showText markClassName="h-11 w-11" />
          <p className="mt-2 text-xs font-medium tracking-wide text-slate-400">{t('panel')}</p>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto p-3">
        <div className="space-y-1">
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Content
          </p>
          {NAV_MAIN.map(navLink)}
        </div>
        <div className="space-y-1 border-t border-white/10 pt-4">
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Operations
          </p>
          {NAV_OPS.map(navLink)}
        </div>
      </nav>

      <div className="border-t border-white/10 p-3">
        <Button
          variant="ghost"
          className="h-11 w-full justify-start rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-300"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t('logout')}
        </Button>
      </div>
    </aside>
  );
}

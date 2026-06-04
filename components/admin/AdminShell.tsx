'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminBreadcrumbs from '@/components/admin/AdminBreadcrumbs';
import AuthGuard from '@/components/admin/AuthGuard';
import AdminLanguageSwitcher from '@/components/admin/AdminLanguageSwitcher';
import RouteProgress from '@/components/shared/RouteProgress';
import { Toaster } from '@/components/ui/sonner';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAdminStore } from '@/hooks/useAdmin';
import { useAdminPageTitle } from '@/hooks/useAdminPageTitle';
function UserAvatar({ email }: { email: string }) {
  const initial = (email[0] ?? 'A').toUpperCase();
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F97316] to-[#EA580C] text-sm font-bold text-white shadow-sm"
      title={email}
    >
      {initial}
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const { user } = useAdminStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pageTitle = useAdminPageTitle();
  const t = useTranslations('admin');

  if (isLoginPage) {
    return (
      <>
        <RouteProgress />
        <div className="fixed right-4 top-4 z-50">
          <AdminLanguageSwitcher />
        </div>
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </>
    );
  }

  return (
    <AuthGuard>
      <RouteProgress />
      <div className="admin-root flex min-h-screen bg-[#F8FAFC]">
        <AdminSidebar className="hidden lg:flex" />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-slate-200/80 bg-white px-4 shadow-sm sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm hover:bg-slate-50 lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5 text-[#1E293B]" />
                </SheetTrigger>
                <SheetContent side="left" className="w-[260px] border-0 p-0">
                  <AdminSidebar onNavigate={() => setMobileOpen(false)} className="h-full w-full" />
                </SheetContent>
              </Sheet>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">
                  {t('badge')}
                </p>
                <h1 className="truncate text-xl font-bold tracking-tight text-[#1E293B]">
                  {pageTitle}
                </h1>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <AdminLanguageSwitcher />
              {user?.email && (
                <div className="hidden items-center gap-2.5 sm:flex">
                  <UserAvatar email={user.email} />
                  <p className="max-w-[180px] truncate text-sm text-[#64748B]">{user.email}</p>
                </div>
              )}
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            <div className="admin-page-enter mx-auto max-w-7xl">
              <AdminBreadcrumbs />
              {children}
            </div>
          </main>
        </div>
      </div>
      <Toaster position="bottom-right" richColors closeButton />
    </AuthGuard>
  );
}

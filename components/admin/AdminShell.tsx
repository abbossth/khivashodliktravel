'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AuthGuard from '@/components/admin/AuthGuard';
import AdminLanguageSwitcher from '@/components/admin/AdminLanguageSwitcher';
import RouteProgress from '@/components/shared/RouteProgress';
import { Toaster } from '@/components/ui/sonner';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAdminStore } from '@/hooks/useAdmin';
import { useAdminPageTitle } from '@/hooks/useAdminPageTitle';

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
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <AuthGuard>
      <RouteProgress />
      <div className="flex min-h-screen bg-slate-50">
        <AdminSidebar className="hidden lg:flex" />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-white px-4 shadow-sm sm:px-6">
            <div className="flex items-center gap-3">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-accent lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </SheetTrigger>
                <SheetContent side="left" className="w-64 border-0 p-0">
                  <AdminSidebar onNavigate={() => setMobileOpen(false)} className="h-full w-full" />
                </SheetContent>
              </Sheet>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t('badge')}
                </p>
                <h1 className="text-lg font-semibold text-brand-blue">{pageTitle}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AdminLanguageSwitcher />
              {user && (
                <p className="hidden max-w-[200px] truncate text-sm text-muted-foreground sm:block">
                  {user.email}
                </p>
              )}
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </AuthGuard>
  );
}

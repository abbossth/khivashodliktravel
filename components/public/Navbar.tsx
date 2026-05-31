'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Menu } from 'lucide-react';
import BrandLogo from '@/components/shared/BrandLogo';
import { buttonVariants } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/', label: t('home') },
    { href: '/tours', label: t('tours') },
    { href: '/blog', label: t('blog') },
    { href: '/contact', label: t('contact') },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const navLinkClass = (href: string) =>
    cn(
      'text-sm font-medium transition-colors',
      isActive(href)
        ? 'text-brand-orange'
        : 'text-gray-600 hover:text-brand-blue'
    );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-white/90 shadow-sm backdrop-blur-md">
      <div className="page-shell flex h-16 items-center justify-between">
        <Link href="/" className="rounded-md">
          <BrandLogo variant="mark" showText priority />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn('rounded-lg px-3 py-2', navLinkClass(link.href))}
            >
              {link.label}
            </Link>
          ))}
          <div className="ml-2 flex items-center gap-2 border-l pl-4">
            <LanguageSwitcher />
            <Button asChild size="sm" className="bg-brand-orange hover:bg-brand-orange/90">
              <Link href="/tours">{t('bookTour')}</Link>
            </Button>
          </div>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className={buttonVariants({ variant: 'ghost', size: 'icon' })}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle className="text-left text-brand-blue">Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'rounded-lg px-3 py-3 text-base',
                      isActive(link.href)
                        ? 'bg-brand-blue/5 font-semibold text-brand-orange'
                        : 'text-gray-700 hover:bg-muted'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button asChild className="mt-4 w-full bg-brand-orange hover:bg-brand-orange/90">
                  <Link href="/tours" onClick={() => setOpen(false)}>
                    {t('bookTour')}
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

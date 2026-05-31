'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Globe } from 'lucide-react';
import { LOCALES, LOCALE_LABELS } from '@/lib/i18n-locales';
import { useAdminLocale } from '@/components/admin/AdminLocaleProvider';
import type { Locale } from '@/types';
import { cn } from '@/lib/utils';

interface AdminLanguageSwitcherProps {
  className?: string;
}

export default function AdminLanguageSwitcher({ className }: AdminLanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const { setAdminLocale } = useAdminLocale();
  const t = useTranslations('common');

  return (
    <div className={cn('relative', className)}>
      <Globe
        className="pointer-events-none absolute left-2.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <select
        aria-label={t('language')}
        value={locale}
        onChange={(event) => {
          const next = event.target.value as Locale;
          if (next && next !== locale) {
            setAdminLocale(next);
          }
        }}
        className="h-9 w-[130px] cursor-pointer appearance-none rounded-lg border border-border/80 bg-background py-1.5 pr-8 pl-8 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {LOCALES.map((loc) => (
          <option key={loc} value={loc}>
            {LOCALE_LABELS[loc]}
          </option>
        ))}
      </select>
    </div>
  );
}

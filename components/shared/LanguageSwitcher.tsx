'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Globe } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/routing';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LOCALES, LOCALE_LABELS } from '@/lib/i18n-locales';
import type { Locale } from '@/types';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('common');

  return (
    <Select
      value={locale}
      onValueChange={(next) => next && router.replace(pathname, { locale: next as Locale })}
    >
      <SelectTrigger
        className={cn(
          'h-9 w-[148px] gap-2 border-border/80 bg-background',
          className
        )}
        aria-label={t('language')}
      >
        <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
        <SelectValue placeholder={t('language')} />
      </SelectTrigger>
      <SelectContent align="end">
        {LOCALES.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {LOCALE_LABELS[loc]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

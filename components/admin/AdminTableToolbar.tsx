'use client';

import { Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type AdminTableToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  totalCount: number;
  filteredCount: number;
  actions?: React.ReactNode;
  filters?: React.ReactNode;
  className?: string;
};

export default function AdminTableToolbar({
  search,
  onSearchChange,
  placeholder,
  totalCount,
  filteredCount,
  actions,
  filters,
  className,
}: AdminTableToolbarProps) {
  const t = useTranslations('admin.pagination');

  return (
    <div
      className={cn(
        'flex flex-col gap-3 border-b border-slate-100 bg-white px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between',
        className
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder ?? t('searchPlaceholder')}
            className="admin-input h-10 bg-[#F8FAFC] pl-9 pr-9"
          />
          {search && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0.5 top-1/2 h-8 w-8 -translate-y-1/2"
              onClick={() => onSearchChange('')}
              aria-label={t('clearSearch')}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        {filters && <div className="flex flex-wrap items-center gap-2">{filters}</div>}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <p className="text-xs text-[#64748B]">
          {filteredCount === totalCount
            ? t('countTotal', { count: totalCount })
            : t('countFiltered', { filtered: filteredCount, total: totalCount })}
        </p>
        {actions}
      </div>
    </div>
  );
}

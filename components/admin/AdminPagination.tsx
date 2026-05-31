'use client';

import { useTranslations } from 'next-intl';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getPageNumbers, PAGE_SIZE_OPTIONS, type PageSizeOption } from '@/lib/pagination';
import { cn } from '@/lib/utils';

export type AdminPaginationProps = {
  page: number;
  pageSize: PageSizeOption;
  total: number;
  totalPages: number;
  from: number;
  to: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: PageSizeOption) => void;
  className?: string;
};

export default function AdminPagination({
  page,
  pageSize,
  total,
  totalPages,
  from,
  to,
  hasNext,
  hasPrev,
  onPageChange,
  onPageSizeChange,
  className,
}: AdminPaginationProps) {
  const t = useTranslations('admin.pagination');
  const pages = getPageNumbers(page, totalPages);

  if (total === 0) return null;

  return (
    <div
      className={cn(
        'flex flex-col gap-4 border-t border-border/60 bg-gradient-to-b from-slate-50/90 to-slate-50/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <p>
          {t('showing', { from, to, total })}
        </p>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">{t('rowsPerPage')}</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => v && onPageSizeChange(Number(v) as PageSizeOption)}
          >
            <SelectTrigger className="h-8 w-[72px] bg-white text-xs font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <nav
        className="flex items-center justify-center gap-1 sm:justify-end"
        aria-label={t('ariaLabel')}
      >
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 bg-white"
          disabled={!hasPrev}
          onClick={() => onPageChange(1)}
          aria-label={t('first')}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 bg-white"
          disabled={!hasPrev}
          onClick={() => onPageChange(page - 1)}
          aria-label={t('previous')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="hidden items-center gap-1 px-1 sm:flex">
          {pages.map((p, idx) =>
            p === 'ellipsis' ? (
              <span
                key={`ellipsis-${idx}`}
                className="flex h-8 w-8 items-center justify-center text-muted-foreground"
              >
                …
              </span>
            ) : (
              <Button
                key={p}
                type="button"
                variant={p === page ? 'default' : 'outline'}
                size="icon"
                className={cn(
                  'h-8 w-8 shrink-0 text-xs font-semibold',
                  p === page
                    ? 'bg-brand-blue text-white hover:bg-brand-blue/90'
                    : 'bg-white'
                )}
                onClick={() => onPageChange(p)}
                aria-label={t('page', { page: p })}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </Button>
            )
          )}
        </div>

        <span className="min-w-[4.5rem] px-2 text-center text-xs font-medium text-muted-foreground sm:hidden">
          {t('pageOf', { page, totalPages })}
        </span>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 bg-white"
          disabled={!hasNext}
          onClick={() => onPageChange(page + 1)}
          aria-label={t('next')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 bg-white"
          disabled={!hasNext}
          onClick={() => onPageChange(totalPages)}
          aria-label={t('last')}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </nav>
    </div>
  );
}

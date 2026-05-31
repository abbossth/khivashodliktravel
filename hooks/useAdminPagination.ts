'use client';

import { useEffect, useMemo, useState } from 'react';
import { paginate, type PageSizeOption, PAGE_SIZE_OPTIONS } from '@/lib/pagination';

type UseAdminPaginationOptions = {
  initialPageSize?: PageSizeOption;
  /** Reset to page 1 when these values change (e.g. filters, search). */
  resetDeps?: unknown[];
};

export function useAdminPagination<T>(
  items: T[],
  options: UseAdminPaginationOptions = {}
) {
  const { initialPageSize = 10, resetDeps = [] } = options;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSizeOption>(
    PAGE_SIZE_OPTIONS.includes(initialPageSize as PageSizeOption)
      ? initialPageSize
      : 10
  );

  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when filters/search change
  }, [pageSize, ...resetDeps]);

  const result = useMemo(() => paginate(items, page, pageSize), [items, page, pageSize]);

  useEffect(() => {
    if (page > result.totalPages) {
      setPage(result.totalPages);
    }
  }, [page, result.totalPages]);

  const goToPage = (next: number) => {
    setPage(Math.min(Math.max(1, next), result.totalPages));
  };

  return {
    paginatedItems: result.items,
    page: result.page,
    pageSize,
    setPageSize: (size: PageSizeOption) => setPageSize(size),
    setPage: goToPage,
    total: result.total,
    totalPages: result.totalPages,
    from: result.from,
    to: result.to,
    hasNext: result.hasNext,
    hasPrev: result.hasPrev,
  };
}

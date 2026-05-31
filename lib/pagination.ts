export const PAGE_SIZE_OPTIONS = [10, 15, 20, 50] as const;
export type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  from: number;
  to: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export function paginate<T>(items: T[], page: number, pageSize: number): PaginationMeta & { items: T[] } {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const end = Math.min(start + pageSize, total);

  return {
    items: items.slice(start, end),
    page: safePage,
    pageSize,
    total,
    totalPages,
    from: total === 0 ? 0 : start + 1,
    to: end,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
  };
}

/** Page numbers with ellipsis for compact pagination controls. */
export function getPageNumbers(current: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 1) return [1];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [1];

  if (current > 3) pages.push('ellipsis');

  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);
  for (let p = start; p <= end; p++) {
    pages.push(p);
  }

  if (current < totalPages - 2) pages.push('ellipsis');

  if (totalPages > 1) pages.push(totalPages);

  return pages;
}

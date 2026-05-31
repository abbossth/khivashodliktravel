'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminTableToolbar from '@/components/admin/AdminTableToolbar';
import { useAdminPagination } from '@/hooks/useAdminPagination';
import type { PageSizeOption } from '@/lib/pagination';

type Column<T> = {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
};

type PaginatedDataTableProps<T extends { _id: string }> = {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  /** Custom search — return true if item matches query. */
  filterItem?: (item: T, query: string) => boolean;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
  onRowClick?: (item: T) => void;
  initialPageSize?: PageSizeOption;
  /** Reset page when these change (e.g. status filter). */
  resetDeps?: unknown[];
  toolbarActions?: React.ReactNode;
  showSearch?: boolean;
};

export default function PaginatedDataTable<T extends { _id: string }>({
  data,
  columns,
  searchPlaceholder,
  filterItem,
  emptyMessage,
  emptyAction,
  onRowClick,
  initialPageSize = 10,
  resetDeps = [],
  toolbarActions,
  showSearch = true,
}: PaginatedDataTableProps<T>) {
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((item) => filterItem?.(item, q) ?? false);
  }, [data, search, filterItem]);

  const pagination = useAdminPagination(filtered, {
    initialPageSize,
    resetDeps: [search, ...resetDeps],
  });

  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [pagination.page]);

  return (
    <div ref={containerRef} className="overflow-hidden rounded-xl border bg-white shadow-sm">
      {showSearch && (
        <AdminTableToolbar
          search={search}
          onSearchChange={setSearch}
          placeholder={searchPlaceholder}
          totalCount={data.length}
          filteredCount={filtered.length}
          actions={toolbarActions}
        />
      )}

      <DataTable
        data={pagination.paginatedItems}
        columns={columns}
        onRowClick={onRowClick}
        emptyMessage={emptyMessage}
        emptyAction={emptyAction}
        bordered={false}
      />

      <AdminPagination
        page={pagination.page}
        pageSize={pagination.pageSize}
        total={pagination.total}
        totalPages={pagination.totalPages}
        from={pagination.from}
        to={pagination.to}
        hasNext={pagination.hasNext}
        hasPrev={pagination.hasPrev}
        onPageChange={pagination.setPage}
        onPageSizeChange={pagination.setPageSize}
      />
    </div>
  );
}

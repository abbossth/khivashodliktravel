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
  filterItem?: (item: T, query: string) => boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  onRowClick?: (item: T) => void;
  initialPageSize?: PageSizeOption;
  resetDeps?: unknown[];
  toolbarActions?: React.ReactNode;
  toolbarFilters?: React.ReactNode;
  showSearch?: boolean;
  enableBulkSelect?: boolean;
};

export default function PaginatedDataTable<T extends { _id: string }>({
  data,
  columns,
  searchPlaceholder,
  filterItem,
  emptyMessage,
  emptyDescription,
  emptyAction,
  onRowClick,
  initialPageSize = 10,
  resetDeps = [],
  toolbarActions,
  toolbarFilters,
  showSearch = true,
  enableBulkSelect = false,
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
    <div
      ref={containerRef}
      className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm"
    >
      {showSearch && (
        <AdminTableToolbar
          search={search}
          onSearchChange={setSearch}
          placeholder={searchPlaceholder}
          totalCount={data.length}
          filteredCount={filtered.length}
          actions={toolbarActions}
          filters={toolbarFilters}
        />
      )}

      <DataTable
        data={pagination.paginatedItems}
        columns={columns}
        onRowClick={onRowClick}
        emptyMessage={emptyMessage}
        emptyDescription={emptyDescription}
        emptyAction={emptyAction}
        bordered={false}
        enableBulkSelect={enableBulkSelect}
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

'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import AdminEmptyState from '@/components/admin/AdminEmptyState';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  bordered?: boolean;
  enableBulkSelect?: boolean;
}

export default function DataTable<T extends { _id: string }>({
  data,
  columns,
  onRowClick,
  emptyMessage = 'No data found',
  emptyDescription,
  emptyAction,
  bordered = true,
  enableBulkSelect = false,
}: DataTableProps<T>) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allSelected = data.length > 0 && data.every((item) => selected.has(item._id));

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(data.map((d) => d._id)));
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const colSpan = columns.length + (enableBulkSelect ? 1 : 0);

  return (
    <div
      className={
        bordered ? 'overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm' : 'overflow-hidden bg-white'
      }
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-100 bg-slate-50/80 hover:bg-slate-50/80">
              {enableBulkSelect && (
                <TableHead className="w-12 pl-4">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={toggleAll}
                    aria-label="Select all rows"
                  />
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={`text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B] ${col.className ?? ''}`}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colSpan} className="p-0">
                  <AdminEmptyState
                    title={emptyMessage}
                    description={emptyDescription}
                    action={emptyAction}
                  />
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow
                  key={item._id}
                  className={`admin-table-row group border-b border-slate-50 ${
                    onRowClick ? 'cursor-pointer' : ''
                  } ${selected.has(item._id) ? 'bg-orange-50/40' : 'hover:bg-slate-50/80'}`}
                  onClick={() => onRowClick?.(item)}
                >
                  {enableBulkSelect && (
                    <TableCell className="w-12 pl-4" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selected.has(item._id)}
                        onCheckedChange={() => toggleOne(item._id)}
                        aria-label="Select row"
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.key} className={`align-middle ${col.className ?? ''}`}>
                      {col.render
                        ? col.render(item)
                        : String((item as Record<string, unknown>)[col.key] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
  emptyAction?: React.ReactNode;
  /** When false, outer border/radius is handled by parent (e.g. PaginatedDataTable). */
  bordered?: boolean;
}

export default function DataTable<T extends { _id: string }>({
  data,
  columns,
  onRowClick,
  emptyMessage = 'No data found',
  emptyAction,
  bordered = true,
}: DataTableProps<T>) {
  return (
    <div
      className={
        bordered ? 'overflow-hidden rounded-xl border bg-white shadow-sm' : 'overflow-hidden bg-white'
      }
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-16 text-center">
                  <p className="text-muted-foreground">{emptyMessage}</p>
                  {emptyAction && <div className="mt-4">{emptyAction}</div>}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow
                  key={item._id}
                  className={
                    onRowClick
                      ? 'cursor-pointer transition-colors hover:bg-brand-blue/[0.04]'
                      : 'transition-colors hover:bg-muted/30'
                  }
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
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

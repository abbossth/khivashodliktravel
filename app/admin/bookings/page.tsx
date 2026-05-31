'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PaginatedDataTable from '@/components/admin/PaginatedDataTable';
import AdminLoading from '@/components/admin/AdminLoading';
import { useAdminStore } from '@/hooks/useAdmin';
import { parseJsonResponse } from '@/hooks/useSafeFetch';
import { matchAdminSearch } from '@/lib/admin-search';
import type { Booking, BookingStatus } from '@/types';

const statusStyles: Record<BookingStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export default function AdminBookingsPage() {
  const t = useTranslations('admin.pagination');
  const { token } = useAdminStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setFetchError(null);

    try {
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const res = await fetch(`/api/bookings${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const parsed = await parseJsonResponse<{ bookings?: Booking[] }>(res);
      if (parsed.ok) {
        setBookings(Array.isArray(parsed.data?.bookings) ? parsed.data.bookings : []);
      } else {
        setBookings([]);
        setFetchError(parsed.error ?? 'Failed to load bookings');
      }
    } catch {
      setBookings([]);
      setFetchError('Network error while loading bookings');
    } finally {
      setLoading(false);
    }
  }, [token, statusFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const filteredByStatus = useMemo(() => bookings, [bookings]);

  const updateStatus = async (id: string, status: BookingStatus) => {
    if (!token) return;
    try {
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        toast.success('Status updated');
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status } : b))
        );
      } else {
        toast.error('Failed to update status');
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const columns = [
    { key: 'name', header: 'Guest', className: 'font-medium min-w-[120px]' },
    { key: 'tourTitle', header: 'Tour', className: 'min-w-[140px]' },
    {
      key: 'date',
      header: 'Date',
      render: (b: Booking) => {
        try {
          return format(new Date(b.date), 'MMM d, yyyy');
        } catch {
          return '—';
        }
      },
    },
    { key: 'guests', header: 'Guests' },
    { key: 'phone', header: 'Phone', className: 'hidden md:table-cell' },
    { key: 'email', header: 'Email', className: 'hidden lg:table-cell' },
    {
      key: 'status',
      header: 'Status',
      render: (b: Booking) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Select
            value={b.status}
            onValueChange={(v) => v && updateStatus(b._id, v as BookingStatus)}
          >
            <SelectTrigger className="h-9 w-[130px] border-0 bg-transparent p-0 shadow-none">
              <Badge className={statusStyles[b.status] ?? statusStyles.pending}>{b.status}</Badge>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Received',
      className: 'hidden sm:table-cell text-muted-foreground text-sm',
      render: (b: Booking) => {
        try {
          return format(new Date(b.createdAt), 'MMM d, yyyy');
        } catch {
          return '—';
        }
      },
    },
  ];

  return (
    <div className="space-y-6">
      {fetchError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {fetchError}
          <Button variant="link" className="ml-2 h-auto p-0" onClick={fetchBookings}>
            Retry
          </Button>
        </div>
      )}

      {loading ? (
        <AdminLoading />
      ) : (
        <PaginatedDataTable
          data={filteredByStatus}
          columns={columns}
          searchPlaceholder={t('searchPlaceholder')}
          filterItem={(b, q) =>
            matchAdminSearch(q, b.name, b.email, b.phone, b.tourTitle, b.status)
          }
          emptyMessage="No bookings yet"
          initialPageSize={15}
          resetDeps={[statusFilter]}
          toolbarActions={
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? 'all')}>
              <SelectTrigger className="h-9 w-full sm:w-44">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          }
        />
      )}
    </div>
  );
}

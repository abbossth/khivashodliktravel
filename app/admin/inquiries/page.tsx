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

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  tourInterest?: string;
  status: 'new' | 'replied' | 'closed';
  createdAt: string;
}

export default function AdminInquiriesPage() {
  const t = useTranslations('admin.pagination');
  const { token } = useAdminStore();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchInquiries = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setFetchError(null);

    try {
      const res = await fetch('/api/inquiries', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const parsed = await parseJsonResponse<{ inquiries?: Inquiry[] }>(res);
      if (parsed.ok) {
        setInquiries(Array.isArray(parsed.data?.inquiries) ? parsed.data.inquiries : []);
      } else {
        setInquiries([]);
        setFetchError(parsed.error ?? 'Failed to load inquiries');
      }
    } catch {
      setInquiries([]);
      setFetchError('Network error while loading inquiries');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const filteredByStatus = useMemo(() => {
    if (statusFilter === 'all') return inquiries;
    return inquiries.filter((i) => i.status === statusFilter);
  }, [inquiries, statusFilter]);

  const updateStatus = async (id: string, status: Inquiry['status']) => {
    if (!token) return;
    try {
      const res = await fetch('/api/inquiries', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        toast.success('Status updated');
        setInquiries((prev) => prev.map((i) => (i._id === id ? { ...i, status } : i)));
      } else {
        toast.error('Update failed');
      }
    } catch {
      toast.error('Update failed');
    }
  };

  const columns = [
    { key: 'name', header: 'Name', className: 'font-medium' },
    { key: 'email', header: 'Email', className: 'hidden md:table-cell' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'tourInterest',
      header: 'Tour',
      className: 'hidden lg:table-cell max-w-[160px] truncate',
      render: (i: Inquiry) => i.tourInterest || '—',
    },
    {
      key: 'message',
      header: 'Message',
      className: 'max-w-[200px]',
      render: (i: Inquiry) => (
        <span className="line-clamp-2 text-sm text-muted-foreground">{i.message}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (i: Inquiry) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Select
            value={i.status}
            onValueChange={(v) => v && updateStatus(i._id, v as Inquiry['status'])}
          >
            <SelectTrigger className="h-8 w-[110px]">
              <Badge variant={i.status === 'new' ? 'default' : 'secondary'}>{i.status}</Badge>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">new</SelectItem>
              <SelectItem value="replied">replied</SelectItem>
              <SelectItem value="closed">closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      className: 'text-sm text-muted-foreground',
      render: (i: Inquiry) => {
        try {
          return format(new Date(i.createdAt), 'MMM d, yyyy');
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
          <Button variant="link" className="ml-2 h-auto p-0" onClick={fetchInquiries}>
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
          filterItem={(i, q) =>
            matchAdminSearch(
              q,
              i.name,
              i.email,
              i.phone,
              i.subject,
              i.message,
              i.tourInterest,
              i.status
            )
          }
          emptyMessage="No inquiries yet"
          initialPageSize={15}
          resetDeps={[statusFilter]}
          toolbarActions={
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? 'all')}>
              <SelectTrigger className="h-9 w-full sm:w-40">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="new">new</SelectItem>
                <SelectItem value="replied">replied</SelectItem>
                <SelectItem value="closed">closed</SelectItem>
              </SelectContent>
            </Select>
          }
        />
      )}
    </div>
  );
}

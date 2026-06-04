'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import PaginatedDataTable from '@/components/admin/PaginatedDataTable';
import AdminLoading from '@/components/admin/AdminLoading';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import AdminStatusBadge from '@/components/admin/AdminStatusBadge';
import AdminRowActions from '@/components/admin/AdminRowActions';
import SafeImage from '@/components/shared/SafeImage';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminStore } from '@/hooks/useAdmin';
import { parseJsonResponse } from '@/hooks/useSafeFetch';
import { matchAdminSearch } from '@/lib/admin-search';
import type { Tour } from '@/types';

const CATEGORIES = ['daytrip', 'multiday', 'shared', 'private', 'transfer'] as const;

export default function AdminToursPage() {
  const t = useTranslations('admin.pagination');
  const { token } = useAdminStore();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const fetchTours = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setFetchError(null);

    try {
      const res = await fetch('/api/tours?all=true', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const parsed = await parseJsonResponse<{ tours?: Tour[] }>(res);
      if (parsed.ok) {
        setTours(Array.isArray(parsed.data?.tours) ? parsed.data.tours : []);
      } else {
        setTours([]);
        setFetchError(parsed.error ?? 'Failed to load tours');
      }
    } catch {
      setTours([]);
      setFetchError('Network error while loading tours');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const filteredByMeta = useMemo(() => {
    return tours.filter((tour) => {
      if (statusFilter === 'published' && !tour.isPublished) return false;
      if (statusFilter === 'draft' && tour.isPublished) return false;
      if (categoryFilter !== 'all' && tour.category !== categoryFilter) return false;
      return true;
    });
  }, [tours, statusFilter, categoryFilter]);

  const handleDelete = async () => {
    if (!deleteId || !token) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/tours/${deleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Tour deleted');
        setDeleteId(null);
        fetchTours();
      } else {
        toast.error('Failed to delete tour');
      }
    } catch {
      toast.error('Failed to delete tour');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'cover',
      header: 'Image',
      className: 'w-[72px]',
      render: (tour: Tour) => (
        <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200/80">
          <SafeImage src={tour.coverImage} alt="" fill className="object-cover" sizes="48px" />
        </div>
      ),
    },
    {
      key: 'title',
      header: 'Title',
      render: (tour: Tour) => (
        <div>
          <p className="font-medium text-[#1E293B]">{tour.title?.en ?? '—'}</p>
          <p className="text-xs text-[#64748B]">{tour.slug}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (tour: Tour) => (
        <span className="inline-flex rounded-md bg-sky-50 px-2 py-0.5 text-xs font-medium capitalize text-sky-700 ring-1 ring-sky-500/20">
          {tour.category}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (tour: Tour) => (
        <span className="text-sm font-medium text-[#1E293B]">
          {tour.price} {tour.currency}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (tour: Tour) => (
        <AdminStatusBadge status={tour.isPublished ? 'published' : 'draft'} />
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-36 text-right',
      render: (tour: Tour) => (
        <AdminRowActions>
          <Button asChild size="icon" variant="ghost" className="h-8 w-8" aria-label="View on site">
            <a href={`/en/tours/${tour.slug}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild size="icon" variant="ghost" className="h-8 w-8" aria-label="Edit tour">
            <Link href={`/admin/tours/${tour._id}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            aria-label="Delete tour"
            onClick={() => setDeleteId(tour._id)}
          >
            <Trash2 className="h-4 w-4 text-[#EF4444]" />
          </Button>
        </AdminRowActions>
      ),
    },
  ];

  const tableFilters = (
    <>
      <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v as typeof statusFilter)}>
        <SelectTrigger className="h-10 w-[140px] rounded-lg bg-[#F8FAFC] text-sm">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All status</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
        </SelectContent>
      </Select>
      <Select value={categoryFilter} onValueChange={(v) => v && setCategoryFilter(v)}>
        <SelectTrigger className="h-10 w-[140px] rounded-lg bg-[#F8FAFC] text-sm">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#64748B]">Manage tour listings, pricing, and photos.</p>
        <Button asChild className="h-10 rounded-lg bg-[#F97316] px-4 font-semibold hover:bg-[#EA580C]">
          <Link href="/admin/tours/new">
            <Plus className="mr-2 h-4 w-4" /> New tour
          </Link>
        </Button>
      </div>

      {fetchError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {fetchError}
          <Button variant="link" className="ml-2 h-auto p-0 text-red-700" onClick={fetchTours}>
            Retry
          </Button>
        </div>
      )}

      {loading ? (
        <AdminLoading />
      ) : (
        <PaginatedDataTable
          data={filteredByMeta}
          columns={columns}
          searchPlaceholder={t('searchPlaceholder')}
          filterItem={(tour, q) =>
            matchAdminSearch(
              q,
              tour.title?.en,
              tour.title?.ru,
              tour.title?.uz,
              tour.slug,
              tour.category
            )
          }
          emptyMessage="No tours yet"
          emptyDescription="Create your first tour to showcase on the website."
          emptyAction={
            <Button asChild className="rounded-lg bg-[#F97316] hover:bg-[#EA580C]">
              <Link href="/admin/tours/new">Create your first tour</Link>
            </Button>
          }
          initialPageSize={10}
          resetDeps={[statusFilter, categoryFilter]}
          enableBulkSelect
          toolbarFilters={tableFilters}
          toolbarActions={
            <Button asChild size="sm" className="shrink-0 rounded-lg bg-[#F97316] hover:bg-[#EA580C]">
              <Link href="/admin/tours/new">
                <Plus className="mr-2 h-4 w-4" /> New tour
              </Link>
            </Button>
          }
        />
      )}

      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete tour?"
        description="This action cannot be undone. The tour will be removed from the website."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}

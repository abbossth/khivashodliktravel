'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PaginatedDataTable from '@/components/admin/PaginatedDataTable';
import AdminLoading from '@/components/admin/AdminLoading';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import SafeImage from '@/components/shared/SafeImage';
import { useAdminStore } from '@/hooks/useAdmin';
import { parseJsonResponse } from '@/hooks/useSafeFetch';
import { matchAdminSearch } from '@/lib/admin-search';
import type { Tour } from '@/types';

export default function AdminToursPage() {
  const t = useTranslations('admin.pagination');
  const { token } = useAdminStore();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTours = useCallback(async () => {
    if (!token) return;
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
      className: 'w-20',
      render: (tour: Tour) => (
        <div className="relative h-11 w-16 overflow-hidden rounded-md bg-muted">
          <SafeImage src={tour.coverImage} alt="" fill className="object-cover" sizes="64px" />
        </div>
      ),
    },
    {
      key: 'title',
      header: 'Title',
      render: (tour: Tour) => (
        <div>
          <p className="font-medium">{tour.title?.en ?? '—'}</p>
          <p className="text-xs text-muted-foreground">{tour.slug}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (tour: Tour) => <Badge variant="secondary">{tour.category}</Badge>,
    },
    {
      key: 'price',
      header: 'Price',
      render: (tour: Tour) => `${tour.price} ${tour.currency}`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (tour: Tour) => (
        <Badge variant={tour.isPublished ? 'default' : 'outline'}>
          {tour.isPublished ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-32 text-right',
      render: (tour: Tour) => (
        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <Button asChild size="icon" variant="ghost" aria-label="View on site">
            <a href={`/en/tours/${tour.slug}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild size="icon" variant="ghost" aria-label="Edit tour">
            <Link href={`/admin/tours/${tour._id}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Delete tour"
            onClick={() => setDeleteId(tour._id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {fetchError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {fetchError}
          <Button variant="link" className="ml-2 h-auto p-0" onClick={fetchTours}>
            Retry
          </Button>
        </div>
      )}

      {loading ? (
        <AdminLoading />
      ) : (
        <PaginatedDataTable
          data={tours}
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
          emptyAction={
            <Button asChild size="sm" className="bg-brand-blue">
              <Link href="/admin/tours/new">Create your first tour</Link>
            </Button>
          }
          initialPageSize={10}
          toolbarActions={
            <Button asChild size="sm" className="bg-brand-blue shrink-0">
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

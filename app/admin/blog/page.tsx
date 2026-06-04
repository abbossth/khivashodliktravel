'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import PaginatedDataTable from '@/components/admin/PaginatedDataTable';
import AdminLoading from '@/components/admin/AdminLoading';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import AdminStatusBadge from '@/components/admin/AdminStatusBadge';
import AdminRowActions from '@/components/admin/AdminRowActions';
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
import type { BlogPost } from '@/types';

const TAG_COLORS = [
  'bg-orange-50 text-orange-700 ring-orange-500/20',
  'bg-sky-50 text-sky-700 ring-sky-500/20',
  'bg-violet-50 text-violet-700 ring-violet-500/20',
  'bg-emerald-50 text-emerald-700 ring-emerald-500/20',
];

export default function AdminBlogPage() {
  const t = useTranslations('admin.pagination');
  const { token } = useAdminStore();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');

  const fetchPosts = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setFetchError(null);

    try {
      const res = await fetch('/api/blog?all=true', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const parsed = await parseJsonResponse<{ posts?: BlogPost[] }>(res);
      if (parsed.ok) {
        setPosts(Array.isArray(parsed.data?.posts) ? parsed.data.posts : []);
      } else {
        setPosts([]);
        setFetchError(parsed.error ?? 'Failed to load posts');
      }
    } catch {
      setPosts([]);
      setFetchError('Network error while loading posts');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => (p.tags ?? []).forEach((tag) => set.add(tag)));
    return Array.from(set).sort();
  }, [posts]);

  const filteredByMeta = useMemo(() => {
    return posts.filter((post) => {
      if (statusFilter === 'published' && !post.isPublished) return false;
      if (statusFilter === 'draft' && post.isPublished) return false;
      if (tagFilter !== 'all' && !(post.tags ?? []).includes(tagFilter)) return false;
      return true;
    });
  }, [posts, statusFilter, tagFilter]);

  const handleDelete = async () => {
    if (!deleteId || !token) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/blog/${deleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Post deleted');
        setDeleteId(null);
        fetchPosts();
      } else {
        toast.error('Failed to delete post');
      }
    } catch {
      toast.error('Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (post: BlogPost) => (
        <div>
          <p className="font-medium text-[#1E293B]">{post.title?.en ?? '—'}</p>
          <p className="text-xs text-[#64748B]">{post.slug}</p>
        </div>
      ),
    },
    {
      key: 'tags',
      header: 'Tags',
      render: (post: BlogPost) => (
        <div className="flex flex-wrap gap-1">
          {(post.tags ?? []).slice(0, 4).map((tag, i) => (
            <span
              key={tag}
              className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${TAG_COLORS[i % TAG_COLORS.length]}`}
            >
              {tag}
            </span>
          ))}
          {(post.tags ?? []).length === 0 && <span className="text-[#64748B]">—</span>}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (post: BlogPost) => (
        <AdminStatusBadge status={post.isPublished ? 'published' : 'draft'} />
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-28 text-right',
      render: (post: BlogPost) => (
        <AdminRowActions>
          <Button asChild size="icon" variant="ghost" className="h-8 w-8" aria-label="Edit post">
            <Link href={`/admin/blog/${post._id}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            aria-label="Delete post"
            onClick={() => setDeleteId(post._id)}
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
      <Select value={tagFilter} onValueChange={(v) => v && setTagFilter(v)}>
        <SelectTrigger className="h-10 w-[160px] rounded-lg bg-[#F8FAFC] text-sm">
          <SelectValue placeholder="Tag" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All tags</SelectItem>
          {allTags.map((tag) => (
            <SelectItem key={tag} value={tag}>
              {tag}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#64748B]">Manage blog articles and tags.</p>
        <Button asChild className="h-10 rounded-lg bg-[#F97316] px-4 font-semibold hover:bg-[#EA580C]">
          <Link href="/admin/blog/new">
            <Plus className="mr-2 h-4 w-4" /> New post
          </Link>
        </Button>
      </div>

      {fetchError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {fetchError}
          <Button variant="link" className="ml-2 h-auto p-0 text-red-700" onClick={fetchPosts}>
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
          filterItem={(post, q) =>
            matchAdminSearch(
              q,
              post.title?.en,
              post.title?.ru,
              post.title?.uz,
              post.slug,
              (post.tags ?? []).join(' ')
            )
          }
          emptyMessage="No blog posts yet"
          emptyDescription="Write your first story for travelers visiting Khiva."
          emptyAction={
            <Button asChild className="rounded-lg bg-[#F97316] hover:bg-[#EA580C]">
              <Link href="/admin/blog/new">Write your first post</Link>
            </Button>
          }
          initialPageSize={10}
          resetDeps={[statusFilter, tagFilter]}
          enableBulkSelect
          toolbarFilters={tableFilters}
          toolbarActions={
            <Button asChild size="sm" className="shrink-0 rounded-lg bg-[#F97316] hover:bg-[#EA580C]">
              <Link href="/admin/blog/new">
                <Plus className="mr-2 h-4 w-4" /> New post
              </Link>
            </Button>
          }
        />
      )}

      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete post?"
        description="This post will be permanently removed from the website."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}

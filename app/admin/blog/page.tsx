'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PaginatedDataTable from '@/components/admin/PaginatedDataTable';
import AdminLoading from '@/components/admin/AdminLoading';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { useAdminStore } from '@/hooks/useAdmin';
import { parseJsonResponse } from '@/hooks/useSafeFetch';
import { matchAdminSearch } from '@/lib/admin-search';
import type { BlogPost } from '@/types';

export default function AdminBlogPage() {
  const t = useTranslations('admin.pagination');
  const { token } = useAdminStore();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPosts = useCallback(async () => {
    if (!token) return;
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
          <p className="font-medium">{post.title?.en ?? '—'}</p>
          <p className="text-xs text-muted-foreground">{post.slug}</p>
        </div>
      ),
    },
    {
      key: 'tags',
      header: 'Tags',
      render: (post: BlogPost) => (
        <span className="text-sm text-muted-foreground">
          {(post.tags ?? []).slice(0, 3).join(', ') || '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (post: BlogPost) => (
        <Badge variant={post.isPublished ? 'default' : 'outline'}>
          {post.isPublished ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-24 text-right',
      render: (post: BlogPost) => (
        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <Button asChild size="icon" variant="ghost" aria-label="Edit post">
            <Link href={`/admin/blog/${post._id}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Delete post"
            onClick={() => setDeleteId(post._id)}
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
          <Button variant="link" className="ml-2 h-auto p-0" onClick={fetchPosts}>
            Retry
          </Button>
        </div>
      )}

      {loading ? (
        <AdminLoading />
      ) : (
        <PaginatedDataTable
          data={posts}
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
          emptyAction={
            <Button asChild size="sm" className="bg-brand-blue">
              <Link href="/admin/blog/new">Write your first post</Link>
            </Button>
          }
          initialPageSize={10}
          toolbarActions={
            <Button asChild size="sm" className="bg-brand-blue shrink-0">
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

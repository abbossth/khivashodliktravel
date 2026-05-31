'use client';

import { useEffect, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import BlogForm from '@/components/admin/BlogForm';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/hooks/useAdmin';
import { parseJsonResponse } from '@/hooks/useSafeFetch';
import type { BlogPost } from '@/types';

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const { token } = useAdminStore();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/blog/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const parsed = await parseJsonResponse<{ post?: BlogPost }>(res);
        if (cancelled) return;

        if (parsed.ok && parsed.data?.post) {
          setPost(parsed.data.post);
        } else {
          setError(parsed.error ?? 'Post not found');
        }
      } catch {
        if (!cancelled) setError('Failed to load post');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, params.id]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <AlertCircle className="h-10 w-10 text-muted-foreground" />
        <p className="text-muted-foreground">{error ?? 'Post not found'}</p>
        <Button asChild variant="outline">
          <Link href="/admin/blog">Back to blog</Link>
        </Button>
      </div>
    );
  }

  return <BlogForm post={post} />;
}

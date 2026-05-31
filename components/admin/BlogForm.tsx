'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AdminFormTabs, TabsContent } from './AdminFormTabs';
import ImageUploader from './ImageUploader';
import { useAdminStore } from '@/hooks/useAdmin';
import { parseJsonResponse } from '@/hooks/useSafeFetch';
import { generateSlug } from '@/lib/validations';
import type { BlogPost } from '@/types';

const emptyLocalized = { en: '', ru: '', uz: '' };

const BLOG_TABS = [
  { value: 'en', label: 'English', shortLabel: 'EN' },
  { value: 'ru', label: 'Russian', shortLabel: 'RU' },
  { value: 'uz', label: 'Uzbek', shortLabel: 'UZ' },
  { value: 'settings', label: 'Settings & media', shortLabel: 'Settings' },
];

const LOCALE_LABELS: Record<string, string> = {
  en: 'English',
  ru: 'Russian',
  uz: 'Uzbek',
};

interface BlogFormValues {
  title: { en: string; ru: string; uz: string };
  slug: string;
  content: { en: string; ru: string; uz: string };
  excerpt: { en: string; ru: string; uz: string };
  coverImage: string;
  tags: string[];
  isPublished: boolean;
}

interface BlogFormProps {
  post?: BlogPost;
}

export default function BlogForm({ post }: BlogFormProps) {
  const router = useRouter();
  const { token } = useAdminStore();
  const [submitting, setSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState(post?.coverImage || '');

  const { register, handleSubmit, watch, setValue } = useForm<BlogFormValues>({
    defaultValues: post
      ? {
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          coverImage: post.coverImage,
          tags: post.tags,
          isPublished: post.isPublished,
        }
      : {
          title: emptyLocalized,
          slug: '',
          content: emptyLocalized,
          excerpt: emptyLocalized,
          coverImage: '',
          tags: [],
          isPublished: false,
        },
  });

  const locales = ['en', 'ru', 'uz'] as const;

  const onSubmit = async (data: BlogFormValues) => {
    if (!token) {
      toast.error('Session expired. Please sign in again.');
      return;
    }
    if (!coverImage) {
      toast.error('Please upload or paste a cover image URL');
      return;
    }

    setSubmitting(true);
    const payload = { ...data, coverImage };

    try {
      const url = post ? `/api/blog/${post._id}` : '/api/blog';
      const method = post ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const parsed = await parseJsonResponse(res);
      if (!parsed.ok) {
        throw new Error(parsed.error ?? 'Failed to save');
      }

      toast.success(post ? 'Post updated' : 'Post created');
      router.push('/admin/blog');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-slate-50/80">
        <CardTitle className="text-xl text-brand-blue">
          {post ? 'Edit blog post' : 'Create blog post'}
        </CardTitle>
        <CardDescription>
          Write content in each language, then set the slug, tags, and cover image.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="pt-6">
          <AdminFormTabs tabs={BLOG_TABS} defaultValue="en">
            {locales.map((loc) => (
              <TabsContent key={loc} value={loc} className="space-y-4 mt-0">
                <h3 className="mb-4 border-b border-slate-100 pb-2 text-sm font-semibold uppercase tracking-wide text-brand-blue">
                  Content — {LOCALE_LABELS[loc]}
                </h3>
                <div>
                  <Label htmlFor={`title-${loc}`}>Title</Label>
                  <Input
                    id={`title-${loc}`}
                    {...register(`title.${loc}`)}
                    onChange={(e) => {
                      setValue(`title.${loc}`, e.target.value);
                      if (loc === 'en' && !post) {
                        setValue('slug', generateSlug(e.target.value));
                      }
                    }}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor={`excerpt-${loc}`}>Excerpt</Label>
                  <Textarea
                    id={`excerpt-${loc}`}
                    {...register(`excerpt.${loc}`)}
                    className="mt-1.5"
                    rows={2}
                    placeholder="Short summary for blog cards"
                  />
                </div>
                <div>
                  <Label htmlFor={`content-${loc}`}>Content (HTML)</Label>
                  <p className="mb-1.5 text-xs text-muted-foreground">
                    You can use simple HTML tags like &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;
                  </p>
                  <Textarea
                    id={`content-${loc}`}
                    {...register(`content.${loc}`)}
                    className="mt-0 font-mono text-sm"
                    rows={12}
                  />
                </div>
              </TabsContent>
            ))}

            <TabsContent value="settings" className="space-y-6 mt-0">
              <div>
                <h3 className="mb-4 border-b border-slate-100 pb-2 text-sm font-semibold uppercase tracking-wide text-brand-blue">
                  Post settings
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="slug">URL slug</Label>
                    <Input id="slug" {...register('slug')} className="mt-1.5" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="tags">Tags</Label>
                    <p className="mb-1.5 text-xs text-muted-foreground">Comma separated</p>
                    <Input
                      id="tags"
                      defaultValue={(post?.tags || []).join(', ')}
                      onChange={(e) =>
                        setValue(
                          'tags',
                          e.target.value
                            .split(',')
                            .map((t) => t.trim())
                            .filter(Boolean)
                        )
                      }
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                  <Switch
                    id="published"
                    checked={watch('isPublished')}
                    onCheckedChange={(v) => setValue('isPublished', v)}
                  />
                  <div>
                    <Label htmlFor="published" className="cursor-pointer">
                      Published
                    </Label>
                    <p className="text-xs text-muted-foreground">Visible on the blog</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 border-b border-slate-100 pb-2 text-sm font-semibold uppercase tracking-wide text-brand-blue">
                  Cover image
                </h3>
                <ImageUploader
                  images={coverImage ? [coverImage] : []}
                  onChange={(imgs) => setCoverImage(imgs[0] || '')}
                  coverImage={coverImage}
                  onCoverChange={setCoverImage}
                  folder="blog"
                  multiple={false}
                />
              </div>
            </TabsContent>
          </AdminFormTabs>
        </CardContent>

        <CardFooter className="flex gap-3 border-t border-slate-100 bg-slate-50/50">
          <Button type="submit" disabled={submitting} className="bg-brand-blue hover:bg-brand-blue/90">
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {post ? 'Save changes' : 'Create post'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

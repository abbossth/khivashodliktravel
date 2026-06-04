'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { Loader2, Globe, Settings } from 'lucide-react';
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
import { buildSlugFromTitle } from '@/lib/validations';
import { cn } from '@/lib/utils';
import type { BlogPost } from '@/types';

const emptyLocalized = { en: '', ru: '', uz: '' };

const BLOG_TABS = [
  {
    value: 'en',
    label: 'English',
    shortLabel: 'EN',
    icon: Globe,
    group: 'language' as const,
    hint: 'Post title, excerpt, and body in English. The page URL is created from this title when you save.',
  },
  {
    value: 'ru',
    label: 'Russian',
    shortLabel: 'RU',
    icon: Globe,
    group: 'language' as const,
    hint: 'Russian title, excerpt, and full article text.',
  },
  {
    value: 'uz',
    label: 'Uzbek',
    shortLabel: 'UZ',
    icon: Globe,
    group: 'language' as const,
    hint: 'Uzbek title, excerpt, and full article text.',
  },
  {
    value: 'settings',
    label: 'Settings & media',
    shortLabel: 'Settings',
    icon: Settings,
    group: 'meta' as const,
    hint: 'Tags, cover image, and publish toggle.',
  },
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

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { isDirty },
  } = useForm<BlogFormValues>({
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

  const titleValues = watch('title');
  const excerptValues = watch('excerpt');
  const tabComplete: Record<string, boolean> = {
    en: Boolean(titleValues?.en?.trim() && excerptValues?.en?.trim()),
    ru: Boolean(titleValues?.ru?.trim() && excerptValues?.ru?.trim()),
    uz: Boolean(titleValues?.uz?.trim() && excerptValues?.uz?.trim()),
    settings: Boolean(coverImage?.trim()),
  };

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
    const slug =
      buildSlugFromTitle(data.title.en, post?.slug ?? 'post') || post?.slug || 'post';
    const payload = { ...data, slug, coverImage };

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
          Write content in each language, then set tags and cover image. The URL path is created from the English title automatically.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="pt-6">
          <AdminFormTabs
            tabs={BLOG_TABS}
            defaultValue="en"
            dirty={isDirty}
            tabComplete={tabComplete}
            metaGroupLabel="Post settings"
          >
            {locales.map((loc) => (
              <TabsContent key={loc} value={loc} className="admin-form-section mt-0 space-y-4">
                <h3 className="admin-section-title">Content — {LOCALE_LABELS[loc]}</h3>
                <div>
                  <Label htmlFor={`title-${loc}`}>Title</Label>
                  <Input
                    id={`title-${loc}`}
                    {...register(`title.${loc}`)}
                    onChange={(e) => setValue(`title.${loc}`, e.target.value)}
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

            <TabsContent value="settings" className="admin-form-section mt-0 space-y-6">
              <div>
                <h3 className="admin-section-title">Post settings</h3>
                <div className="grid gap-4 sm:grid-cols-2">
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
                <Controller
                  name="isPublished"
                  control={control}
                  render={({ field }) => (
                    <label
                      htmlFor="blog-published"
                      className={cn(
                        'mt-4 flex cursor-pointer items-center gap-3 rounded-lg border bg-white p-4 shadow-sm transition-colors hover:border-[#F97316]/40',
                        field.value
                          ? 'border-[#F97316]/50 bg-orange-50/40'
                          : 'border-slate-200'
                      )}
                    >
                      <Switch
                        id="blog-published"
                        checked={Boolean(field.value)}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                      <div>
                        <span className="text-sm font-semibold text-[#1E293B]">
                          Published
                        </span>
                        <p className="text-xs text-[#64748B]">Visible on the blog</p>
                      </div>
                    </label>
                  )}
                />
              </div>

              <div>
                <h3 className="admin-section-title">Cover image</h3>
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

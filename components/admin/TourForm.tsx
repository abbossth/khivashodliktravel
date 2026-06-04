'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Loader2, Plus, Trash2, Globe, Receipt, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AdminFormTabs, TabsContent } from './AdminFormTabs';
import AdminSectionTitle from './AdminSectionTitle';
import AdminTagInput from './AdminTagInput';
import ImageUploader from './ImageUploader';
import { useAdminStore } from '@/hooks/useAdmin';
import { parseJsonResponse } from '@/hooks/useSafeFetch';
import { buildSlugFromTitle } from '@/lib/validations';
import { cn } from '@/lib/utils';
import type { Tour } from '@/types';
import { z } from 'zod';
import { tourSchema } from '@/lib/validations';

type TourFormValues = z.infer<typeof tourSchema>;

const emptyLocalized = { en: '', ru: '', uz: '' };
const emptyLocalizedArray = { en: [] as string[], ru: [] as string[], uz: [] as string[] };

const LANGUAGE_TABS = [
  {
    value: 'en',
    label: 'English',
    shortLabel: 'EN',
    icon: Globe,
    group: 'language' as const,
    hint: 'Main title and descriptions shown to most visitors. Slug is generated from the English title.',
  },
  {
    value: 'ru',
    label: 'Russian',
    shortLabel: 'RU',
    icon: Globe,
    group: 'language' as const,
    hint: 'Russian version of title, short text, full description, and bullet lists.',
  },
  {
    value: 'uz',
    label: 'Uzbek',
    shortLabel: 'UZ',
    icon: Globe,
    group: 'language' as const,
    hint: 'Uzbek version of all customer-facing text on the tour page.',
  },
  {
    value: 'shared',
    label: 'Details & pricing',
    shortLabel: 'Details',
    icon: Receipt,
    group: 'meta' as const,
    hint: 'Price, duration, category, itinerary days, and publish switches.',
  },
  {
    value: 'media',
    label: 'Photos',
    shortLabel: 'Photos',
    icon: ImageIcon,
    group: 'media' as const,
    hint: 'Upload gallery images and pick the cover photo shown on listings.',
  },
];

const LOCALE_LABELS: Record<string, string> = {
  en: 'English',
  ru: 'Russian',
  uz: 'Uzbek',
};

interface TourFormProps {
  tour?: Tour;
}

export default function TourForm({ tour }: TourFormProps) {
  const router = useRouter();
  const { token } = useAdminStore();
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>(tour?.images || []);
  const [coverImage, setCoverImage] = useState(tour?.coverImage || '');
  const [savingMedia, setSavingMedia] = useState(false);
  const imagesRef = useRef(images);
  const coverRef = useRef(coverImage);
  imagesRef.current = images;
  coverRef.current = coverImage;

  const resolveCover = useCallback((nextImages: string[], preferredCover?: string) => {
    const current = preferredCover ?? coverRef.current;
    if (current && nextImages.includes(current)) return current;
    return nextImages[0] ?? '';
  }, []);

  const saveTourMedia = useCallback(
    async (nextImages: string[], nextCover: string) => {
      setImages(nextImages);
      setCoverImage(nextCover);
      imagesRef.current = nextImages;
      coverRef.current = nextCover;

      if (!tour?._id || !token) return;

      setSavingMedia(true);
      try {
        const res = await fetch(`/api/tours/${tour._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ images: nextImages, coverImage: nextCover }),
        });
        const parsed = await parseJsonResponse(res);
        if (!parsed.ok) {
          throw new Error(parsed.error ?? 'Failed to save photos');
        }
        toast.success('Photo saved to this tour');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to save photo to tour');
      } finally {
        setSavingMedia(false);
      }
    },
    [tour?._id, token]
  );

  const handleImagesChange = useCallback(
    (nextImages: string[]) => {
      const nextCover = resolveCover(nextImages);
      void saveTourMedia(nextImages, nextCover);
    },
    [resolveCover, saveTourMedia]
  );

  const handleCoverChange = useCallback(
    (url: string) => {
      void saveTourMedia(imagesRef.current, url);
    },
    [saveTourMedia]
  );

  const defaultValues: TourFormValues = tour
    ? {
        title: tour.title,
        slug: tour.slug,
        description: tour.description,
        shortDescription: tour.shortDescription,
        images: tour.images,
        coverImage: tour.coverImage,
        price: tour.price,
        currency: tour.currency,
        duration: tour.duration,
        groupSize: tour.groupSize,
        category: tour.category,
        includes: tour.includes,
        excludes: tour.excludes,
        itinerary: tour.itinerary,
        highlights: tour.highlights,
        isPublished: tour.isPublished,
        isFeatured: tour.isFeatured,
      }
    : {
        title: emptyLocalized,
        slug: '',
        description: emptyLocalized,
        shortDescription: emptyLocalized,
        images: [],
        coverImage: '',
        price: 0,
        currency: 'USD',
        duration: '',
        groupSize: 10,
        category: 'daytrip',
        includes: emptyLocalizedArray,
        excludes: emptyLocalizedArray,
        itinerary: [],
        highlights: emptyLocalizedArray,
        isPublished: false,
        isFeatured: false,
      };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { isDirty },
  } = useForm<TourFormValues>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'itinerary' });

  const locales = ['en', 'ru', 'uz'] as const;

  const titleValues = watch('title');
  const shortValues = watch('shortDescription');
  const priceValue = watch('price');
  const durationValue = watch('duration');

  const tabComplete: Record<string, boolean> = {
    en: Boolean(titleValues?.en?.trim() && shortValues?.en?.trim()),
    ru: Boolean(titleValues?.ru?.trim() && shortValues?.ru?.trim()),
    uz: Boolean(titleValues?.uz?.trim() && shortValues?.uz?.trim()),
    shared: Boolean(durationValue?.trim() && Number(priceValue) > 0),
    media: Boolean(coverImage?.trim() || images.length > 0),
  };

  const onSubmit = async (data: TourFormValues) => {
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
      buildSlugFromTitle(data.title.en, tour?.slug ?? 'tour') || tour?.slug || 'tour';
    const payload = { ...data, slug, images, coverImage };

    try {
      const url = tour ? `/api/tours/${tour._id}` : '/api/tours';
      const method = tour ? 'PUT' : 'POST';

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

      toast.success(tour ? 'Tour updated' : 'Tour created');
      router.push('/admin/tours');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save tour');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="overflow-hidden rounded-xl border-slate-200/80 shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-white px-6 py-5">
        <CardTitle className="text-2xl font-bold text-[#1E293B]">
          {tour ? 'Edit tour' : 'Create tour'}
        </CardTitle>
        <CardDescription className="text-[#64748B]">
          Add content in each language, then set pricing, itinerary, and photos. The page URL is built from the English title automatically.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="px-6 pt-2">
          <AdminFormTabs
            tabs={LANGUAGE_TABS}
            defaultValue="en"
            dirty={isDirty}
            tabComplete={tabComplete}
            metaGroupLabel="Tour setup"
          >
            {locales.map((loc) => (
              <TabsContent key={loc} value={loc} className="admin-form-section mt-0 space-y-6">
                <AdminSectionTitle>Content — {LOCALE_LABELS[loc]}</AdminSectionTitle>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Label htmlFor={`title-${loc}`}>Title</Label>
                    <Input
                      id={`title-${loc}`}
                      {...register(`title.${loc}`)}
                      onChange={(e) => setValue(`title.${loc}`, e.target.value)}
                      className="admin-input mt-1.5"
                      placeholder="Tour title"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor={`short-${loc}`}>Short description</Label>
                    <Textarea
                      id={`short-${loc}`}
                      {...register(`shortDescription.${loc}`)}
                      className="admin-textarea mt-1.5 min-h-[80px]"
                      rows={2}
                      placeholder="Shown on tour cards"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor={`desc-${loc}`}>Full description</Label>
                    <Textarea
                      id={`desc-${loc}`}
                      {...register(`description.${loc}`)}
                      className="admin-textarea mt-1.5"
                      rows={5}
                      placeholder="Detailed overview for the tour page"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label>Highlights</Label>
                    <p className="mb-1.5 text-xs text-[#64748B]">Press Enter to add each item</p>
                    <AdminTagInput
                      value={watch(`highlights.${loc}`) || []}
                      onChange={(tags) => setValue(`highlights.${loc}`, tags, { shouldDirty: true })}
                      placeholder="Add highlight…"
                    />
                  </div>
                  <div>
                    <Label>Includes</Label>
                    <p className="mb-1.5 text-xs text-[#64748B]">Press Enter to add each item</p>
                    <AdminTagInput
                      value={watch(`includes.${loc}`) || []}
                      onChange={(tags) => setValue(`includes.${loc}`, tags, { shouldDirty: true })}
                      placeholder="Add include…"
                    />
                  </div>
                  <div>
                    <Label>Excludes</Label>
                    <p className="mb-1.5 text-xs text-[#64748B]">Press Enter to add each item</p>
                    <AdminTagInput
                      value={watch(`excludes.${loc}`) || []}
                      onChange={(tags) => setValue(`excludes.${loc}`, tags, { shouldDirty: true })}
                      placeholder="Add exclude…"
                    />
                  </div>
                </div>
              </TabsContent>
            ))}

            <TabsContent value="shared" className="mt-0 space-y-8">
              <div className="admin-form-section">
                <AdminSectionTitle>Pricing & logistics</AdminSectionTitle>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <Label>Category</Label>
                    <Select
                      defaultValue={watch('category')}
                      onValueChange={(v) =>
                        v && setValue('category', v as TourFormValues['category'])
                      }
                    >
                      <SelectTrigger className="admin-input mt-1.5 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['daytrip', 'multiday', 'shared', 'private', 'transfer'].map(
                          (cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      min={0}
                      {...register('price', { valueAsNumber: true })}
                      className="admin-input mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Currency</Label>
                    <Select
                      defaultValue={watch('currency')}
                      onValueChange={(v) => v && setValue('currency', v as 'USD' | 'UZS')}
                    >
                      <SelectTrigger className="admin-input mt-1.5 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="UZS">UZS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      {...register('duration')}
                      placeholder="3 days / 2 nights"
                      className="admin-input mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="groupSize">Group size (max)</Label>
                    <Input
                      id="groupSize"
                      type="number"
                      min={1}
                      {...register('groupSize', { valueAsNumber: true })}
                      className="admin-input mt-1.5"
                    />
                  </div>
                </div>
              </div>

              <div className="admin-form-section">
                <AdminSectionTitle>Visibility</AdminSectionTitle>
                <div className="flex flex-wrap gap-6">
                  <Controller
                    name="isPublished"
                    control={control}
                    render={({ field }) => (
                      <label
                        htmlFor="tour-published"
                        className={cn(
                          'flex min-w-[200px] flex-1 cursor-pointer items-center gap-3 rounded-lg border bg-white p-4 shadow-sm transition-colors hover:border-[#F97316]/40',
                          field.value
                            ? 'border-[#F97316]/50 bg-orange-50/40'
                            : 'border-slate-200'
                        )}
                      >
                        <Switch
                          id="tour-published"
                          checked={Boolean(field.value)}
                          onCheckedChange={(checked) =>
                            field.onChange(checked)
                          }
                        />
                        <div>
                          <span className="text-sm font-semibold text-[#1E293B]">
                            Published
                          </span>
                          <p className="text-xs text-[#64748B]">Visible on the website</p>
                        </div>
                      </label>
                    )}
                  />
                  <Controller
                    name="isFeatured"
                    control={control}
                    render={({ field }) => (
                      <label
                        htmlFor="tour-featured"
                        className={cn(
                          'flex min-w-[200px] flex-1 cursor-pointer items-center gap-3 rounded-lg border bg-white p-4 shadow-sm transition-colors hover:border-[#F97316]/40',
                          field.value
                            ? 'border-[#F97316]/50 bg-orange-50/40'
                            : 'border-slate-200'
                        )}
                      >
                        <Switch
                          id="tour-featured"
                          checked={Boolean(field.value)}
                          onCheckedChange={(checked) =>
                            field.onChange(checked)
                          }
                        />
                        <div>
                          <span className="text-sm font-semibold text-[#1E293B]">
                            Featured
                          </span>
                          <p className="text-xs text-[#64748B]">Show on homepage</p>
                        </div>
                      </label>
                    )}
                  />
                </div>
              </div>

              <div className="admin-form-section">
                <div className="mb-4 flex items-center justify-between">
                  <AdminSectionTitle>Itinerary</AdminSectionTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({
                        day: fields.length + 1,
                        title: emptyLocalized,
                        description: emptyLocalized,
                      })
                    }
                  >
                    <Plus className="mr-1 h-4 w-4" /> Add day
                  </Button>
                </div>
                {fields.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-sm text-muted-foreground">
                    No itinerary days yet. Click &quot;Add day&quot; for multi-day tours.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="rounded-lg border border-slate-200 bg-slate-50/30 p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <span className="font-semibold text-brand-blue">
                            Day {index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <input
                          type="hidden"
                          {...register(`itinerary.${index}.day` as const)}
                          value={index + 1}
                        />
                        {locales.map((loc) => (
                          <div key={loc} className="mb-3 last:mb-0">
                            <p className="mb-1 text-xs font-medium text-muted-foreground">
                              {LOCALE_LABELS[loc]}
                            </p>
                            <Input
                              placeholder="Day title"
                              {...register(`itinerary.${index}.title.${loc}`)}
                              className="mb-2"
                            />
                            <Textarea
                              placeholder="Day description"
                              {...register(`itinerary.${index}.description.${loc}`)}
                              rows={2}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="media" className="admin-form-section mt-0">
              <AdminSectionTitle>Photos</AdminSectionTitle>
              <p className="mb-4 text-sm text-[#64748B]">
                {tour
                  ? 'Upload or add a URL — each photo is saved to this tour automatically. Pick a cover with Set cover.'
                  : 'Upload images or paste URLs. Save the tour once to enable auto-save on later edits.'}
              </p>
              {savingMedia && (
                <p className="mb-3 flex items-center gap-2 text-sm text-[#0EA5E9]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving photos to tour…
                </p>
              )}
              <ImageUploader
                images={images}
                onChange={handleImagesChange}
                coverImage={coverImage}
                onCoverChange={handleCoverChange}
                folder="tours"
                disabled={savingMedia}
              />
            </TabsContent>
          </AdminFormTabs>
        </CardContent>

        <CardFooter className="sticky bottom-0 z-20 flex gap-3 border-t border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-md">
          <Button
            type="submit"
            disabled={submitting}
            className="h-11 flex-1 rounded-lg bg-[#F97316] text-base font-semibold hover:bg-[#EA580C] sm:flex-none sm:px-8"
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {tour ? 'Save changes' : 'Create tour'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-lg"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

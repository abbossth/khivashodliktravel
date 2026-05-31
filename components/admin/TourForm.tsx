'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { Loader2, Plus, Trash2 } from 'lucide-react';
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
import ImageUploader from './ImageUploader';
import { useAdminStore } from '@/hooks/useAdmin';
import { parseJsonResponse } from '@/hooks/useSafeFetch';
import { generateSlug } from '@/lib/validations';
import type { Tour } from '@/types';
import { z } from 'zod';
import { tourSchema } from '@/lib/validations';

type TourFormValues = z.infer<typeof tourSchema>;

const emptyLocalized = { en: '', ru: '', uz: '' };
const emptyLocalizedArray = { en: [] as string[], ru: [] as string[], uz: [] as string[] };

const LANGUAGE_TABS = [
  { value: 'en', label: 'English', shortLabel: 'EN' },
  { value: 'ru', label: 'Russian', shortLabel: 'RU' },
  { value: 'uz', label: 'Uzbek', shortLabel: 'UZ' },
  { value: 'shared', label: 'Details & pricing', shortLabel: 'Details' },
  { value: 'media', label: 'Photos', shortLabel: 'Photos' },
];

const LOCALE_LABELS: Record<string, string> = {
  en: 'English',
  ru: 'Russian',
  uz: 'Uzbek',
};

interface TourFormProps {
  tour?: Tour;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 border-b border-slate-100 pb-2 text-sm font-semibold uppercase tracking-wide text-brand-blue">
      {children}
    </h3>
  );
}

export default function TourForm({ tour }: TourFormProps) {
  const router = useRouter();
  const { token } = useAdminStore();
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>(tour?.images || []);
  const [coverImage, setCoverImage] = useState(tour?.coverImage || '');

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

  const { register, handleSubmit, watch, setValue, control } = useForm<TourFormValues>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'itinerary' });

  const locales = ['en', 'ru', 'uz'] as const;

  const handleTitleEnChange = (value: string) => {
    setValue('title.en', value);
    if (!tour) {
      setValue('slug', generateSlug(value));
    }
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
    const payload = { ...data, images, coverImage };

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
    <Card className="overflow-hidden border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-slate-50/80">
        <CardTitle className="text-xl text-brand-blue">
          {tour ? 'Edit tour' : 'Create tour'}
        </CardTitle>
        <CardDescription>
          Add content in each language, then set pricing, itinerary, and photos.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="pt-6">
          <AdminFormTabs tabs={LANGUAGE_TABS} defaultValue="en">
            {locales.map((loc) => (
              <TabsContent key={loc} value={loc} className="space-y-6 mt-0">
                <SectionTitle>Content — {LOCALE_LABELS[loc]}</SectionTitle>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Label htmlFor={`title-${loc}`}>Title</Label>
                    <Input
                      id={`title-${loc}`}
                      {...register(`title.${loc}`)}
                      onChange={(e) => {
                        if (loc === 'en') handleTitleEnChange(e.target.value);
                        else setValue(`title.${loc}`, e.target.value);
                      }}
                      className="mt-1.5"
                      placeholder="Tour title"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor={`short-${loc}`}>Short description</Label>
                    <Textarea
                      id={`short-${loc}`}
                      {...register(`shortDescription.${loc}`)}
                      className="mt-1.5"
                      rows={2}
                      placeholder="Shown on tour cards"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor={`desc-${loc}`}>Full description</Label>
                    <Textarea
                      id={`desc-${loc}`}
                      {...register(`description.${loc}`)}
                      className="mt-1.5"
                      rows={5}
                      placeholder="Detailed overview for the tour page"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor={`highlights-${loc}`}>Highlights</Label>
                    <p className="mb-1.5 text-xs text-muted-foreground">One per line</p>
                    <Textarea
                      id={`highlights-${loc}`}
                      className="mt-0"
                      rows={4}
                      defaultValue={(watch(`highlights.${loc}`) || []).join('\n')}
                      onChange={(e) =>
                        setValue(
                          `highlights.${loc}`,
                          e.target.value.split('\n').filter(Boolean)
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`includes-${loc}`}>Includes</Label>
                    <p className="mb-1.5 text-xs text-muted-foreground">One per line</p>
                    <Textarea
                      id={`includes-${loc}`}
                      rows={4}
                      defaultValue={(watch(`includes.${loc}`) || []).join('\n')}
                      onChange={(e) =>
                        setValue(
                          `includes.${loc}`,
                          e.target.value.split('\n').filter(Boolean)
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`excludes-${loc}`}>Excludes</Label>
                    <p className="mb-1.5 text-xs text-muted-foreground">One per line</p>
                    <Textarea
                      id={`excludes-${loc}`}
                      rows={4}
                      defaultValue={(watch(`excludes.${loc}`) || []).join('\n')}
                      onChange={(e) =>
                        setValue(
                          `excludes.${loc}`,
                          e.target.value.split('\n').filter(Boolean)
                        )
                      }
                    />
                  </div>
                </div>
              </TabsContent>
            ))}

            <TabsContent value="shared" className="space-y-8 mt-0">
              <div>
                <SectionTitle>Pricing & logistics</SectionTitle>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="sm:col-span-2 lg:col-span-3">
                    <Label htmlFor="slug">URL slug</Label>
                    <Input
                      id="slug"
                      {...register('slug')}
                      className="mt-1.5"
                      placeholder="khiva-old-city-tour"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select
                      defaultValue={watch('category')}
                      onValueChange={(v) =>
                        v && setValue('category', v as TourFormValues['category'])
                      }
                    >
                      <SelectTrigger className="mt-1.5">
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
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Currency</Label>
                    <Select
                      defaultValue={watch('currency')}
                      onValueChange={(v) => v && setValue('currency', v as 'USD' | 'UZS')}
                    >
                      <SelectTrigger className="mt-1.5">
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
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="groupSize">Group size (max)</Label>
                    <Input
                      id="groupSize"
                      type="number"
                      min={1}
                      {...register('groupSize', { valueAsNumber: true })}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </div>

              <div>
                <SectionTitle>Visibility</SectionTitle>
                <div className="flex flex-wrap gap-8 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      id="published"
                      checked={watch('isPublished')}
                      onCheckedChange={(v) => setValue('isPublished', v)}
                    />
                    <div>
                      <Label htmlFor="published" className="cursor-pointer">
                        Published
                      </Label>
                      <p className="text-xs text-muted-foreground">Visible on the website</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      id="featured"
                      checked={watch('isFeatured')}
                      onCheckedChange={(v) => setValue('isFeatured', v)}
                    />
                    <div>
                      <Label htmlFor="featured" className="cursor-pointer">
                        Featured
                      </Label>
                      <p className="text-xs text-muted-foreground">Show on homepage</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <SectionTitle>Itinerary</SectionTitle>
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

            <TabsContent value="media" className="mt-0">
              <SectionTitle>Photos</SectionTitle>
              <p className="mb-4 text-sm text-muted-foreground">
                Upload images or paste URLs (/images/... or https://). Select one as the cover.
              </p>
              <ImageUploader
                images={images}
                onChange={setImages}
                coverImage={coverImage}
                onCoverChange={setCoverImage}
                folder="tours"
              />
            </TabsContent>
          </AdminFormTabs>
        </CardContent>

        <CardFooter className="flex gap-3 border-t border-slate-100 bg-slate-50/50">
          <Button type="submit" disabled={submitting} className="bg-brand-blue hover:bg-brand-blue/90">
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {tour ? 'Save changes' : 'Create tour'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

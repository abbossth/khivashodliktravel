'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2, Link2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useAdminStore } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { isValidImageUrl, normalizeImageUrl } from '@/lib/image-url';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  coverImage?: string;
  onCoverChange?: (url: string) => void;
  folder?: string;
  multiple?: boolean;
}

export default function ImageUploader({
  images,
  onChange,
  coverImage,
  onCoverChange,
  folder = 'tours',
  multiple = true,
}: ImageUploaderProps) {
  const t = useTranslations('admin.imageUploader');
  const { token } = useAdminStore();
  const [uploading, setUploading] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');

  useEffect(() => {
    if (!multiple) {
      setUrlDraft(images[0] ?? '');
    }
  }, [multiple, images]);

  const uploadFile = useCallback(
    async (file: File): Promise<string> => {
      if (!token) throw new Error('Not authenticated');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      let data: { url?: string; error?: string } | null = null;
      try {
        data = await res.json();
      } catch {
        /* invalid JSON */
      }

      if (!res.ok || !data?.url) {
        throw new Error(data?.error ?? 'Upload failed');
      }
      return data.url;
    },
    [token, folder]
  );

  const applyImageUrl = useCallback(
    (rawUrl: string) => {
      const url = normalizeImageUrl(rawUrl);
      if (!url) {
        toast.error(t('urlRequired'));
        return false;
      }
      if (!isValidImageUrl(url)) {
        toast.error(t('urlInvalid'));
        return false;
      }

      if (multiple) {
        if (images.includes(url)) {
          toast.error(t('urlDuplicate'));
          return false;
        }
        onChange([...images, url]);
        if (onCoverChange && !coverImage) {
          onCoverChange(url);
        }
        setUrlDraft('');
      } else {
        onChange([url]);
        onCoverChange?.(url);
        setUrlDraft(url);
      }

      toast.success(t('urlAdded'));
      return true;
    },
    [multiple, images, onChange, onCoverChange, coverImage, t]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!token) {
        toast.error(t('signInRequired'));
        return;
      }
      setUploading(true);

      try {
        const urls = await Promise.all(acceptedFiles.map(uploadFile));
        const newImages = multiple ? [...images, ...urls] : urls;
        onChange(newImages);
        const lastUrl = urls[urls.length - 1];
        if (lastUrl) {
          setUrlDraft(lastUrl);
        }
        if (onCoverChange && !coverImage && urls[0]) {
          onCoverChange(urls[0]);
        }
        toast.success(
          urls.length > 1 ? t('uploadedMany', { count: urls.length }) : t('uploadedOne')
        );
      } catch {
        toast.error(t('uploadFailed'));
      } finally {
        setUploading(false);
      }
    },
    [
      token,
      images,
      onChange,
      onCoverChange,
      coverImage,
      multiple,
      uploadFile,
      t,
    ]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple,
  });

  const removeImage = (index: number) => {
    const removed = images[index];
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
    if (coverImage === removed && onCoverChange) {
      onCoverChange(newImages[0] || '');
    }
    if (!multiple) {
      setUrlDraft(newImages[0] ?? '');
    } else if (urlDraft === removed) {
      setUrlDraft('');
    }
  };

  const handleUrlSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    applyImageUrl(urlDraft);
  };

  const selectImageForUrlField = (url: string) => {
    setUrlDraft(url);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
          isDragActive
            ? 'border-brand-orange bg-orange-50'
            : 'border-gray-300 hover:border-brand-blue'
        )}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
        ) : (
          <>
            <Upload className="mb-2 h-8 w-8 text-gray-400" />
            <p className="text-sm font-medium text-foreground">{t('dropTitle')}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t('dropHint')}</p>
          </>
        )}
      </div>

      <form onSubmit={handleUrlSubmit} className="space-y-2 rounded-lg border border-border/80 bg-slate-50/80 p-4">
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 shrink-0 text-brand-blue" aria-hidden />
          <Label htmlFor="image-url-input" className="text-sm font-medium text-brand-blue">
            {t('urlLabel')}
          </Label>
        </div>
        <p className="text-xs text-muted-foreground">{t('urlHint')}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            id="image-url-input"
            type="url"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder={t('urlPlaceholder')}
            className="min-h-10 flex-1 bg-white font-mono text-xs sm:text-sm"
            disabled={uploading}
          />
          <Button
            type="submit"
            variant="secondary"
            className="shrink-0 border-brand-blue/20 sm:w-auto"
            disabled={uploading || !urlDraft.trim()}
          >
            {multiple ? t('addUrl') : t('applyUrl')}
          </Button>
        </div>
        {urlDraft.trim() && isValidImageUrl(urlDraft) && (
          <p className="text-xs text-emerald-700">{t('urlValid')}</p>
        )}
      </form>

      {images.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {multiple ? t('gallery', { count: images.length }) : t('preview')}
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {images.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className={cn(
                  'group relative overflow-hidden rounded-lg border-2 transition-colors',
                  coverImage === url ? 'border-brand-orange' : 'border-transparent'
                )}
              >
                <button
                  type="button"
                  className="relative aspect-square w-full cursor-pointer"
                  onClick={() => selectImageForUrlField(url)}
                  title={t('clickToShowUrl')}
                >
                  <Image src={url} alt="" fill className="object-cover" sizes="150px" />
                </button>
                {onCoverChange && (
                  <Button
                    type="button"
                    size="sm"
                    variant={coverImage === url ? 'default' : 'secondary'}
                    className="absolute bottom-1 left-1 z-10 h-6 text-xs"
                    onClick={() => onCoverChange(url)}
                  >
                    {coverImage === url ? t('cover') : t('setCover')}
                  </Button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute right-1 top-1 z-10 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label={t('remove')}
                >
                  <X className="h-3 w-3" />
                </button>
                <p
                  className="truncate border-t border-border/50 bg-white/95 px-2 py-1 font-mono text-[10px] text-muted-foreground"
                  title={url}
                >
                  {url}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

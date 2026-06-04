'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2, Link2, Copy, Check, Crown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useAdminStore } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { isValidImageUrl, normalizeImageUrl } from '@/lib/image-url';
import { uploadImageToFirebaseStorage } from '@/lib/upload-client';
import { MAX_IMAGE_UPLOAD_MB, validateImageUploadSize } from '@/lib/upload-limits';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  coverImage?: string;
  onCoverChange?: (url: string) => void;
  folder?: string;
  multiple?: boolean;
  disabled?: boolean;
}

export default function ImageUploader({
  images,
  onChange,
  coverImage,
  onCoverChange,
  folder = 'tours',
  multiple = true,
  disabled = false,
}: ImageUploaderProps) {
  const t = useTranslations('admin.imageUploader');
  const { token, user } = useAdminStore();
  const [uploading, setUploading] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!multiple && images[0] && !urlDraft) {
      setUrlDraft(images[0]);
    }
  }, [multiple, images, urlDraft]);

  const uploadViaApi = useCallback(
    async (file: File): Promise<string> => {
      if (!token) throw new Error(t('signInRequired'));

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
      if (!res.ok || !data?.url) {
        throw new Error(data?.error ?? t('uploadFailed'));
      }
      return data.url;
    },
    [token, folder, t]
  );

  const uploadFile = useCallback(
    async (file: File): Promise<string> => {
      if (!token || !user) {
        throw new Error(t('signInRequired'));
      }
      try {
        return await uploadImageToFirebaseStorage(file, folder);
      } catch (clientErr) {
        const msg = clientErr instanceof Error ? clientErr.message : '';
        if (msg.includes('ruxsat') || msg.includes('Storage')) {
          return uploadViaApi(file);
        }
        throw clientErr;
      }
    },
    [token, user, folder, t, uploadViaApi]
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
        setUrlDraft(url);
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
      if (!token || !user) {
        toast.error(t('signInRequired'));
        return;
      }
      if (acceptedFiles.length === 0) return;

      const tooLarge = acceptedFiles.filter((f) => !validateImageUploadSize(f).ok);
      const allowed = acceptedFiles.filter((f) => validateImageUploadSize(f).ok);

      if (tooLarge.length > 0) {
        toast.error(
          tooLarge.length === 1
            ? t('fileTooLarge', { maxMb: MAX_IMAGE_UPLOAD_MB })
            : t('filesTooLarge', { count: tooLarge.length, maxMb: MAX_IMAGE_UPLOAD_MB })
        );
      }

      if (allowed.length === 0) return;

      setUploading(true);
      const uploadedUrls: string[] = [];
      let workingImages = [...images];

      try {
        for (const file of allowed) {
          const url = await uploadFile(file);
          uploadedUrls.push(url);
          setUrlDraft(url);

          if (multiple) {
            if (!workingImages.includes(url)) {
              workingImages = [...workingImages, url];
              onChange(workingImages);
            }
          } else {
            workingImages = [url];
            onChange(workingImages);
            onCoverChange?.(url);
          }
        }

        const firstNew = uploadedUrls[0];
        if (onCoverChange && !coverImage && firstNew) {
          onCoverChange(firstNew);
        }

        toast.success(
          uploadedUrls.length > 1
            ? t('uploadedMany', { count: uploadedUrls.length })
            : t('uploadedOne')
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : t('uploadFailed');
        toast.error(message);
        if (uploadedUrls.length > 0) {
          toast.message(t('uploadPartial', { count: uploadedUrls.length }));
        }
      } finally {
        setUploading(false);
      }
    },
    [token, user, images, onChange, onCoverChange, coverImage, multiple, uploadFile, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] },
    multiple,
    maxSize: MAX_IMAGE_UPLOAD_MB * 1024 * 1024,
    disabled: uploading || disabled,
    onDropRejected: (rejections) => {
      const tooBig = rejections.some((r) =>
        r.errors.some((e) => e.code === 'file-too-large')
      );
      if (tooBig) {
        toast.error(t('fileTooLarge', { maxMb: MAX_IMAGE_UPLOAD_MB }));
      }
    },
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
      setUrlDraft(newImages[newImages.length - 1] ?? '');
    }
  };

  const handleUrlSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    applyImageUrl(urlDraft);
  };

  const copyUrl = async () => {
    if (!urlDraft.trim()) return;
    try {
      await navigator.clipboard.writeText(urlDraft.trim());
      setCopied(true);
      toast.success(t('urlCopied'));
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t('urlCopyFailed'));
    }
  };

  const normalizedDraft = urlDraft.trim() ? normalizeImageUrl(urlDraft) : '';
  const draftLooksValid = Boolean(normalizedDraft && isValidImageUrl(normalizedDraft));
  const draftInGallery = Boolean(normalizedDraft && images.includes(normalizedDraft));
  const showAddUrlButton = draftLooksValid && !draftInGallery;

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-10 transition-all',
          (uploading || disabled) && 'pointer-events-none opacity-70',
          isDragActive
            ? 'border-[#F97316] bg-sky-50/80'
            : 'hover:border-[#0EA5E9] hover:bg-sky-50/50'
        )}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
            <p className="mt-2 text-sm font-medium text-foreground">{t('uploading')}</p>
            {urlDraft && (
              <p className="mt-1 max-w-full truncate px-4 font-mono text-xs text-muted-foreground">
                {urlDraft}
              </p>
            )}
          </>
        ) : (
          <>
            <Upload className="mb-2 h-8 w-8 text-gray-400" />
            <p className="text-sm font-medium text-foreground">{t('dropTitle')}</p>
            <p className="mt-1 text-center text-xs text-muted-foreground">
              {t('dropHint', { maxMb: MAX_IMAGE_UPLOAD_MB })}
            </p>
            <p className="mt-2 text-center text-xs text-brand-blue/80">{t('dropFirebase')}</p>
          </>
        )}
      </div>

      {images.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {multiple ? t('gallery', { count: images.length }) : t('preview')}
          </p>
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {images.map((url, index) => {
              const isCover = coverImage === url;
              return (
                <div
                  key={`${url}-${index}`}
                  className={cn(
                    'group relative mb-4 break-inside-avoid overflow-hidden rounded-xl bg-white shadow-sm ring-2 transition-all',
                    isCover ? 'ring-[#F97316] ring-offset-2' : 'ring-transparent hover:ring-slate-200'
                  )}
                >
                  <div className="relative aspect-[4/3] w-full">
                    <button
                      type="button"
                      className="relative h-full w-full cursor-pointer"
                      onClick={() => setUrlDraft(url)}
                      title={t('clickToShowUrl')}
                    >
                      <Image src={url} alt="" fill className="object-cover" sizes="280px" />
                    </button>
                    {isCover && (
                      <span className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full bg-[#F97316] px-2 py-0.5 text-[10px] font-bold text-white shadow">
                        <Crown className="h-3 w-3" />
                        {t('cover')}
                      </span>
                    )}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#0F172A]/60 opacity-0 transition-opacity group-hover:opacity-100">
                      {onCoverChange && !isCover && (
                        <Button
                          type="button"
                          size="sm"
                          className="h-8 rounded-lg bg-white text-xs text-[#1E293B] hover:bg-slate-100"
                          onClick={() => onCoverChange(url)}
                        >
                          {t('setCover')}
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="h-8 rounded-lg text-xs"
                        onClick={() => removeImage(index)}
                      >
                        {t('remove')}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <form
        onSubmit={handleUrlSubmit}
        className="space-y-2 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-[#0EA5E9]">
            <Link2 className="h-4 w-4" aria-hidden />
          </span>
          <Label htmlFor="image-url-input" className="text-sm font-semibold text-[#1E293B]">
            {draftInGallery ? t('urlLabelCopy') : t('urlLabel')}
          </Label>
        </div>
        <p className="text-xs text-muted-foreground">
          {draftInGallery ? t('urlHintInGallery') : t('urlHint')}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Input
              id="image-url-input"
              type="text"
              inputMode="url"
              autoComplete="off"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              placeholder={uploading ? t('urlPlaceholderUploading') : t('urlPlaceholder')}
              className="admin-input min-h-10 w-full pr-10 font-mono text-xs sm:text-sm"
              disabled={uploading}
            />
            {urlDraft.trim() && !uploading && (
              <button
                type="button"
                onClick={copyUrl}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-slate-100 hover:text-foreground"
                title={t('copyUrl')}
                aria-label={t('copyUrl')}
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            )}
          </div>
          {showAddUrlButton && (
            <Button
              type="submit"
              variant="secondary"
              className="shrink-0 border-brand-blue/20 sm:w-auto"
              disabled={uploading}
            >
              {multiple ? t('addUrl') : t('applyUrl')}
            </Button>
          )}
        </div>
        {uploading && <p className="text-xs text-brand-blue">{t('urlFilling')}</p>}
        {!uploading && draftInGallery && (
          <p className="text-xs text-emerald-700">{t('urlAlreadyInGallery')}</p>
        )}
        {!uploading && draftLooksValid && !draftInGallery && (
          <p className="text-xs text-muted-foreground">{t('urlPressAdd')}</p>
        )}
      </form>
    </div>
  );
}

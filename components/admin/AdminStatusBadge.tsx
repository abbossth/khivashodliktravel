import { cn } from '@/lib/utils';

type Status = 'published' | 'draft' | 'pending' | 'confirmed' | 'cancelled' | 'new';

const STYLES: Record<Status, string> = {
  published: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  draft: 'bg-slate-100 text-slate-600 ring-slate-500/15',
  pending: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  confirmed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  cancelled: 'bg-red-50 text-red-700 ring-red-600/20',
  new: 'bg-sky-50 text-sky-700 ring-sky-500/20',
};

export default function AdminStatusBadge({
  status,
  label,
  className,
}: {
  status: Status;
  label?: string;
  className?: string;
}) {
  const text =
    label ??
    (status === 'published'
      ? 'Published'
      : status === 'draft'
        ? 'Draft'
        : status.charAt(0).toUpperCase() + status.slice(1));

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
        STYLES[status],
        className
      )}
    >
      {text}
    </span>
  );
}

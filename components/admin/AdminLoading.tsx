import AdminTableSkeleton from '@/components/admin/AdminTableSkeleton';
import { cn } from '@/lib/utils';

export default function AdminLoading({
  className,
  variant = 'table',
}: {
  className?: string;
  variant?: 'table' | 'cards';
}) {
  if (variant === 'cards') {
    return (
      <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="admin-stat-card animate-pulse">
            <div className="mb-3 h-4 w-24 rounded bg-slate-100" />
            <div className="h-8 w-16 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      <AdminTableSkeleton />
    </div>
  );
}

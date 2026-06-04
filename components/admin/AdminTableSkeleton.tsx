import { cn } from '@/lib/utils';

export default function AdminTableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-4">
        <div className="h-9 max-w-md animate-pulse rounded-lg bg-slate-100" />
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4">
            <div className="h-4 w-4 shrink-0 animate-pulse rounded bg-slate-100" />
            {Array.from({ length: cols }).map((_, j) => (
              <div
                key={j}
                className={cn(
                  'h-4 animate-pulse rounded bg-slate-100',
                  j === 0 ? 'h-12 w-12 shrink-0 rounded-lg' : 'flex-1'
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

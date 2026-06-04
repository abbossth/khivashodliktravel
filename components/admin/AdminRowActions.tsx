'use client';

import { cn } from '@/lib/utils';

export default function AdminRowActions({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'admin-row-actions flex items-center justify-end gap-0.5 rounded-lg bg-white/90 p-0.5 shadow-sm ring-1 ring-slate-200/80 backdrop-blur-sm',
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

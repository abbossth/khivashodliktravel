import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLoading({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-16', className)}>
      <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      <p className="text-sm text-muted-foreground">Loading…</p>
    </div>
  );
}

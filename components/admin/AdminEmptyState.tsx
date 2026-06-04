import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminEmptyState({
  title,
  description,
  action,
  icon: Icon = Inbox,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-[#64748B]">
        <Icon className="h-7 w-7" />
      </div>
      <p className="text-base font-semibold text-[#1E293B]">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-[#64748B]">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

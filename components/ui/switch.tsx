'use client';

import { Switch as SwitchPrimitive } from '@base-ui/react/switch';
import { cn } from '@/lib/utils';

function Switch({
  className,
  size = 'default',
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: 'sm' | 'default';
}) {
  const isSm = size === 'sm';

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        'group/switch relative inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 transition-all outline-none',
        'border-slate-300 bg-slate-200',
        'data-[checked]:border-[#F97316] data-[checked]:bg-[#F97316]',
        'data-[unchecked]:border-slate-300 data-[unchecked]:bg-slate-200',
        'focus-visible:ring-2 focus-visible:ring-[#F97316]/40 focus-visible:ring-offset-2',
        'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        isSm ? 'h-5 w-9' : 'h-6 w-11',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block rounded-full bg-white shadow-md ring-1 ring-slate-300/80 transition-transform',
          isSm ? 'size-4 translate-x-0.5' : 'size-5 translate-x-0.5',
          'group-data-[checked]/switch:translate-x-[calc(100%-2px)]'
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };

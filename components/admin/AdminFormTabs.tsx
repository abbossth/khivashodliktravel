'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export interface AdminTab {
  value: string;
  label: string;
  shortLabel?: string;
}

interface AdminFormTabsProps {
  tabs: AdminTab[];
  defaultValue: string;
  children: React.ReactNode;
}

export function AdminFormTabs({ tabs, defaultValue, children }: AdminFormTabsProps) {
  return (
    <Tabs
      defaultValue={defaultValue}
      orientation="horizontal"
      className="flex w-full flex-col gap-4"
    >
      <TabsList
        className={cn(
          'grid h-auto w-full shrink-0 gap-1 rounded-lg bg-slate-100 p-1',
          tabs.length === 3 && 'grid-cols-3',
          tabs.length === 4 && 'grid-cols-4',
          tabs.length === 5 && 'grid-cols-5'
        )}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="rounded-md px-2 py-2.5 text-sm font-medium text-slate-600 transition-all data-active:bg-white data-active:text-brand-blue data-active:shadow-sm"
          >
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.shortLabel ?? tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {children}
      </div>
    </Tabs>
  );
}

export { TabsContent };

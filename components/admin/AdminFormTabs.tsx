'use client';

import { useState, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Check, Circle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export interface AdminTab {
  value: string;
  label: string;
  shortLabel?: string;
  hint?: string;
  icon?: LucideIcon;
  /** Visual group: language tabs vs settings vs media */
  group?: 'language' | 'meta' | 'media';
}

interface AdminFormTabsProps {
  tabs: AdminTab[];
  defaultValue: string;
  children: ReactNode;
  dirty?: boolean;
  /** When true, show a green dot on tabs that have content filled in */
  tabComplete?: Record<string, boolean>;
  /** Label above non-language tabs (e.g. "Tour setup") */
  metaGroupLabel?: string;
}

export function AdminFormTabs({
  tabs,
  defaultValue,
  children,
  dirty,
  tabComplete,
  metaGroupLabel = 'More sections',
}: AdminFormTabsProps) {
  const [active, setActive] = useState(defaultValue);
  const activeTab = tabs.find((t) => t.value === active);
  const languageTabs = tabs.filter((t) => t.group === 'language');
  const otherTabs = tabs.filter((t) => t.group !== 'language');

  return (
    <Tabs value={active} onValueChange={(v) => v && setActive(v)} className="flex w-full flex-col gap-0">
      <div className="sticky top-16 z-30 -mx-6 border-b border-slate-200 bg-[#F8FAFC]/95 px-4 py-4 backdrop-blur-md sm:-mx-8 sm:px-8">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              {languageTabs.length > 0 && (
                <div>
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                    Languages
                  </p>
                  <TabsList className="admin-tabs-pill-list h-auto w-full max-w-full flex-wrap justify-start gap-1.5 rounded-xl border border-slate-200/80 bg-slate-100/90 p-1.5 shadow-inner">
                    {languageTabs.map((tab) => (
                      <AdminTabButton
                        key={tab.value}
                        tab={tab}
                        isActive={active === tab.value}
                        isComplete={tabComplete?.[tab.value]}
                        showStatus={tabComplete != null}
                      />
                    ))}
                  </TabsList>
                </div>
              )}

              {otherTabs.length > 0 && (
                <div>
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                    {metaGroupLabel}
                  </p>
                  <TabsList className="admin-tabs-pill-list h-auto w-full max-w-full flex-wrap justify-start gap-1.5 rounded-xl border border-slate-200/80 bg-slate-100/90 p-1.5 shadow-inner">
                    {(languageTabs.length === 0 ? tabs : otherTabs).map((tab) => (
                      <AdminTabButton
                        key={tab.value}
                        tab={tab}
                        isActive={active === tab.value}
                        isComplete={tabComplete?.[tab.value]}
                        showStatus={tabComplete != null}
                      />
                    ))}
                  </TabsList>
                </div>
              )}

              {languageTabs.length === 0 && otherTabs.length === 0 && (
                <TabsList className="admin-tabs-pill-list h-auto w-full flex-wrap justify-start gap-1.5 rounded-xl border border-slate-200/80 bg-slate-100/90 p-1.5 shadow-inner">
                  {tabs.map((tab) => (
                    <AdminTabButton
                      key={tab.value}
                      tab={tab}
                      isActive={active === tab.value}
                      isComplete={tabComplete?.[tab.value]}
                      showStatus={tabComplete != null}
                    />
                  ))}
                </TabsList>
              )}
            </div>

            {dirty && (
              <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 shadow-sm">
                Unsaved changes
              </span>
            )}
          </div>

          {activeTab?.hint && (
            <p className="rounded-lg border border-orange-100 bg-orange-50/80 px-3 py-2 text-sm text-[#9A3412]">
              <span className="font-semibold text-[#EA580C]">{activeTab.label}: </span>
              {activeTab.hint}
            </p>
          )}
        </div>
      </div>

      <div className="admin-tab-panel w-full pt-6">{children}</div>
    </Tabs>
  );
}

function AdminTabButton({
  tab,
  isActive,
  isComplete,
  showStatus,
}: {
  tab: AdminTab;
  isActive: boolean;
  isComplete?: boolean;
  showStatus?: boolean;
}) {
  const Icon = tab.icon;

  return (
    <TabsTrigger
      value={tab.value}
      className={cn(
        'admin-tab-trigger inline-flex min-h-10 flex-none items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium shadow-none transition-all duration-200',
        'border-transparent bg-transparent text-[#64748B]',
        'hover:bg-white/70 hover:text-[#1E293B]',
        'focus-visible:ring-2 focus-visible:ring-[#F97316]/40 focus-visible:ring-offset-1',
        'data-active:border-[#F97316]/30 data-active:bg-white data-active:text-[#0F172A] data-active:shadow-md',
        isActive &&
          'border-[#F97316]/40 bg-white text-[#0F172A] shadow-md ring-2 ring-[#F97316]/25'
      )}
    >
      {Icon && (
        <span
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold transition-colors',
            isActive ? 'bg-[#F97316] text-white' : 'bg-slate-200/80 text-[#64748B]'
          )}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden />
        </span>
      )}
      {!Icon && tab.shortLabel && (
        <span
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-bold uppercase',
            isActive ? 'bg-[#F97316] text-white' : 'bg-slate-200/80 text-[#64748B]'
          )}
        >
          {tab.shortLabel}
        </span>
      )}
      <span className="hidden sm:inline">{tab.label}</span>
      <span className="sm:hidden">{tab.shortLabel ?? tab.label}</span>
      {showStatus && (
        <span className="ml-0.5 shrink-0" aria-hidden>
          {isComplete ? (
            <Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2.5} />
          ) : (
            <Circle className="h-3 w-3 text-slate-300" strokeWidth={2} />
          )}
        </span>
      )}
    </TabsTrigger>
  );
}

export { TabsContent };

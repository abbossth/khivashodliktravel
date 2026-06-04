'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Map,
  FileText,
  CalendarCheck,
  MessageSquare,
  Plus,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminLoading from '@/components/admin/AdminLoading';
import { useAdminStore } from '@/hooks/useAdmin';
import { parseJsonResponse } from '@/hooks/useSafeFetch';

const STAT_ACCENTS = [
  { border: 'border-t-blue-500', iconBg: 'bg-blue-50 text-blue-600', trend: 'up' as const },
  { border: 'border-t-emerald-500', iconBg: 'bg-emerald-50 text-emerald-600', trend: 'up' as const },
  { border: 'border-t-orange-500', iconBg: 'bg-orange-50 text-orange-600', trend: 'down' as const },
  { border: 'border-t-violet-500', iconBg: 'bg-violet-50 text-violet-600', trend: 'up' as const },
];

export default function AdminDashboard() {
  const { token } = useAdminStore();
  const [stats, setStats] = useState({ tours: 0, posts: 0, bookings: 0, pending: 0, inquiries: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [toursRes, blogRes, bookingsRes, inquiriesRes] = await Promise.all([
        fetch('/api/tours?all=true', { headers }),
        fetch('/api/blog?all=true', { headers }),
        fetch('/api/bookings', { headers }),
        fetch('/api/inquiries', { headers }),
      ]);

      const [toursParsed, blogParsed, bookingsParsed, inquiriesParsed] = await Promise.all([
        parseJsonResponse<{ tours?: unknown[] }>(toursRes),
        parseJsonResponse<{ posts?: unknown[] }>(blogRes),
        parseJsonResponse<{ bookings?: { status: string }[] }>(bookingsRes),
        parseJsonResponse<{ inquiries?: { status: string }[] }>(inquiriesRes),
      ]);

      const tours = toursParsed.ok && Array.isArray(toursParsed.data?.tours) ? toursParsed.data.tours : [];
      const posts = blogParsed.ok && Array.isArray(blogParsed.data?.posts) ? blogParsed.data.posts : [];
      const bookings =
        bookingsParsed.ok && Array.isArray(bookingsParsed.data?.bookings)
          ? bookingsParsed.data.bookings
          : [];
      const inquiries =
        inquiriesParsed.ok && Array.isArray(inquiriesParsed.data?.inquiries)
          ? inquiriesParsed.data.inquiries
          : [];

      const failures: string[] = [];
      if (!toursParsed.ok) failures.push(`tours (${toursParsed.error ?? toursRes.status})`);
      if (!blogParsed.ok) failures.push(`blog (${blogParsed.error ?? blogRes.status})`);
      if (!bookingsParsed.ok) failures.push(`bookings (${bookingsParsed.error ?? bookingsRes.status})`);
      if (!inquiriesParsed.ok) failures.push(`inquiries (${inquiriesParsed.error ?? inquiriesRes.status})`);
      if (failures.length > 0) setError(failures.join(' · '));

      setStats({
        tours: tours.length,
        posts: posts.length,
        bookings: bookings.length,
        pending: bookings.filter((b) => b.status === 'pending').length,
        inquiries: inquiries.filter((i) => i.status === 'new').length,
      });
    } catch {
      setError('Network error while loading dashboard stats');
      setStats({ tours: 0, posts: 0, bookings: 0, pending: 0, inquiries: 0 });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const cards = [
    { label: 'Tours', value: stats.tours, icon: Map, href: '/admin/tours', hint: 'Active listings' },
    { label: 'Blog posts', value: stats.posts, icon: FileText, href: '/admin/blog', hint: 'Published & drafts' },
    {
      label: 'Bookings',
      value: stats.bookings,
      icon: CalendarCheck,
      href: '/admin/bookings',
      hint: stats.pending > 0 ? `${stats.pending} pending` : 'All caught up',
    },
    {
      label: 'Inquiries',
      value: stats.inquiries,
      icon: MessageSquare,
      href: '/admin/inquiries',
      hint: stats.inquiries > 0 ? `${stats.inquiries} new` : 'Inbox clear',
    },
  ];

  if (loading) return <AdminLoading variant="cards" />;

  return (
    <div className="space-y-8">
      {error && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Could not load all dashboard stats: {error}</span>
          <Button variant="link" className="h-auto p-0 text-red-700" onClick={loadStats}>
            Retry
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, href, hint }, i) => {
          const accent = STAT_ACCENTS[i];
          const TrendIcon = accent.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <Link key={label} href={href} className={`admin-stat-card block border-t-4 ${accent.border}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">
                    {label}
                  </p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-[#1E293B]">{value}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-[#64748B]">
                    <TrendIcon
                      className={`h-3.5 w-3.5 ${accent.trend === 'up' ? 'text-emerald-500' : 'text-orange-500'}`}
                    />
                    {hint}
                  </p>
                </div>
                <span className={`rounded-xl p-2.5 ${accent.iconBg}`}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 text-sm font-medium text-[#F97316]">Manage →</p>
            </Link>
          );
        })}
      </div>

      <section
        className="overflow-hidden rounded-xl shadow-lg"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)' }}
      >
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="text-xl font-bold text-white">Quick actions</h2>
            <p className="mt-1 text-sm text-slate-300">
              Create new content for Khiva Shodlik Travel
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/admin/tours/new">
                <Plus className="mr-2 h-4 w-4" /> New tour
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/admin/blog/new">
                <Plus className="mr-2 h-4 w-4" /> New post
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-[#0EA5E9]" />
          <h2 className="text-lg font-bold text-[#1E293B]">Recent activity</h2>
        </div>
        <p className="text-sm text-[#64748B]">
          Activity feed coming soon. Check Bookings and Inquiries for the latest customer
          requests.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild variant="outline" size="sm" className="rounded-lg">
            <Link href="/admin/bookings">View bookings</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-lg">
            <Link href="/admin/inquiries">View inquiries</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

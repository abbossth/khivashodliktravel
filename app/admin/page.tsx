'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Map, FileText, CalendarCheck, MessageSquare, Plus, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AdminLoading from '@/components/admin/AdminLoading';
import { useAdminStore } from '@/hooks/useAdmin';
import { parseJsonResponse } from '@/hooks/useSafeFetch';

export default function AdminDashboard() {
  const { token } = useAdminStore();
  const [stats, setStats] = useState({ tours: 0, posts: 0, bookings: 0, pending: 0, inquiries: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadStats = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(false);

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

      if (!toursParsed.ok || !blogParsed.ok || !bookingsParsed.ok) {
        setError(true);
      }

      setStats({
        tours: tours.length,
        posts: posts.length,
        bookings: bookings.length,
        pending: bookings.filter((b) => b.status === 'pending').length,
        inquiries: inquiries.filter((i) => i.status === 'new').length,
      });
    } catch {
      setError(true);
      setStats({ tours: 0, posts: 0, bookings: 0, pending: 0, inquiries: 0 });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const cards = [
    {
      label: 'Tours',
      value: stats.tours,
      icon: Map,
      href: '/admin/tours',
      accent: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Blog posts',
      value: stats.posts,
      icon: FileText,
      href: '/admin/blog',
      accent: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Bookings',
      value: stats.bookings,
      icon: CalendarCheck,
      href: '/admin/bookings',
      accent: 'text-orange-600 bg-orange-50',
      hint: stats.pending > 0 ? `${stats.pending} pending` : undefined,
    },
    {
      label: 'Inquiries',
      value: stats.inquiries,
      icon: MessageSquare,
      href: '/admin/inquiries',
      accent: 'text-violet-600 bg-violet-50',
      hint: stats.inquiries > 0 ? `${stats.inquiries} new` : undefined,
    },
  ];

  if (loading) return <AdminLoading />;

  return (
    <div className="space-y-8">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Could not load all dashboard stats.
          <Button variant="link" className="h-auto p-0" onClick={loadStats}>
            Retry
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, href, accent, hint }) => (
          <Card key={label} className="card-elevated border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <span className={`rounded-lg p-2 ${accent}`}>
                <Icon className="h-5 w-5" />
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              {hint && <p className="mt-1 text-xs font-medium text-brand-orange">{hint}</p>}
              <Button asChild variant="link" className="mt-2 h-auto p-0 text-brand-blue">
                <Link href={href}>Manage →</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-brand-blue">Quick actions</h3>
            <p className="text-sm text-muted-foreground">Create new content for the public site</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="bg-brand-blue">
              <Link href="/admin/tours/new">
                <Plus className="mr-2 h-4 w-4" /> New tour
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/blog/new">
                <Plus className="mr-2 h-4 w-4" /> New post
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

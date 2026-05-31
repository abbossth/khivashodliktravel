'use client';

import { useEffect, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import TourForm from '@/components/admin/TourForm';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/hooks/useAdmin';
import { parseJsonResponse } from '@/hooks/useSafeFetch';
import type { Tour } from '@/types';

export default function EditTourPage({ params }: { params: { id: string } }) {
  const { token } = useAdminStore();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/tours/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const parsed = await parseJsonResponse<{ tour?: Tour }>(res);
        if (cancelled) return;

        if (parsed.ok && parsed.data?.tour) {
          setTour(parsed.data.tour);
        } else {
          setError(parsed.error ?? 'Tour not found');
        }
      } catch {
        if (!cancelled) setError('Failed to load tour');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, params.id]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <AlertCircle className="h-10 w-10 text-muted-foreground" />
        <p className="text-muted-foreground">{error ?? 'Tour not found'}</p>
        <Button asChild variant="outline">
          <Link href="/admin/tours">Back to tours</Link>
        </Button>
      </div>
    );
  }

  return <TourForm tour={tour} />;
}

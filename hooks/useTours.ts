'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Tour, TourCategory } from '@/types';
import { logError } from '@/lib/safe';
import { parseJsonResponse } from '@/hooks/useSafeFetch';

interface UseToursOptions {
  category?: TourCategory | 'all';
  featured?: boolean;
  limit?: number;
  all?: boolean;
  token?: string | null;
}

export function useTours(options: UseToursOptions = {}) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTours = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (options.category && options.category !== 'all') {
        params.set('category', options.category);
      }
      if (options.featured) params.set('featured', 'true');
      if (options.limit) params.set('limit', String(options.limit));
      if (options.all) params.set('all', 'true');

      const headers: HeadersInit = {};
      if (options.token) {
        headers.Authorization = `Bearer ${options.token}`;
      }

      const res = await fetch(`/api/tours?${params.toString()}`, { headers });
      const parsed = await parseJsonResponse<{ tours?: Tour[] }>(res);

      if (parsed.ok && parsed.data) {
        setTours(Array.isArray(parsed.data.tours) ? parsed.data.tours : []);
      } else {
        setTours([]);
        setError(parsed.error ?? 'Failed to load tours');
      }
    } catch (err) {
      logError('useTours', err);
      setTours([]);
      setError('Could not load tours. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, [options.category, options.featured, options.limit, options.all, options.token]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  return { tours, loading, error, refetch: fetchTours };
}

export async function fetchTourBySlug(slug: string): Promise<Tour | null> {
  try {
    const res = await fetch(`/api/tours?slug=${encodeURIComponent(slug)}`);
    const parsed = await parseJsonResponse<{ tour?: Tour }>(res);
    return parsed.ok && parsed.data?.tour ? parsed.data.tour : null;
  } catch (err) {
    logError('fetchTourBySlug', err);
    return null;
  }
}

export async function fetchTourById(id: string, token?: string): Promise<Tour | null> {
  try {
    const headers: HeadersInit = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`/api/tours/${id}`, { headers });
    const parsed = await parseJsonResponse<{ tour?: Tour }>(res);
    return parsed.ok && parsed.data?.tour ? parsed.data.tour : null;
  } catch (err) {
    logError('fetchTourById', err);
    return null;
  }
}

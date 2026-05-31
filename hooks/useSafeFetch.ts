'use client';

import { useState, useEffect, useCallback } from 'react';
import { logError } from '@/lib/safe';

interface UseSafeFetchOptions {
  enabled?: boolean;
}

export function useSafeFetch<T>(
  fetcher: () => Promise<{ ok: boolean; data: T | null; error?: string }>,
  deps: unknown[] = [],
  options: UseSafeFetchOptions = {}
) {
  const { enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      if (result.ok && result.data != null) {
        setData(result.data);
      } else {
        setData(null);
        setError(result.error ?? 'Failed to load data');
      }
    } catch (err) {
      logError('useSafeFetch', err);
      setData(null);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [enabled, fetcher]);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch, ...deps]);

  return { data, loading, error, refetch, setData };
}

export async function parseJsonResponse<T>(res: Response): Promise<{
  ok: boolean;
  data: T | null;
  error?: string;
}> {
  try {
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      const message =
        json && typeof json === 'object' && 'error' in json
          ? String((json as { error: unknown }).error)
          : `Request failed (${res.status})`;
      return { ok: false, data: null, error: message };
    }
    return { ok: true, data: json as T };
  } catch {
    return { ok: false, data: null, error: 'Invalid server response' };
  }
}

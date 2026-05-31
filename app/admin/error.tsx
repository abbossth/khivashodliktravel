'use client';

import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-2 text-xl font-semibold text-brand-blue">Admin panel error</h2>
      <p className="mb-6 max-w-md text-sm text-muted-foreground">
        Something failed in the admin area. Try reloading. In development, run{' '}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">npm run dev:clean</code> if this
        keeps happening.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Try again
        </button>
        <a
          href="/admin"
          className="rounded-lg border border-input px-5 py-2.5 text-sm font-medium text-brand-blue hover:bg-muted"
        >
          Dashboard
        </a>
      </div>
    </div>
  );
}

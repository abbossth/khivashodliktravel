'use client';

import { useEffect } from 'react';

/**
 * Public site error UI — minimal deps so it loads even when other chunks fail.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="page-shell flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <h2 className="mb-3 text-2xl font-bold text-brand-blue">Something went wrong</h2>
      <p className="mb-8 max-w-md text-muted-foreground">
        We could not load this page. Please try again or return to the home page.
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
          href="/en"
          className="rounded-lg border border-input px-5 py-2.5 text-sm font-medium text-brand-blue hover:bg-muted"
        >
          Back to home
        </a>
      </div>
    </div>
  );
}

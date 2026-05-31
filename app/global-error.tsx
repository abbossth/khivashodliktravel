'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center font-sans">
        <h1 className="mb-2 text-2xl font-bold text-slate-800">Something went wrong</h1>
        <p className="mb-6 max-w-md text-slate-600">
          An unexpected error occurred. Please refresh the page or try again in a moment.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-[#1a3a5c] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Try again
        </button>
      </body>
    </html>
  );
}

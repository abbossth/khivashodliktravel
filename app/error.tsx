'use client';

/**
 * Root error boundary (admin, API-adjacent routes).
 * Keep dependencies minimal so this still loads when .next cache is stale.
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a3a5c', marginBottom: '0.5rem' }}>
        Something went wrong
      </h2>
      <p style={{ maxWidth: '28rem', color: '#64748b', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        The page could not be loaded. If you see this often in development, stop the server and run{' '}
        <code style={{ background: '#f1f5f9', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
          npm run dev:clean
        </code>
        .
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            padding: '0.5rem 1.25rem',
            background: '#1a3a5c',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          Try again
        </button>
        <a
          href="/en"
          style={{
            padding: '0.5rem 1.25rem',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            color: '#1a3a5c',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          Home
        </a>
      </div>
      {process.env.NODE_ENV === 'development' && error?.message && (
        <pre
          style={{
            marginTop: '1.5rem',
            maxWidth: '100%',
            overflow: 'auto',
            fontSize: '11px',
            color: '#94a3b8',
            textAlign: 'left',
          }}
        >
          {error.message}
        </pre>
      )}
    </div>
  );
}

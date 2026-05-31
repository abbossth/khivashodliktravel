import Link from 'next/link';

export default function RootNotFound() {
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
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a3a5c' }}>Page not found</h1>
      <p style={{ color: '#64748b', margin: '0.75rem 0 1.5rem' }}>
        The page you are looking for does not exist.
      </p>
      <Link
        href="/en"
        style={{
          padding: '0.5rem 1.25rem',
          background: '#1a3a5c',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 500,
        }}
      >
        Go to homepage
      </Link>
    </div>
  );
}

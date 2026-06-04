import { Inter } from 'next/font/google';
import AdminLocaleProvider from '@/components/admin/AdminLocaleProvider';
import AdminShell from '@/components/admin/AdminShell';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import './admin.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={inter.className}>
      <AdminLocaleProvider>
        <AdminShell>
          <ErrorBoundary
            fallbackTitle="Admin section error"
            fallbackMessage="This admin page failed to load. Try again or open another section from the menu."
          >
            {children}
          </ErrorBoundary>
        </AdminShell>
      </AdminLocaleProvider>
    </div>
  );
}

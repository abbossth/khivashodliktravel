import AdminLocaleProvider from '@/components/admin/AdminLocaleProvider';
import AdminShell from '@/components/admin/AdminShell';
import ErrorBoundary from '@/components/shared/ErrorBoundary';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
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
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { setAdminAuthCookie } from '@/lib/auth-cookie';
import { getFirebaseAuthSafe, isFirebaseConfigured } from '@/lib/firebase';
import { useAdminStore } from '@/hooks/useAdmin';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setUser, setToken, setLoading, loading } = useAdminStore();
  const [configError, setConfigError] = useState(false);

  useEffect(() => {
    const auth = getFirebaseAuthSafe();
    if (!auth || !isFirebaseConfigured()) {
      setConfigError(true);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (cancelled) return;

        try {
          if (!user) {
            setUser(null);
            setToken(null);
            setLoading(false);
            router.push('/admin/login');
            return;
          }

          const token = await user.getIdToken();
          setAdminAuthCookie(token);
          setUser(user);
          setToken(token);
          setLoading(false);
        } catch {
          setUser(null);
          setToken(null);
          setLoading(false);
          router.push('/admin/login');
        }
      },
      () => {
        if (!cancelled) {
          setLoading(false);
          setConfigError(true);
        }
      }
    );

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [router, setUser, setToken, setLoading]);

  if (configError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="max-w-md text-muted-foreground">
          Admin authentication is not configured. Check Firebase environment variables.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Back to website</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  return <>{children}</>;
}

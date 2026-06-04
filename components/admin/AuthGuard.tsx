'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { setAdminAuthCookie, clearAdminAuthCookie } from '@/lib/auth-cookie';
import { getFirebaseAuthSafe, isFirebaseConfigured } from '@/lib/firebase';
import { useAdminStore } from '@/hooks/useAdmin';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type AuthPhase = 'loading' | 'authenticated' | 'unauthenticated';

function initialPhase(): AuthPhase {
  const { user, token } = useAdminStore.getState();
  return user && token ? 'authenticated' : 'loading';
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user: storeUser, token: storeToken, setUser, setToken, setLoading } = useAdminStore();
  const [phase, setPhase] = useState<AuthPhase>(initialPhase);
  const [configError, setConfigError] = useState(false);
  const hadSessionRef = useRef(Boolean(storeUser && storeToken));

  useEffect(() => {
    if (storeUser && storeToken) {
      hadSessionRef.current = true;
      setPhase('authenticated');
      setLoading(false);
    }
  }, [storeUser, storeToken, setLoading]);

  useEffect(() => {
    const auth = getFirebaseAuthSafe();
    if (!auth || !isFirebaseConfigured()) {
      setConfigError(true);
      setPhase('unauthenticated');
      setLoading(false);
      return;
    }

    let cancelled = false;
    let resolved = false;

    const goToLogin = () => {
      if (pathname === '/admin/login') return;
      router.replace('/admin/login');
    };

    const timeout = window.setTimeout(() => {
      if (!cancelled && !resolved) {
        resolved = true;
        setPhase('unauthenticated');
        setLoading(false);
        setUser(null);
        setToken(null);
        clearAdminAuthCookie();
        goToLogin();
      }
    }, 12000);

    const handleUser = async (user: typeof auth.currentUser) => {
      if (cancelled) return;

      if (!user) {
        if (auth.currentUser) return;
        const { token } = useAdminStore.getState();
        if (hadSessionRef.current || token) {
          setPhase('authenticated');
          setLoading(false);
          return;
        }
        resolved = true;
        setUser(null);
        setToken(null);
        clearAdminAuthCookie();
        setLoading(false);
        setPhase('unauthenticated');
        goToLogin();
        return;
      }

      resolved = true;
      hadSessionRef.current = true;

      try {
        const idToken = await user.getIdToken();
        if (cancelled) return;
        setAdminAuthCookie(idToken);
        setUser(user);
        setToken(idToken);
        setLoading(false);
        setPhase('authenticated');
      } catch {
        if (cancelled) return;
        setUser(null);
        setToken(null);
        clearAdminAuthCookie();
        setLoading(false);
        setPhase('unauthenticated');
        goToLogin();
      }
    };

    void (async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch {
        /* optional */
      }
      if (auth.currentUser) {
        await handleUser(auth.currentUser);
      }
    })();

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        void handleUser(user);
      },
      () => {
        if (!cancelled) {
          setConfigError(true);
          setPhase('unauthenticated');
          setLoading(false);
        }
      }
    );

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      unsubscribe();
    };
  }, [router, pathname, setUser, setToken, setLoading]);

  if (configError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F8FAFC] p-6 text-center">
        <AlertCircle className="h-10 w-10 text-[#EF4444]" />
        <p className="max-w-md text-[#64748B]">
          Admin authentication is not configured. Check Firebase environment variables.
        </p>
        <Button asChild variant="outline" className="rounded-lg">
          <Link href="/">Back to website</Link>
        </Button>
      </div>
    );
  }

  if (phase === 'loading') {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 bg-[#F8FAFC]">
        <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" />
        <p className="text-sm text-[#64748B]">Loading admin…</p>
      </div>
    );
  }

  if (phase === 'unauthenticated') {
    return null;
  }

  return <>{children}</>;
}

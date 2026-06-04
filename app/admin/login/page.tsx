'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { Loader2, Shield } from 'lucide-react';
import { BrandLogoMark } from '@/components/shared/BrandLogo';
import { getFirebaseAuthSafe, isFirebaseConfigured } from '@/lib/firebase';
import { getFirebaseAuthErrorMessage } from '@/lib/firebase-auth-errors';
import { saveAdminSession, goToAdminDashboard } from '@/lib/admin-session';
import { useAdminStore } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminLoginPage() {
  const { setUser, setToken, setLoading: setAdminBootLoading } = useAdminStore();
  const t = useTranslations('admin.login');

  useEffect(() => {
    setAdminBootLoading(false);
  }, [setAdminBootLoading]);

  // Strip credentials if the browser submitted the form via GET (must never stay in the URL).
  useEffect(() => {
    const url = new URL(window.location.href);
    if (
      url.searchParams.has('email') ||
      url.searchParams.has('password') ||
      url.searchParams.has('pass')
    ) {
      url.search = '';
      window.history.replaceState({}, '', url.pathname);
    }
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    setError('');

    try {
      const auth = getFirebaseAuthSafe();
      if (!auth || !isFirebaseConfigured()) {
        setError(t('errorConfig'));
        setLoading(false);
        return;
      }

      await setPersistence(auth, browserLocalPersistence).catch(() => undefined);

      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await saveAdminSession(credential.user, setUser, setToken);
      goToAdminDashboard();
    } catch (err) {
      const message =
        err instanceof Error && err.message.includes('cookie')
          ? err.message
          : getFirebaseAuthErrorMessage(err, t('errorAuth'));
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden p-4"
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0F172A 100%)' }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_#F9731633,_transparent_45%)]" />
      <Card className="relative w-full max-w-md rounded-xl border-0 shadow-2xl">
        <CardHeader className="space-y-3 text-center">
          <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-xl bg-brand-blue/10 ring-1 ring-brand-blue/10">
            <BrandLogoMark className="h-16 w-16" priority />
          </div>
          <CardTitle className="text-2xl font-bold text-[#1E293B]">{t('title')}</CardTitle>
          <CardDescription className="flex items-center justify-center gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            Khiva Shodlik Travel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="admin-email">{t('email')}</Label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">{t('password')}</Label>
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="h-11"
              />
            </div>
            {error && (
              <p
                className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
                role="alert"
              >
                {error}
              </p>
            )}
            <Button
              type="submit"
              formNoValidate
              className="h-11 w-full rounded-lg bg-[#F97316] font-semibold hover:bg-[#EA580C]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('submitting')}
                </>
              ) : (
                t('submit')
              )}
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-[#64748B]">
            Firebase project:{' '}
            <span className="font-mono text-[#1E293B]">
              {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'shodlik-travel-4dbbf'}
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

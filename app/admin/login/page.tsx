'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Loader2, Shield } from 'lucide-react';
import { BrandLogoMark } from '@/components/shared/BrandLogo';
import { setAdminAuthCookie } from '@/lib/auth-cookie';
import { getFirebaseAuthSafe, isFirebaseConfigured } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminLoginPage() {
  const router = useRouter();
  const t = useTranslations('admin.login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const auth = getFirebaseAuthSafe();
      if (!auth || !isFirebaseConfigured()) {
        setError(t('errorConfig'));
        return;
      }

      const credential = await signInWithEmailAndPassword(auth, email, password);
      const token = await credential.user.getIdToken();
      setAdminAuthCookie(token);
      router.push('/admin');
    } catch {
      setError(t('errorAuth'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-blue p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_hsl(var(--brand-orange)/0.25),_transparent_50%)]" />
      <Card className="relative w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="space-y-3 text-center">
          <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-xl bg-brand-blue/10 ring-1 ring-brand-blue/10">
            <BrandLogoMark className="h-16 w-16" useRaster priority />
          </div>
          <CardTitle className="text-2xl text-brand-blue">{t('title')}</CardTitle>
          <CardDescription className="flex items-center justify-center gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            Khiva Shodlik Travel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" className="h-11 w-full bg-brand-blue" disabled={loading}>
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
        </CardContent>
      </Card>
    </div>
  );
}

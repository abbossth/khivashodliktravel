import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

export default async function NotFound() {
  const t = await getTranslations('common');

  return (
    <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-4 text-2xl font-bold text-brand-blue">{t('notFound')}</h2>
      <Button asChild className="bg-brand-orange">
        <Link href="/">{t('backHome')}</Link>
      </Button>
    </div>
  );
}

'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

/** Official Khiva Shodlik Travel emblem (transparent PNG) */
export const BRAND_LOGO_SRC = '/brand/khiva-shodlik-travel-logo.png';

export type BrandLogoVariant = 'mark' | 'full';
export type BrandLogoTheme = 'light' | 'dark';

type BrandLogoProps = {
  variant?: BrandLogoVariant;
  theme?: BrandLogoTheme;
  className?: string;
  markClassName?: string;
  textClassName?: string;
  taglineClassName?: string;
  showText?: boolean;
  href?: string;
  priority?: boolean;
};

export function BrandLogoMark({
  className,
  priority,
  size = 512,
}: {
  className?: string;
  priority?: boolean;
  size?: number;
}) {
  return (
    <Image
      src={BRAND_LOGO_SRC}
      alt=""
      width={size}
      height={size}
      className={cn('h-full w-full object-contain', className)}
      priority={priority}
    />
  );
}

function BrandWordmark({
  theme,
  textClassName,
  taglineClassName,
}: {
  theme: BrandLogoTheme;
  textClassName?: string;
  taglineClassName?: string;
}) {
  const t = useTranslations('brand');
  const isDark = theme === 'dark';

  return (
    <div className={cn('flex min-w-0 flex-col justify-center leading-tight', taglineClassName)}>
      <span
        className={cn(
          'font-serif text-[14px] font-bold tracking-tight sm:text-[15px] md:whitespace-nowrap',
          isDark ? 'text-white' : 'text-brand-blue',
          textClassName
        )}
      >
        <span className="text-brand-orange">{t('nameAccent')}</span>
        <span className={isDark ? 'text-white' : 'text-brand-blue'}>{t('nameRest')}</span>
      </span>
    </div>
  );
}

export default function BrandLogo({
  variant = 'mark',
  theme = 'light',
  className,
  markClassName,
  textClassName,
  taglineClassName,
  showText = true,
  href,
  priority = false,
}: BrandLogoProps) {
  const markSize =
    variant === 'full'
      ? 'h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16'
      : 'h-11 w-11 sm:h-12 sm:w-12 md:h-[3.25rem] md:w-[3.25rem]';

  const content = (
    <div className={cn('flex min-w-0 items-center gap-2.5 sm:gap-3', className)}>
      <span
        className={cn(
          'relative flex shrink-0 items-center justify-center',
          markSize,
          markClassName
        )}
      >
        <BrandLogoMark priority={priority} className={cn(markSize, 'object-contain')} />
      </span>
      {showText ? (
        <BrandWordmark
          theme={theme}
          textClassName={textClassName}
          taglineClassName={taglineClassName}
        />
      ) : null}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group inline-flex min-w-0 max-w-[min(100%,300px)] items-center rounded-lg py-0.5 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 sm:max-w-none"
      >
        {content}
      </Link>
    );
  }

  return content;
}

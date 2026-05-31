import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const MARK_SRC = '/brand/logo-mark.svg';
const FULL_SRC = '/brand/logo-full.svg';
const MARK_PNG = '/brand/logo-mark.png';

export type BrandLogoVariant = 'mark' | 'full';
export type BrandLogoTheme = 'light' | 'dark';

type BrandLogoProps = {
  variant?: BrandLogoVariant;
  theme?: BrandLogoTheme;
  /** Use PNG mark (e.g. admin login hero) */
  useRasterMark?: boolean;
  className?: string;
  markClassName?: string;
  textClassName?: string;
  showText?: boolean;
  href?: string;
  priority?: boolean;
};

export function BrandLogoMark({
  className,
  useRaster,
  priority,
}: {
  className?: string;
  useRaster?: boolean;
  priority?: boolean;
}) {
  const src = useRaster ? MARK_PNG : MARK_SRC;
  return (
    <Image
      src={src}
      alt=""
      width={64}
      height={64}
      className={cn('h-full w-full object-contain', className)}
      priority={priority}
      unoptimized={src.endsWith('.svg')}
    />
  );
}

export default function BrandLogo({
  variant = 'full',
  theme = 'light',
  useRasterMark = false,
  className,
  markClassName,
  textClassName,
  showText = true,
  href,
  priority = false,
}: BrandLogoProps) {
  const isDark = theme === 'dark';

  const content =
    variant === 'full' ? (
      <Image
        src={FULL_SRC}
        alt="Khiva Shodlik Travel"
        width={280}
        height={56}
        className={cn('h-9 w-auto sm:h-10', className)}
        priority={priority}
        unoptimized
      />
    ) : (
      <div className={cn('flex items-center gap-2.5', className)}>
        <span
          className={cn(
            'relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg',
            !markClassName?.includes('h-') && 'h-9 w-9',
            isDark ? 'bg-white/10 ring-1 ring-white/15' : 'bg-brand-blue/5 ring-1 ring-brand-blue/10',
            markClassName
          )}
        >
          <BrandLogoMark
            className={cn(!markClassName?.includes('h-') && 'h-8 w-8', 'object-contain')}
            useRaster={useRasterMark}
            priority={priority}
          />
        </span>
        {showText && (
          <>
            <span
              className={cn(
                'hidden font-bold sm:inline',
                isDark ? 'text-white' : 'text-brand-blue',
                textClassName
              )}
            >
              Khiva Shodlik Travel
            </span>
            <span
              className={cn(
                'font-bold sm:hidden',
                isDark ? 'text-white' : 'text-brand-blue',
                textClassName
              )}
            >
              Shodlik Travel
            </span>
          </>
        )}
      </div>
    );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 rounded-md">
        {content}
      </Link>
    );
  }

  return content;
}

import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
  as?: 'h1' | 'h2';
}

export default function SectionHeading({
  title,
  subtitle,
  align = 'center',
  className,
  as: Heading = 'h2',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-10',
        align === 'center' ? 'text-center' : 'text-left',
        className
      )}
    >
      <Heading className="text-3xl font-bold tracking-tight text-brand-blue md:text-4xl">
        {title}
      </Heading>
      {subtitle && (
        <p className="mt-3 text-lg text-muted-foreground">{subtitle}</p>
      )}
      <div
        className={cn(
          'mt-4 h-1 w-16 rounded-full bg-brand-orange',
          align === 'center' && 'mx-auto'
        )}
      />
    </div>
  );
}

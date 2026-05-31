import { cn } from '@/lib/utils';
import type { ReviewPlatform } from '@/lib/reviews';

const logoClass = 'h-full w-full';

export function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={cn(logoClass, className)} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function TrustpilotLogo({ className }: { className?: string }) {
  return (
    <svg className={cn(logoClass, className)} viewBox="0 0 126 31" aria-hidden>
      <path
        fill="#00B67A"
        d="M0 0h30.1v30.1H0V0zm15.05 20.17l-4.78-2.51 4.78-7.05 4.78 7.05-4.78 2.51z"
      />
      <path
        fill="#005128"
        d="M38.4 8.5h4.2l6.1 14.2 6.1-14.2h4.1v18.6h-3.2V13.1l-6.5 14h-2.6l-6.5-14v14h-3.2V8.5zm35.2 0c5.4 0 9 3.6 9 9.3s-3.6 9.3-9 9.3-9-3.6-9-9.3 3.6-9.3 9-9.3zm0 3c-3.4 0-5.6 2.4-5.6 6.3s2.2 6.3 5.6 6.3 5.6-2.4 5.6-6.3-2.2-6.3-5.6-6.3zm22.4-3h3.2v11.4c0 3.2 1.8 4.8 4.6 4.8 2.7 0 4.5-1.6 4.5-4.8V8.5h3.2v11.6c0 5-3.2 7.8-7.7 7.8s-7.8-2.8-7.8-7.8V8.5zm28.5 0h3.2l7.4 12.4V8.5h3v18.6h-3.2L115 14.7v12.4h-3V8.5z"
      />
    </svg>
  );
}

/** Compact Trustpilot mark (star + wordmark simplified for small badges) */
export function TrustpilotMark({ className }: { className?: string }) {
  return (
    <svg className={cn(logoClass, className)} viewBox="0 0 24 24" aria-hidden>
      <rect width="24" height="24" rx="2" fill="#00B67A" />
      <path
        fill="#fff"
        d="M12 17.5l-3.9-2.05 3.9-5.75 3.9 5.75L12 17.5zm0-13.5L8.1 9.7 12 7.65l3.9 2.05L12 4z"
      />
    </svg>
  );
}

export function TripAdvisorLogo({ className }: { className?: string }) {
  return (
    <svg className={cn(logoClass, className)} viewBox="0 0 120 28" aria-hidden>
      <circle cx="14" cy="14" r="12" fill="#34E0A1" />
      <circle cx="14" cy="11" r="4.5" fill="#000" />
      <circle cx="11.5" cy="12" r="1.2" fill="#fff" />
      <circle cx="16.5" cy="12" r="1.2" fill="#fff" />
      <path
        d="M10 16.5c1.2 1.8 2.8 2.8 4 2.8s2.8-1 4-2.8"
        stroke="#000"
        strokeWidth="0.8"
        fill="none"
      />
      <text x="32" y="19" fill="#000" fontSize="11" fontWeight="700" fontFamily="system-ui,sans-serif">
        Tripadvisor
      </text>
    </svg>
  );
}

/** Owl icon mark for small badges */
export function TripAdvisorMark({ className }: { className?: string }) {
  return (
    <svg className={cn(logoClass, className)} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="12" fill="#34E0A1" />
      <circle cx="12" cy="10" r="4" fill="#000" />
      <circle cx="10.2" cy="10.5" r="1.1" fill="#fff" />
      <circle cx="13.8" cy="10.5" r="1.1" fill="#fff" />
      <path
        d="M9 14.5c1 1.5 2 2.2 3 2.2s2-.7 3-2.2"
        stroke="#000"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PlatformLogo({
  platform,
  variant = 'mark',
  className,
}: {
  platform: ReviewPlatform;
  variant?: 'mark' | 'full';
  className?: string;
}) {
  switch (platform) {
    case 'google':
      return <GoogleLogo className={className} />;
    case 'trustpilot':
      return variant === 'full' ? (
        <TrustpilotLogo className={className} />
      ) : (
        <TrustpilotMark className={className} />
      );
    case 'tripadvisor':
      return variant === 'full' ? (
        <TripAdvisorLogo className={className} />
      ) : (
        <TripAdvisorMark className={className} />
      );
  }
}

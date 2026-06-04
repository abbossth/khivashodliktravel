'use client';

import { useId } from 'react';
import { cn } from '@/lib/utils';

/** Realistic circular emblem — Kalta Minor, madrasah, walls, path (top-middle sketch) */
export function KhivaBrandMark({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '');
  const sky = `sky-${uid}`;
  const clip = `clip-${uid}`;

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-full w-full', className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={sky} x1="30" y1="12" x2="70" y2="78" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e8dfd0" />
          <stop offset="0.45" stopColor="#c5d0dc" />
          <stop offset="1" stopColor="#9aabb8" />
        </linearGradient>
        <clipPath id={clip}>
          <circle cx="50" cy="50" r="45" />
        </clipPath>
      </defs>

      <circle cx="50" cy="50" r="49" fill="#faf8f4" stroke="#2c241c" strokeWidth="1.4" />
      <circle cx="50" cy="50" r="46" fill={`url(#${sky})`} stroke="#8b7355" strokeWidth="0.6" />

      <g clipPath={`url(#${clip})`}>
        <ellipse cx="50" cy="82" rx="38" ry="8" fill="#b8956a" fillOpacity="0.35" />

        <path
          d="M14 52h72"
          stroke="#6b5344"
          strokeWidth="0.8"
          opacity="0.5"
        />
        <path
          d="M14 50h5v4h-5zm9 0h5v4h-5zm9 0h5v4h-5zm9 0h5v4h-5zm9 0h5v4h-5zm9 0h5v4h-5zm9 0h5v4h-5zm9 0h5v4h-5z"
          fill="#a08060"
          fillOpacity="0.85"
        />

        <path
          d="M16 76h24v-16c0-6 5.4-11 12-11s12 5 12 11v16H16z"
          fill="#9a7d5c"
          stroke="#4a3728"
          strokeWidth="0.7"
        />
        <path
          d="M22 76V60c0-5 4-9 10-9s10 4 10 9v16H22z"
          fill="#7a6348"
          stroke="#3d3028"
          strokeWidth="0.55"
        />
        <path
          d="M26 76V64c0-3.5 3-6 6-6s6 2.5 6 6v12H26z"
          fill="#5c4a38"
          fillOpacity="0.45"
        />
        <path d="M20 54h16v3H20z" fill="#7a6348" />
        <ellipse cx="28" cy="55" rx="6" ry="4" fill="#6b5d52" stroke="#3d3028" strokeWidth="0.6" />
        <path
          d="M24 55c0-3 1.8-5.5 4-5.5s4 2.5 4 5.5"
          stroke="#4a6a7a"
          strokeWidth="0.5"
          fill="#8ab4c4"
          fillOpacity="0.55"
        />
        <path
          d="M26 50v10M30 48v12M34 50v10"
          stroke="#4a3728"
          strokeWidth="0.35"
          opacity="0.35"
        />

        <path
          d="M58 78V42c0-14 2.5-24 8-24s8 10 8 24v36H58z"
          fill="#6e9090"
          stroke="#3d4a48"
          strokeWidth="0.75"
        />
        <path d="M60 52h4v3h-4zm0 7h4v3h-4zm0 7h4v3h-4zm0-14h4v3h-4zm0-21h4v3h-4z" fill="#8ab0b0" fillOpacity="0.5" />
        <path d="M59 46h6v2.5c0 1.8-1.4 3.2-3 3.2s-3-1.4-3-3.2V46z" fill="#5a7878" stroke="#3d4a48" strokeWidth="0.5" />
        <ellipse cx="66" cy="40" rx="5" ry="2" fill="#7a9a9a" stroke="#3d4a48" strokeWidth="0.5" />
        <path
          d="M60 38h3v4h-3M63 36h3v5h-3"
          stroke="#3d4a48"
          strokeWidth="0.45"
        />
        <path
          d="M59 52h8M59 59h8M59 66h8M59 45h8"
          stroke="#c5ddd8"
          strokeWidth="0.55"
          opacity="0.7"
        />
        <path
          d="M61 48l1.5 2 2.5-.5-1 2.2.8 2.5-2.2-.3-2.2 2.5-.8-1-2.2z"
          fill="#d4e8e4"
          fillOpacity="0.45"
        />
        <path
          d="M61 62l1.2 1.6 2-.4-.8 1.8.6 2-1.8-.2-1.8 2-.6-.8-1.8z"
          fill="#d4e8e4"
          fillOpacity="0.4"
        />

        <path
          d="M50 82C38 74 32 74 26 78"
          stroke="#8b6914"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M50 82C58 74 64 74 70 78"
          stroke="#8b6914"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M50 82v-4c0-8-6-14-14-14s-14 6-14 14"
          stroke="#a08060"
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />

        <path
          d="M22 24c1.5-.8 3-.8 4.5 0M30 20c2-1 4-1 6 0"
          stroke="#5a6a78"
          strokeWidth="0.65"
          strokeLinecap="round"
          fill="none"
        />

        <path
          d="M12 78h76"
          stroke="#6b5344"
          strokeWidth="0.5"
          opacity="0.4"
        />
      </g>

      <circle cx="50" cy="50" r="45" fill="none" stroke="#2c241c" strokeWidth="0.35" opacity="0.2" />
    </svg>
  );
}

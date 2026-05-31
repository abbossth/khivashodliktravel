/** Optional cap for tour pages pre-rendered at build (set STATIC_TOUR_BUILD_LIMIT on Vercel if builds time out). */
export function getStaticTourBuildLimit(): number | undefined {
  const raw = process.env.STATIC_TOUR_BUILD_LIMIT?.trim();
  if (!raw) return undefined;

  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

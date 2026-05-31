import { revalidateTag } from 'next/cache';

/** Bust ISR cache after admin content changes */
export function revalidatePublicContent(tags: ('tours' | 'blog')[] = ['tours', 'blog']) {
  for (const tag of tags) {
    revalidateTag(tag);
  }
}

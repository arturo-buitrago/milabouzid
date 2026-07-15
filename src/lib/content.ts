// Small helpers shared by components that read from content collections.

/** True when a settings value is a real value — not empty and not a `{{BLANK}}` token. */
export function isFilled(v: string | undefined | null): v is string {
  return typeof v === 'string' && v.trim() !== '' && !v.includes('{{');
}

/** Extract an 11-char YouTube video id from a watch/share/embed/shorts URL (or a bare id). */
export function youTubeId(url: string): string | null {
  if (/^[\w-]{11}$/.test(url)) return url;
  const m = url.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
  return m ? m[1] : null;
}

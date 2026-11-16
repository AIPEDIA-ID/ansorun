/** Ambil ID video dari link YouTube (watch, youtu.be, embed, shorts). Kembalikan null bila bukan YouTube. */
export function youtubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    let id: string | null = null;
    if (host === 'youtu.be') id = u.pathname.slice(1);
    else if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      if (u.pathname === '/watch') id = u.searchParams.get('v');
      else {
        const m = u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/);
        id = m ? m[1] : null;
      }
    }
    return id && /^[\w-]{6,15}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

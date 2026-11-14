const ENDPOINT = 'https://graphql.datocms.com/';

const token = import.meta.env.DATOCMS_API_TOKEN as string | undefined;
const environment = import.meta.env.DATOCMS_ENVIRONMENT as string | undefined;
const drafts = import.meta.env.DATOCMS_DRAFTS === 'true';

export const hasDato = Boolean(token);

let warned = false;

/**
 * Query ke DatoCMS Content Delivery API.
 * Tanpa token -> return null (pemanggil memakai data fallback).
 */
export async function dato<T>(query: string): Promise<T | null> {
  if (!token) {
    if (!warned) {
      warned = true;
      console.warn('[datocms] DATOCMS_API_TOKEN kosong — memakai konten contoh (src/lib/fallback.ts).');
    }
    return null;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  if (environment) headers['X-Environment'] = environment;
  if (drafts) headers['X-Include-Drafts'] = 'true';

  const res = await fetch(ENDPOINT, { method: 'POST', headers, body: JSON.stringify({ query }) });
  if (!res.ok) throw new Error(`[datocms] HTTP ${res.status}: ${await res.text()}`);

  const json = (await res.json()) as { data?: T; errors?: unknown[] };
  if (json.errors?.length) throw new Error(`[datocms] ${JSON.stringify(json.errors)}`);
  return json.data ?? null;
}

/** Tambah parameter imgix (resize + format modern) ke URL aset Dato. */
export function img(url: string, width = 800, extra = ''): string {
  if (url.includes('images.unsplash.com')) return `${url}${url.includes('?') ? '&' : '?'}auto=format&fit=crop&q=75&w=${width}`;
  if (!url.includes('datocms-assets.com')) return url;
  return `${url}${url.includes('?') ? '&' : '?'}auto=format&fit=max&w=${width}${extra}`;
}

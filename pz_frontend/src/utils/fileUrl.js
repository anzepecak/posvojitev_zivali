export function fileUrl(file) {
  if (!file) return '';


  const p = file.path ?? '';
  if (!p) return '';


  const normalized = p.startsWith('/') ? p : `/${p}`;


  const api = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
  const base = api.endsWith('/api') ? api.slice(0, -4) : api;

  return `${base}${normalized}`;
}

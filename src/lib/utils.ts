export function byIdxDesc(a: any, b: any) {
  return Number(b.idx || 0) - Number(a.idx || 0);
}

export function byYearDesc(a: any, b: any) {
  return Number(b.year || 0) - Number(a.year || 0) || byIdxDesc(a, b);
}

export function t(ui: Record<string, string>, key: string) {
  return ui[key] ?? key;
}

export function localize(value: any, lang: 'es' | 'en') {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value[lang] || value.es || value.en || '';
  }
  return value ?? '';
}

export function stripHtml(value: string) {
  return String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function authorsHtml(value: string) {
  let html = String(value || '');
  const patterns = [
    /(Antonio\s+M\.?\s+Dur[aá]n(?:-|\s+)Rosal)/giu,
    /(Antonio\s+Manuel\s+Dur[aá]n(?:-|\s+)Rosal)/giu,
    /(A\.?\s*M\.?\s*Dur[aá]n(?:-|\s+)Rosal)/giu,
  ];
  patterns.forEach((pattern) => {
    html = html.replace(pattern, '<span class="bold">$1</span>');
  });
  return html;
}

export function extractQuartile(impact: string) {
  const match = String(impact || '').match(/\b(Q[1-4](?:D[1-4])?)\b/i);
  return match ? match[1].toUpperCase() : 'none';
}

export function quartileBadgeClass(q: string) {
  q = String(q || '').toUpperCase();
  if (q.startsWith('Q1')) return 'is-q1';
  if (q.startsWith('Q2')) return 'is-q2';
  if (q.startsWith('Q3')) return 'is-q3';
  if (q.startsWith('Q4')) return 'is-q4';
  return 'is-none';
}

export function quartileScore(value: string) {
  return ({ Q1D1: 5, Q1: 4, Q2: 3, Q3: 2, Q4: 1, NONE: 0 } as Record<string, number>)[String(value || 'none').toUpperCase()] || 0;
}

export function extractDoi(value: string) {
  try { value = decodeURIComponent(String(value || '')); } catch (_) { value = String(value || ''); }
  const match = value.match(/(10\.\d{4,9}\/[-._;()/:A-Z0-9]+)/i);
  return match ? match[1].replace(/[.,);]+$/, '') : '';
}

export function resourceLinks(row: any, ui: Record<string, string>, includeBibtex = false) {
  const links: Array<{ label: string; href: string; className: string; external?: boolean }> = [];
  const doi = extractDoi(`${row.url || ''} ${row.citation || ''}`);
  if (doi) links.push({ label: t(ui, 'doi'), href: `https://doi.org/${doi}`, className: 'is-doi', external: true });
  if (row.url) {
    links.push({ label: t(ui, 'source'), href: row.url, className: 'is-source', external: true });
    if (/\.pdf([?#].*)?$/i.test(row.url)) links.push({ label: t(ui, 'pdf'), href: row.url, className: 'is-pdf', external: true });
  }
  if (row.title) links.push({ label: t(ui, 'google_scholar'), href: `https://scholar.google.com/scholar?q=${encodeURIComponent(row.title)}`, className: 'is-scholar', external: true });
  if (includeBibtex && row.citation) links.push({ label: t(ui, 'bibtex'), href: '#citation-block', className: 'is-bibtex' });
  return links;
}

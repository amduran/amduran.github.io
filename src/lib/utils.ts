export function byIdxDesc(a: any, b: any) {
  return Number(b.idx || 0) - Number(a.idx || 0);
}

export function byYearDesc(a: any, b: any) {
  return Number(b.year || 0) - Number(a.year || 0) || byIdxDesc(a, b);
}

export function t(ui: Record<string, string>, key: string) {
  return ui[key] ?? key;
}

/** Fills `{name}` placeholders in a UI string. */
export function fmt(template: string, vars: Record<string, string | number>) {
  return String(template || '').replace(/\{(\w+)\}/g, (_, key) => (key in vars ? String(vars[key]) : `{${key}}`));
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

const OWN_NAME_PATTERNS = [
  /(Antonio\s+Manuel\s+Dur[aá]n(?:-|\s+)Rosal)/giu,
  /(Antonio\s+M\.?\s+Dur[aá]n(?:-|\s+)Rosal)/giu,
  /(A\.?\s*M\.?\s*Dur[aá]n(?:-|\s+)Rosal)/giu,
];

/**
 * Normalises an author/supervisor list: removes any inline <span> markup stored in the
 * content files and highlights the site owner's name once.
 */
export function authorsHtml(value: string) {
  let html = String(value || '')
    .replace(/<\/?span[^>]*>/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  for (const pattern of OWN_NAME_PATTERNS) {
    if (pattern.test(html)) {
      pattern.lastIndex = 0;
      html = html.replace(pattern, '<strong class="me">$1</strong>');
      break;
    }
  }
  return html;
}

/** Splits an author string into individual names (for citation meta tags). */
export function authorList(value: string) {
  return stripHtml(value)
    .replace(/\s+(?:and|y)\s+/gi, ', ')
    .split(/\s*,\s*/)
    .map((name) => name.trim())
    .filter(Boolean);
}

export function extractQuartile(impact: string) {
  const match = String(impact || '').match(/\b(Q[1-4](?:D[1-4])?)\b/i);
  return match ? match[1].toUpperCase() : 'none';
}

export function quartileBadgeClass(q: string) {
  q = String(q || '').toUpperCase();
  if (q === 'Q1D1') return 'is-q1d1';
  if (q.startsWith('Q1')) return 'is-q1';
  if (q.startsWith('Q2')) return 'is-q2';
  if (q.startsWith('Q3')) return 'is-q3';
  if (q.startsWith('Q4')) return 'is-q4';
  return 'is-none';
}

export function quartileScore(value: string) {
  return ({ Q1D1: 5, Q1: 4, Q2: 3, Q3: 2, Q4: 1, NONE: 0 } as Record<string, number>)[String(value || 'none').toUpperCase()] || 0;
}

function titleCase(value: string) {
  const small = new Set(['and', 'of', 'the', 'in', 'for', '&']);
  return String(value || '')
    .toLowerCase()
    .split(/(\s+)/)
    .map((word, i) => (i > 0 && small.has(word) ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join('');
}

/**
 * Parses strings such as
 * "JCR(2024): 6.5 Position: 37/204 (Q1) Category: COMPUTER SCIENCE, ARTIFICIAL INTELLIGENCE".
 * Returns null when the string does not follow that pattern.
 */
export function parseImpact(impact: string) {
  const raw = String(impact || '').trim();
  const match = raw.match(/^(JCR|SJR)\s*\((\d{4})\)\s*:\s*([\d.]+),?\s*Position:\s*(\d+\s*\/\s*\d+)\s*\((Q[1-4](?:D[1-4])?)\)\s*Category:\s*(.+)$/i);
  if (!match) return null;
  return {
    index: match[1].toUpperCase(),
    year: match[2],
    value: match[3],
    position: match[4].replace(/\s+/g, ''),
    quartile: match[5].toUpperCase(),
    category: titleCase(match[6].trim()),
  };
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

/** First four-digit year found in a free-text date such as "Sep 2021". */
export function yearOf(value: string | number) {
  const match = String(value ?? '').match(/\d{4}/);
  return match ? match[0] : '';
}

export function isOngoing(value: string) {
  return /current|present|actual|hoy|ongoing/i.test(String(value || ''));
}

/** Compact period for the date gutter: "2021–2024", "2019–hoy", "2018". */
export function periodLabel(start: string, end: string, ui: Record<string, string>) {
  const a = yearOf(start);
  const b = isOngoing(end) ? t(ui, 'present') : yearOf(end);
  if (!a) return b;
  if (!b || a === b) return a;
  return `${a}–${b}`;
}

/** Shortens "2024/2025" to "2024/25". */
export function shortAcademicYear(value: string) {
  const match = String(value || '').match(/^(\d{4})\s*\/\s*(\d{2})(\d{2})$/);
  return match ? `${match[1]}/${match[3]}` : String(value || '');
}

export function formatMoney(value: string | number, lang: 'es' | 'en') {
  const raw = String(value ?? '').trim();
  if (!raw || raw === '-') return '';
  const normalised = raw.includes(',') && !raw.includes('.') ? raw.replace(',', '.') : raw.replace(/,/g, '');
  const amount = Number(normalised);
  if (!Number.isFinite(amount)) return raw;
  return new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Maps the icon class strings stored in profile.json to the inline icon set. */
export function iconForClass(value: string) {
  const v = String(value || '').toLowerCase();
  if (v.includes('linkedin')) return 'linkedin';
  if (v.includes('github')) return 'github';
  if (v.includes('scholar')) return 'scholar';
  if (v.includes('orcid')) return 'orcid';
  if (v.includes('researchgate')) return 'researchgate';
  return 'link';
}

/** Name of a profile link inferred from its URL, used for accessible labels. */
export function profileName(url: string) {
  const u = String(url || '').toLowerCase();
  if (u.includes('linkedin')) return 'LinkedIn';
  if (u.includes('github')) return 'GitHub';
  if (u.includes('scholar.google')) return 'Google Scholar';
  if (u.includes('orcid')) return 'ORCID';
  if (u.includes('researchgate')) return 'ResearchGate';
  return url;
}

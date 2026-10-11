import fs from 'node:fs';
import path from 'node:path';
import { getCollection, getEntry } from 'astro:content';
import { byIdxDesc, byYearDesc } from './utils';

export async function getSite() {
  const entry = await getEntry('site', 'profile');
  if (!entry) throw new Error('Missing src/content/site/profile.json');
  return entry.data;
}

export async function getUi(lang: 'es' | 'en') {
  const entry = await getEntry('ui', lang);
  if (!entry) throw new Error(`Missing src/content/ui/${lang}.json`);
  return entry.data;
}

export async function collectionData(name: any, sorter: (a: any, b: any) => number = byIdxDesc) {
  const entries = await getCollection(name);
  return entries.map((entry: any) => entry.data).sort(sorter);
}

export async function researchItems() {
  const papers = (await collectionData('papers', byYearDesc)).map((row: any) => ({ ...row, kind: 'journal', venue: row.journal }));
  const conferences = (await collectionData('conferences', byYearDesc)).map((row: any) => ({ ...row, kind: 'conference', venue: row.congress }));
  return [...papers, ...conferences].sort(byYearDesc);
}

/**
 * True when a file exists inside `public/` at build time. Used to hide links to
 * optional downloads (for example the CV) until the file is actually added.
 */
export function publicFileExists(relativePath: string) {
  if (!relativePath) return false;
  try {
    return fs.existsSync(path.join(process.cwd(), 'public', relativePath.replace(/^\/+/, '')));
  } catch (_) {
    return false;
  }
}

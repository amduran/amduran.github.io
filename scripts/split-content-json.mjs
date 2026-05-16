import fs from 'node:fs/promises';
import path from 'node:path';

const input = process.argv[2] || 'data/content.json';
const root = process.argv[3] || 'src/content';
const db = JSON.parse(await fs.readFile(input, 'utf8'));

async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

await writeJson(path.join(root, 'site', 'profile.json'), db.site);
for (const [lang, ui] of Object.entries(db.ui || {})) {
  await writeJson(path.join(root, 'ui', `${lang}.json`), ui);
}
for (const [collection, entries] of Object.entries(db.content || {})) {
  if (!Array.isArray(entries)) continue;
  let counter = 1;
  for (const entry of entries) {
    const idx = entry.idx ?? counter;
    const file = `${String(idx).padStart(3, '0')}.json`;
    await writeJson(path.join(root, collection, file), entry.idx ? entry : { idx: counter, ...entry });
    counter += 1;
  }
}

console.log(`Content split into ${root}`);

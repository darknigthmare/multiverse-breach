import { readFileSync, writeFileSync, renameSync, rmSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';

/** A lossy UI projection, never a replacement for the full provenance ledger. */
export function buildSpriteAvailability(manifest) {
  const entries = new Map();
  for (const entry of manifest.entries || []) {
    if (entry.available && typeof entry.output === 'string' && entry.output.startsWith('/')) {
      entries.set(entry.output, entry.source || null);
    }
  }
  const groups = new Map();
  for (const [output, source] of [...entries].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)) {
    if (!groups.has(source)) groups.set(source, []);
    groups.get(source).push(output);
  }
  return { version: 1, count: entries.size, groups: [...groups].map(([source, outputs]) => ({ source, outputs })) };
}

/** Same-directory rename keeps the previous valid JSON if writing fails. */
export function writeAvailabilityAtomic(output, text, fs = { writeFileSync, renameSync, rmSync }) {
  const temporary = new URL(`.${randomUUID()}.sprite-availability.tmp`, output);
  try {
    fs.writeFileSync(temporary, text, { encoding: 'utf8', flag: 'wx' });
    fs.renameSync(temporary, output);
  } finally {
    fs.rmSync(temporary, { force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const manifest = JSON.parse(readFileSync(new URL('../public/sprites/generated/sprite-manifest.json', import.meta.url), 'utf8'));
  const output = new URL('../public/sprites/generated/sprite-availability.json', import.meta.url);
  const text = JSON.stringify(buildSpriteAvailability(manifest)) + '\n';
  if (process.argv.includes('--check')) {
    let current = '';
    try { current = readFileSync(output, 'utf8'); } catch { /* Report a missing index as stale. */ }
    if (current !== text) throw new Error('Sprite availability index stale: run npm run sprites:availability');
    console.log(`Sprite availability: ${JSON.parse(text).count} paths verified against the complete manifest.`);
  } else {
    writeAvailabilityAtomic(output, text);
    console.log(`Wrote sprite availability index (${Buffer.byteLength(text)} bytes).`);
  }
}

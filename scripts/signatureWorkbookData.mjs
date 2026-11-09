import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const TRACKER_COLUMNS = Object.freeze(['Cle inventaire', 'Univers', 'Type', 'ID acteur', 'Nom',
  'Signature source', 'Super melee', 'Invocation native', 'Artefact associe', 'Etat fonctionnel',
  'Fidelite 1:1', 'Reference', 'Vague', 'Projectile', 'Entite autonome', 'Note source']);
export const trackerState = entry => entry.excludedNonCombat ? 'NON_COMBATTANT'
  : entry.authoredSignature || entry.meleeSuper || entry.nativeSummon || entry.equippedInvocation
    ? 'CONTRAT_PARTIEL' : 'A_INTEGRER';

export function buildTracker(coverage, sourceCommit) {
  if (!/^[a-f0-9]{40}$/.test(sourceCommit || '')) throw new TypeError('A full verified source commit is required.');
  if (!coverage || !Array.isArray(coverage.entries)) throw new TypeError('Expected a coverage inventory.');
  const seen = new Set();
  const rows = coverage.entries.map(entry => {
    if (!entry || typeof entry.key !== 'string' || !entry.key || seen.has(entry.key)) throw new TypeError('Missing or duplicate inventory key.');
    seen.add(entry.key);
    if (entry.fidelityApproved || entry.choreographyApproved) throw new TypeError('Art approval needs separate evidence; do not infer it from coverage.');
    return [entry.key, entry.universe, entry.kind, entry.actorId, entry.name, entry.authoredSignature,
      entry.meleeSuper, entry.nativeSummon, entry.equippedInvocation, trackerState(entry),
      'NON_CERTIFIEE', entry.sourceReference, entry.sourceWave, entry.sourceProjectile,
      entry.sourceSummonAgent, entry.sourceNote].map(value => value == null ? '' : String(value));
  });
  return { version: 1, sourceCommit,
    origin: 'Reconstructed from the verified repository coverage, NOT the unidentified original Excel workbook.',
    warning: 'Read-only tracking export. A contract is not a complete moveset or art approval; no row grants powers.',
    columns: TRACKER_COLUMNS, rows };
}

// Excel-compatible semicolon CSV with BOM. Formula-shaped content remains text.
export function trackerCsv(tracker) {
  const escape = value => {
    const text = String(value ?? '');
    const literal = /^[\s\uFEFF]*[=+\-@]/u.test(text) ? `'${text}` : text;
    return `"${literal.replaceAll('"', '""')}"`;
  };
  return '\uFEFF' + [tracker.columns, ...tracker.rows].map(row => row.map(escape).join(';')).join('\r\n') + '\r\n';
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [input, sourceCommit, directory] = process.argv.slice(2);
  if (!input || !sourceCommit || !directory) throw new Error('Usage: node scripts/signatureWorkbookData.mjs coverage.json <40-char-source-commit> <output-directory>');
  const raw = readFileSync(input);
  const tracker = buildTracker(JSON.parse(raw.toString('utf8')), sourceCommit);
  tracker.inventorySha256 = createHash('sha256').update(raw).digest('hex');
  mkdirSync(directory, { recursive: true });
  writeFileSync(path.join(directory, 'SUIVI_RECONSTITUE.json'), JSON.stringify(tracker, null, 2) + '\n');
  writeFileSync(path.join(directory, 'SUIVI_RECONSTITUE.csv'), trackerCsv(tracker));
  console.log(JSON.stringify({ rows: tracker.rows.length, sourceCommit, inventorySha256: tracker.inventorySha256 }));
}

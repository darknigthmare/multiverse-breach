import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CANON_ROSTER_WAVE } from '../src/game/canonRosterWave.js';

const EXPECTED_ENTRY_COUNT = CANON_ROSTER_WAVE.length * 10;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ledgerPath = path.join(
  repositoryRoot,
  'public',
  'sprites',
  'generated',
  'sprite-reference-sources.json'
);

const slugify = value => String(value || 'unknown')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'unknown';

const parseArguments = argv => {
  let check = false;
  for (const argument of argv) {
    if (argument === '--check') {
      check = true;
      continue;
    }
    throw new Error(`Unknown argument: ${argument}`);
  }
  return { check };
};

const threatName = threat => typeof threat === 'string' ? threat : threat?.name;

const textValue = value => {
  if (typeof value === 'string') return value.trim();
  if (!value || typeof value !== 'object') return '';
  return String(value.label || value.name || value.id || value.source || '').trim();
};

const uniqueHttpsUrls = (values, label, { required = false } = {}) => {
  const urls = [];
  for (const value of values.flat(Infinity)) {
    if (value == null || String(value).trim() === '') continue;
    const url = String(value).trim();
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      throw new Error(`${label}: invalid URL ${url}`);
    }
    if (parsed.protocol !== 'https:') throw new Error(`${label}: reference URL must use HTTPS: ${url}`);
    if (!urls.includes(url)) urls.push(url);
  }
  if (required && urls.length === 0) throw new Error(`${label}: at least one HTTPS reference page is required.`);
  return urls;
};

const researchDate = (entry, metadata, label) => {
  const date = String(metadata?.researchDate || metadata?.verifiedAt || entry.researchDate || '').trim();
  if (!DATE_PATTERN.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
    throw new Error(`${label}: research date must use YYYY-MM-DD.`);
  }
  return date;
};

const incarnation = (entry, metadata, label) => {
  const continuity = textValue(metadata?.continuity) || textValue(entry.continuity);
  const visualAnchor = textValue(metadata?.visualAnchor);
  const parts = [...new Set([continuity, visualAnchor].filter(Boolean))];
  if (parts.length === 0) throw new Error(`${label}: continuity or visualAnchor is required.`);
  return parts.join(' | ');
};

const outputPath = ({ kind, universe, id, name }) => {
  const directory = kind === 'hero' ? 'heroes' : 'bosses';
  const entitySlug = slugify(kind === 'hero' ? id : name);
  return `/sprites/generated/${directory}/${slugify(universe)}/${entitySlug}.png`;
};

const makeLedgerEntry = ({ entry, kind, character, id, metadata = {} }) => {
  const label = `${entry.universe} / ${character}`;
  const referencePages = uniqueHttpsUrls(
    [metadata.referenceUrl, entry.referenceUrls || []],
    label,
    { required: true }
  );
  const referenceImages = uniqueHttpsUrls(
    [metadata.referenceImages || []],
    `${label} referenceImages`
  );
  const ledgerEntry = {
    character,
    incarnation: incarnation(entry, metadata, label),
    output: outputPath({ kind, universe: entry.universe, id, name: character }),
    referencePages,
    verifiedAt: researchDate(entry, metadata, label)
  };
  if (referenceImages.length > 0) ledgerEntry.referenceImages = referenceImages;
  return ledgerEntry;
};

const collectWaveEntries = wave => {
  if (!Array.isArray(wave)) throw new Error('CANON_ROSTER_WAVE must be an array.');
  const entries = [];
  for (const entry of wave) {
    const universe = String(entry?.universe || '').trim();
    if (!universe) throw new Error('Every canon roster entry must declare a universe.');

    const heroes = [entry.hero, ...(entry.allies || [])];
    for (const hero of heroes) {
      if (!Array.isArray(hero) || !String(hero[0] || '').trim() || !String(hero[1] || '').trim()) {
        throw new Error(`${universe}: each hero tuple must contain a non-empty id and name.`);
      }
      entries.push(makeLedgerEntry({
        entry,
        kind: 'hero',
        id: String(hero[0]).trim(),
        character: String(hero[1]).trim(),
        metadata: hero[3] && typeof hero[3] === 'object' && !Array.isArray(hero[3]) ? hero[3] : {}
      }));
    }

    const groups = [
      ['enemy', entry.monsters || []],
      ['boss', entry.bosses || []],
      ['worldBoss', entry.worldBoss == null ? [] : [entry.worldBoss]]
    ];
    for (const [kind, threats] of groups) {
      for (const threat of threats) {
        const character = String(threatName(threat) || '').trim();
        if (!character) throw new Error(`${universe}: each ${kind} must declare a name.`);
        entries.push(makeLedgerEntry({
          entry,
          kind,
          character,
          metadata: threat && typeof threat === 'object' && !Array.isArray(threat) ? threat : {}
        }));
      }
    }
  }

  if (entries.length !== EXPECTED_ENTRY_COUNT) {
    throw new Error(`Expected ${EXPECTED_ENTRY_COUNT} canon roster ledger entries; found ${entries.length}.`);
  }
  const outputs = entries.map(entry => entry.output);
  if (new Set(outputs).size !== outputs.length) {
    const seen = new Set();
    const duplicates = [...new Set(outputs.filter(output => {
      if (seen.has(output)) return true;
      seen.add(output);
      return false;
    }))];
    throw new Error(`Duplicate canon roster outputs: ${duplicates.join(', ')}`);
  }
  return entries;
};

const normalizedJson = value => `${JSON.stringify(value, null, 2)}\n`;

const makeUpdatedLedger = (ledger, waveEntries) => {
  if (!ledger || typeof ledger !== 'object' || !Array.isArray(ledger.entries)) {
    throw new Error('sprite-reference-sources.json must contain an entries array.');
  }
  const waveOutputs = new Set(waveEntries.map(entry => entry.output));
  const preservedEntries = ledger.entries.filter(entry => !waveOutputs.has(entry?.output));
  const verifiedDates = waveEntries.map(entry => entry.verifiedAt);
  const updatedAt = [ledger.updatedAt, ...verifiedDates]
    .filter(value => DATE_PATTERN.test(String(value || '')))
    .sort()
    .at(-1);
  return {
    ...ledger,
    updatedAt,
    entries: [...preservedEntries, ...waveEntries]
  };
};

const describeDivergence = (ledger, waveEntries) => {
  const expectedByOutput = new Map(waveEntries.map(entry => [entry.output, normalizedJson(entry)]));
  const currentByOutput = new Map();
  for (const entry of ledger.entries || []) {
    if (!expectedByOutput.has(entry?.output)) continue;
    const matches = currentByOutput.get(entry.output) || [];
    matches.push(normalizedJson(entry));
    currentByOutput.set(entry.output, matches);
  }
  const missing = [];
  const stale = [];
  const duplicate = [];
  for (const [output, expected] of expectedByOutput) {
    const current = currentByOutput.get(output) || [];
    if (current.length === 0) missing.push(output);
    else if (current.length > 1) duplicate.push(output);
    else if (current[0] !== expected) stale.push(output);
  }
  return { missing, stale, duplicate };
};

const main = async () => {
  const { check } = parseArguments(process.argv.slice(2));
  const currentSource = await readFile(ledgerPath, 'utf8');
  const currentLedger = JSON.parse(currentSource);
  const waveEntries = collectWaveEntries(CANON_ROSTER_WAVE);
  const updatedLedger = makeUpdatedLedger(currentLedger, waveEntries);
  const currentNormalized = normalizedJson(currentLedger);
  const updatedSource = normalizedJson(updatedLedger);
  const converged = currentNormalized === updatedSource;

  if (check) {
    const report = {
      status: converged ? 'approved' : 'diverged',
      mode: 'check',
      expectedWaveEntries: EXPECTED_ENTRY_COUNT,
      ...describeDivergence(currentLedger, waveEntries)
    };
    console.log(JSON.stringify(report, null, 2));
    if (!converged) process.exitCode = 1;
    return;
  }

  if (!converged) await writeFile(ledgerPath, updatedSource, 'utf8');
  console.log(JSON.stringify({
    status: 'approved',
    mode: 'write',
    changed: !converged,
    waveEntries: EXPECTED_ENTRY_COUNT,
    preservedEntries: updatedLedger.entries.length - waveEntries.length,
    ledger: path.relative(repositoryRoot, ledgerPath).replaceAll('\\', '/')
  }, null, 2));
};

await main();

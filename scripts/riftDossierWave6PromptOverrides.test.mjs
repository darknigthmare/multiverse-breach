import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { applyWave6ProductionPromptOverrides } from './riftDossierWave6PromptOverrides.mjs';

const hash = value => createHash('sha256').update(value).digest('hex');
const fixture = () => {
  const before = 'original source prompt';
  const entries = [{ id: 34441, famille: 'expanded', mode: 'RPG', nom: { en: 'Outpost' }, boss: 'Patriarch', cheminCibleDedie: '/images/outpost.webp', promptOpenAI: before, ancragesVisuels: ['old'], referenceUrls: [], politiqueReferences: 'project-runtime-lore' }];
  const record = { id: 34441, family: 'expanded', mode: 'RPG', output: '/images/outpost.webp', priorPromptSha256: hash(before), prompt: 'Outpost scene. '.repeat(40), reason: 'Correct the Arctic facility and the unique boss silhouette.', visualAnchors: ['Arctic facility', 'Patriarch'], sources: [{ kind: 'official-url', reference: 'https://killingfloor2.com/overview/', notes: 'Outpost is north of the Arctic Circle.' }] };
  return { entries, record, options: { identities: [{ id: '34441', family: 'expanded', mode: 'RPG', output: record.output }], document: { schemaVersion: 1, batchId: 'assets-rift-dossier-pending-500-wave-6-2026-08-31', corrections: [record] } } };
};
test('explicit correction preserves identity and gameplay while recording precise provenance', () => {
  const { entries, record, options } = fixture();
  applyWave6ProductionPromptOverrides(entries, options);
  assert.equal(entries[0].promptOpenAI, record.prompt);
  assert.equal(entries[0].boss, 'Patriarch');
  assert.equal(entries[0].mode, 'RPG');
  assert.equal(entries[0].promptProductionCorrection.promptSha256, hash(record.prompt));
  assert.equal(entries[0].politiqueReferences, 'authoritative-public');
  assert.deepEqual(entries[0].referenceUrls, ['https://killingfloor2.com/overview/']);
});
test('secondary public evidence remains distinct from official source provenance', () => {
  const { entries, record, options } = fixture();
  record.sources[0].kind = 'reference-url';
  applyWave6ProductionPromptOverrides(entries, options);
  assert.equal(entries[0].politiqueReferences, 'public-crosschecked');
  assert.equal(entries[0].promptProductionCorrection.sources[0].kind, 'reference-url');
});

for (const [label, mutate] of [
  ['duplicate identity', f => f.options.document.corrections.push({ ...f.record })],
  ['outside frozen selection', f => f.options.identities.splice(0)],
  ['source prompt drift', f => { f.entries[0].promptOpenAI = 'changed'; }],
  ['mode drift', f => { f.record.mode = 'Smash'; }],
  ['output drift', f => { f.record.output = '/images/other.webp'; }],
  ['missing operation', f => { f.record.prompt = 'another scene '.repeat(40); }],
  ['missing evidence', f => { f.record.sources = []; }],
  ['insecure reference URL', f => { f.record.sources[0].reference = 'http://killingfloor2.com/'; }],
  ['insecure secondary URL', f => { f.record.sources[0].kind = 'reference-url'; f.record.sources[0].reference = 'http://example.org/'; }],
  ['undisclosed runtime-only lore', f => { f.record.sources[0] = { kind: 'project-canon', reference: 'source.js:1', notes: 'Project staging only.' }; }]
]) test(`invalid ${label} fails before mutating any entry`, () => {
  const f = fixture();
  mutate(f);
  const snapshot = structuredClone(f.entries);
  assert.throws(() => applyWave6ProductionPromptOverrides(f.entries, f.options));
  assert.deepEqual(f.entries, snapshot);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const read = name => readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');
const entry = JSON.parse(read('docs/rift-dossiers/catalog.json')).entrees.find(item => item.id === 34421);

test('34421 retains its operation and project evaluation label without inventing a canonical SARA boss', () => {
  assert.equal(entry.nom.en, 'Dynamic Weather Extraction');
  assert.equal(entry.boss, 'SARA Final Evaluation');
  assert.equal(entry.mode, 'RPG');
  assert.equal(entry.cheminCibleDedie, '/images/rift-dossiers/openai/expanded/stage-34421-dynamic-weather-extraction-v1.webp');
  assert.equal(entry.politiqueReferences, 'authoritative-public');
  assert.deepEqual(entry.referenceUrls, ['https://store.steampowered.com/app/236370/Interstellar_Marines/']);
  assert.match(entry.bossVisualAnchor, /project objective label, not a canonical humanoid boss/);
  assert.match(entry.promptOpenAI, /NOT a canonical boss name/);
});

test('34421 prompt locks closed training hall, infrastructure-only SARA and a readable side-on extraction lane', () => {
  for (const contract of [
    /The Vault.*Groom Lake/, /completely ENCLOSED underground military training hall/,
    /ceiling-mounted weather generators/, /Artificial rain falls inside/,
    /human-scale mechanical CTR humanoid training robots/, /SARA ONLY through distributed abstract sensor lights/,
    /no face, avatar, holographic person, giant robot or alien embodiment of SARA/,
    /small causal breach.*without any emerging entity/,
    /strict orthographic side-on 2\.5D RPG view/, /broad clear horizontal playable lane/,
    /No readable text.*baked UI/, /Landscape 16:9/
  ]) assert.match(entry.promptOpenAI, contract);
  const builder = read('scripts/buildRiftDossierCatalog.mjs');
  assert.match(builder, /promptOverride: stage\.id === 34421 \? INTERSTELLAR_34421_PROMPT :/);
});

test('existing Wave 5 manifests remain pinned, including adjacent dossier 34420', () => {
  const artifacts = [
    ['asset-batch-3-wave-5-rift-dossiers-makeup.json', 'eeb81c4e9dfb65da0ce33ca53b8907ae36439c8de57112e36624d2b3e41d37e3'],
    ['asset-batch-2-wave-5-rift-dossiers-visual-corrections-v1.json', 'd6d4da80f210567998df3c5c822b8b1caa160de9b5640ec1afaac5193e12091c']
  ];
  for (const [file, expected] of artifacts) {
    const bytes = readFileSync(new URL(`../docs/openai-generation-prompts-2026-08-25/${file}`, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), expected);
  }
});

import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

export const base = 'docs/combat-fidelity-wave12-2026-10-23/isaac-sources/browser';
const archive = path.dirname(base);
export const resourcePaths = [
  'src/components/GameCanvas.jsx', 'src/game/engineSmash.js', 'src/game/renderer.js',
  'src/game/spriteAssets.js', 'src/game/melee/meleeCombatRuntime.js',
  'src/game/melee/meleeStateMachine.js', 'src/game/melee/nativeMeleeManifest.js',
  'src/game/melee/isaacMeleeManifest.js',
  'src/game/combat/isaacMeleeMotion.generated.json',
  'src/game/combat/isaacMeleeCombat.generated.json',
  `${archive}/packing-plan.json`, `${archive}/native-hand-points.json`,
  `${archive}/hand-measurements.json`, `${archive}/actual-tool-calls.json`,
  `${archive}/build-native-isaac-atlases.mjs`, `${archive}/normalize-isaac-atlases.mjs`,
  `${archive}/measure-isaac-native-hands.mjs`, `${archive}/verify-isaac-atlases.mjs`,
  ...['motion-a', 'motion-b', 'defense', 'combat-a', 'combat-b', 'ledge'].map(name => `public/sprites/generated/melee-isaac-wave12/isaac-${name}.png`),
  'public/sprites/generated/combat-character-animations-wave12-part-c/isaac.png',
  'public/sprites/generated/combat-character-corrections-wave12-part-c/isaac.png',
];
export async function fingerprint(file) {
  const data = await fs.readFile(file);
  return { path: file, bytes: data.length, sha256: crypto.createHash('sha256').update(data).digest('hex') };
}
export async function resourceSnapshot() {
  return Promise.all(resourcePaths.map(fingerprint));
}
const flowDefinitions = [
  { id: 'core', type: 'controlled-real-renderer', summary: '45 états × 4 poses × 2 orientations ; 8 prises de rebord ; physique inchangée', captures: ['isaac-core.png', 'isaac-grips.png'], traces: ['isaac-core-trace.json'] },
  { id: 'movement', type: 'real-gamecanvas-keyboard', summary: 'D + Espace, maintien D jusqu’au sol, puis Q ; quatre poses par état observé ; pause stable', captures: ['isaac-movement.png', 'isaac-pause.png'], traces: ['isaac-movement-trace.json'] },
  { id: 'super', type: 'real-gamecanvas-keyboard-cold-boot', summary: 'L à 100 %, rangée native 7, charge consommée, impact unique après hitAt, second déclenchement refusé', captures: ['isaac-super.png'], traces: ['isaac-super-trace.json', 'isaac-super-draws.json'] },
  { id: 'physical-ledge', type: 'controlled-real-engine-and-runtime', summary: 'Prise physique, maintien, montée, lâcher, saut et attaque ; deux camps × deux côtés × cinq actions', captures: ['isaac-physical-ledge.png'], traces: [] },
];

export async function collect({ execution = null } = {}) {
  const freezePath = 'docs/combat-fidelity-wave12-2026-10-23/production-freeze.json';
  const freeze = JSON.parse(await fs.readFile(freezePath, 'utf8'));
  assert.equal(freeze.productionFrozen, true);
  const resources = await resourceSnapshot();
  for (const file of resources) if (freeze.files[file.path]) assert.equal(file.sha256, freeze.files[file.path], `${file.path} must match final production freeze`);
  if (execution) assert.ok(Date.parse(execution.startedAt) >= Date.parse(freeze.createdAt), 'Final browser replay must start after the production freeze');
  const flows = [];
  for (const definition of flowDefinitions) {
    const reportPath = `${base}/isaac-${definition.id}-result.json`;
    const report = JSON.parse(await fs.readFile(reportPath, 'utf8'));
    assert.equal(report.passed, true, `${definition.id} must have actually passed`);
    assert.deepEqual(report.pageErrors, []);
    flows.push({ ...definition,
      harness: await fingerprint(`${base}/isaac-${definition.id}-browser.mjs`),
      report: await fingerprint(reportPath),
      captures: await Promise.all(definition.captures.map(file => fingerprint(`${base}/${file}`))),
      traces: await Promise.all(definition.traces.map(file => fingerprint(`${base}/${file}`))),
      engineUrl: report.engineUrl ?? null, rendererUrl: report.rendererUrl ?? null,
    });
  }
  const read = async name => JSON.parse(await fs.readFile(`${base}/isaac-${name}-result.json`, 'utf8'));
  const core = await read('core'), movement = await read('movement'), superResult = await read('super'), ledge = await read('physical-ledge');
  assert.equal(core.states, 45); assert.equal(core.distinctCorePoses, 180);
  assert.equal(core.coreFrameDraws, 360); assert.equal(core.gripFrameDraws, 8);
  assert.equal(core.physicsUnchanged, true);
  for (const state of ['jumpRise', 'fall', 'land', 'turn']) assert.deepEqual(movement.summary[state].columns, [0, 1, 2, 3]);
  assert.equal(movement.pause.unchanged, true);
  assert.deepEqual(superResult.sourceDraws.rows, [7]);
  assert.deepEqual(superResult.sourceDraws.columns, [0, 1, 2, 3]);
  assert.deepEqual(superResult.sourceDraws.sheets, ['/sprites/generated/combat-character-animations-wave12-part-c/isaac.png']);
  assert.equal(superResult.final.hitCount, 1); assert.equal(superResult.sameInput.retriggered, false);
  assert.equal(ledge.caseCount, 20); assert.equal(ledge.attachedDraws, 32);
  return {
    passed: true, generatedAt: new Date().toISOString(), heroId: 'isaac',
    sourceWork: 'Dead Space (2008), original engineering RIG', source1to1Verified: false,
    scope: 'Quatre harnais Chromium : deux parcours GameCanvas par clavier et deux séquences contrôlées du vrai renderer/moteur ; aucune certification officielle 1:1.',
    counts: { flows: 4, states: 45, nativePoses: 180, coreDraws: 360, controlledGripDraws: 8, physicalLedgeCases: 20, physicalGripDraws: 32 },
    limitations: [
      'Les deux orientations utilisent le miroir horizontal du runtime, y compris les asymétries de tenue et d’équipement.',
      'Le parcours de rebord appelle directement applyPhysics et les commandes du runtime ; il ne prétend pas être un parcours clavier GameCanvas.',
      'Le lâcher et le saut peuvent être remplacés rapidement par fall/jumpRise dans la physique actuelle ; la présence des quatre dessins ne certifie pas leur durée naturelle complète.',
      'Les catalogues globaux encore modifiés par les autres lots sont exclus du contrôle de stabilité ; les fichiers moteurs et ressources Isaac sont liés ci-dessous.',
      'Une requête Google Fonts bloquée par le réseau est comptabilisée explicitement dans les rapports concernés.',
    ],
    productionFreeze: { ...await fingerprint(freezePath), createdAt: freeze.createdAt },
    execution, flows, resources,
  };
}

async function main() {
  const target = `${base}/isaac-evidence.json`;
  if (process.argv.includes('--check')) {
    const previous = JSON.parse(await fs.readFile(target, 'utf8'));
    const current = await collect();
    assert.equal(previous.passed, true);
    assert.deepEqual(previous.resources, current.resources, 'Current Isaac/runtime files must match the reviewed browser resources');
    assert.deepEqual(previous.flows, current.flows, 'Harnesses, results, traces and captures must be unchanged');
    assert.deepEqual(previous.productionFreeze, current.productionFreeze, 'Production freeze receipt must stay unchanged');
    assert.equal(previous.execution?.resourcesUnchangedDuringRun, true, 'Evidence must come from the complete runner with before/after hashes');
    console.log(JSON.stringify({ passed: true, checked: target, flows: current.counts.flows }));
  } else {
    throw new Error('Use run-isaac-browser-checks.mjs to execute all four flows before collecting evidence.');
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) await main();

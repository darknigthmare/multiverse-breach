import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

export const base = 'docs/combat-fidelity-wave13-2026-10-24/ripley-sources/browser';
export const FLOW_IDS = Object.freeze(['core', 'movement', 'super', 'physical-ledge']);
const archive = path.dirname(base);
const packing = JSON.parse(await fs.readFile(`${archive}/packing-plan.json`, 'utf8'));
export const resourcePaths = [
  'src/components/GameCanvas.jsx', 'src/game/engineSmash.js', 'src/game/renderer.js',
  'src/game/spriteAssets.js', 'src/game/melee/meleeCombatRuntime.js',
  'src/game/melee/meleeStateMachine.js', 'src/game/melee/nativeMeleeManifest.js',
  'src/game/melee/ripleyMeleeManifest.js', 'src/game/melee/meleeAnimationManifest.js',
  'src/game/combat/characterAnimationCatalog.js', 'src/game/combat/characterSuperVisuals.js',
  'src/game/combat/nativeSuperVisualsWave13.js', 'src/game/combat/nativeSuperAnchorsWave13PartA.generated.json',
  'src/game/combat/characterAnimationsWave13PartA.generated.json',
  'src/game/combat/characterSpriteCorrectionsWave13PartA.generated.json',
  'src/game/combat/combatSourceDefinitionsWave13.js', 'src/game/combat/abilities/abilitiesWave13Definitions.js',
  `${archive}/source-row-review.json`, `${archive}/native-ripley-segmentation.mjs`,
  'src/game/combat/ripleyMeleeMotion.generated.json',
  'src/game/combat/ripleyMeleeCombat.generated.json',
  `${archive}/packing-plan.json`, `${archive}/native-hand-points.json`,
  `${archive}/hand-measurements.json`, `${archive}/actual-tool-calls.json`,
  `${archive}/build-native-ripley-atlases.mjs`, `${archive}/normalize-ripley-atlases.mjs`,
  `${archive}/measure-ripley-native-hands.mjs`, `${archive}/verify-ripley-atlases.mjs`,
  packing.reference.savedImage,
  ...packing.sources.flatMap(source => [source.image, source.promptFile]),
  ...['motion-a', 'motion-b', 'defense', 'combat-a', 'combat-b', 'ledge'].map(name => `public/sprites/generated/melee-ripley-wave13/ripley-${name}.png`),
  'public/sprites/generated/combat-character-animations-wave13-part-a/ripley.png',
  'public/sprites/generated/combat-character-corrections-wave13-part-a/ripley.png',
  ...FLOW_IDS.map(id => `${base}/ripley-${id}-browser.mjs`),
  `${base}/ripley-browser-receipt.mjs`, `${base}/run-ripley-browser-checks.mjs`,
  `${base}/collect-ripley-evidence.mjs`,
];
export async function fingerprint(file) {
  const data = await fs.readFile(file);
  return { path: file, bytes: data.length, sha256: crypto.createHash('sha256').update(data).digest('hex') };
}
export async function resourceSnapshot() {
  return Promise.all(resourcePaths.map(fingerprint));
}
const flowDefinitions = [
  { id: 'core', type: 'controlled-real-renderer', summary: '45 états × 4 poses × 2 orientations ; 8 prises de rebord ; physique inchangée', captures: ['ripley-core.png', 'ripley-grips.png'], traces: ['ripley-core-trace.json'] },
  { id: 'movement', type: 'real-gamecanvas-keyboard', summary: 'D + Espace, maintien D jusqu’au sol, puis Q ; quatre poses par état observé ; pause stable', captures: ['ripley-movement.png', 'ripley-pause.png'], traces: ['ripley-movement-trace.json'] },
  { id: 'super', type: 'real-gamecanvas-keyboard-cold-boot', summary: 'L à 100 %, rangée native 7, charge consommée, impact unique après hitAt, second déclenchement refusé', captures: ['ripley-super.png'], traces: ['ripley-super-trace.json', 'ripley-super-draws.json'] },
  { id: 'physical-ledge', type: 'controlled-real-engine-and-runtime', summary: 'Prise physique, maintien, montée, lâcher, saut et attaque ; deux camps × deux côtés × cinq actions', captures: ['ripley-physical-ledge.png'], traces: [] },
];

const time = value => {
  const parsed = Date.parse(value);
  assert.ok(Number.isFinite(parsed), `Invalid Ripley receipt timestamp: ${value}`);
  return parsed;
};

async function validateExecution(execution, freeze) {
  assert.ok(execution, 'Use the complete runner with real child-close receipts');
  assert.equal(execution.receiptOrigin, 'observed-node-child-process-close-events');
  assert.equal(execution.allBrowserWindowsClosed, true);
  assert.equal(execution.commands.length, FLOW_IDS.length);
  assert.ok(time(execution.startedAt) >= time(freeze.createdAt));
  assert.ok(time(execution.finishedAt) >= time(execution.browserClosedAt));
  assert.equal(execution.resourcesUnchangedDuringRun, true);
  assert.deepEqual(execution.resourcesBefore, execution.resourcesAfter);
  for (const [index, command] of execution.commands.entries()) {
    const id = FLOW_IDS[index], script = `${base}/ripley-${id}-browser.mjs`;
    assert.equal(command.id, id); assert.equal(command.command, `node ${script}`);
    assert.deepEqual(command.argv, [process.execPath, script]);
    assert.equal(command.receiptOrigin, 'node-child-process-close-event');
    assert.equal(command.exitCode, 0); assert.equal(command.signal, null); assert.equal(command.spawnError, null);
    assert.ok(time(command.startedAt) >= time(index ? execution.commands[index - 1].finishedAt : execution.startedAt));
    assert.ok(time(command.finishedAt) >= time(command.startedAt));
    assert.ok(time(command.finishedAt) <= time(execution.finishedAt));
    const log = await fingerprint(command.log);
    assert.equal(log.sha256, command.logSha256);
    const reportPath = `${base}/ripley-${id}-result.json`;
    assert.deepEqual(command.report, await fingerprint(reportPath));
    const report = JSON.parse(await fs.readFile(reportPath, 'utf8'));
    assert.equal(report.passed, true); assert.equal(report.preliminary, false); assert.equal(report.phase, 'final');
    assert.equal(report.receiptOrigin, 'await-browser-close-and-post-close-input-hash');
    assert.equal(report.allBrowserWindowsClosed, true); assert.equal(report.browserConnectedAfterClose, false);
    assert.ok(time(command.startedAt) <= time(report.startedAt));
    assert.ok(time(report.startedAt) <= time(report.browserClosedAt));
    assert.ok(time(report.browserClosedAt) <= time(report.finishedAt));
    assert.ok(time(report.finishedAt) <= time(command.finishedAt));
    assert.equal(command.browserClosedAt, report.browserClosedAt);
    assert.equal(report.productionInputsStableDuringRun, true);
    assert.deepEqual(report.resourcesBefore, report.resourcesAfter);
    assert.deepEqual(report.resourcesAfter, execution.resourcesBefore);
    assert.equal(report.harness, script);
    assert.equal(report.harnessSha256, (await fingerprint(script)).sha256);
    assert.deepEqual(report.pageErrors, []);
    for (const failure of report.failedRequests || []) {
      assert.match(failure.url, /^https:\/\/fonts\.googleapis\.com\//);
      assert.equal(failure.error, 'net::ERR_TUNNEL_CONNECTION_FAILED');
    }
    if (report.consoleErrors) assert.equal(report.consoleErrors.length, (report.failedRequests || []).length);
    const closure = JSON.parse(await fs.readFile(`${base}/ripley-${id}-closure.json`, 'utf8'));
    for (const key of Object.keys(closure)) assert.deepEqual(report[key], closure[key], `${id}: closure receipt differs from final report`);
  }
  assert.equal(execution.browserClosedAt, execution.commands.at(-1).browserClosedAt);
}

export async function collect({ execution = null } = {}) {
  const freezePath = 'docs/combat-fidelity-wave13-2026-10-24/production-freeze.json';
  const freeze = JSON.parse(await fs.readFile(freezePath, 'utf8'));
  assert.equal(freeze.productionFrozen, true);
  const resources = await resourceSnapshot();
  for (const file of resources) assert.equal(file.sha256, freeze.files[file.path], `${file.path} must match final production freeze`);
  await validateExecution(execution, freeze);
  assert.deepEqual(resources, execution.resourcesAfter);
  const flows = [];
  for (const definition of flowDefinitions) {
    const reportPath = `${base}/ripley-${definition.id}-result.json`;
    const report = JSON.parse(await fs.readFile(reportPath, 'utf8'));
    assert.equal(report.passed, true, `${definition.id} must have actually passed`);
    assert.deepEqual(report.pageErrors, []);
    flows.push({ ...definition,
      harness: await fingerprint(`${base}/ripley-${definition.id}-browser.mjs`),
      report: await fingerprint(reportPath),
      captures: await Promise.all(definition.captures.map(file => fingerprint(`${base}/${file}`))),
      traces: await Promise.all([...definition.traces, `ripley-${definition.id}-closure.json`, `ripley-${definition.id}.log`].map(file => fingerprint(`${base}/${file}`))),
      engineUrl: report.engineUrl ?? null, rendererUrl: report.rendererUrl ?? null,
    });
  }
  const read = async name => JSON.parse(await fs.readFile(`${base}/ripley-${name}-result.json`, 'utf8'));
  const core = await read('core'), movement = await read('movement'), superResult = await read('super'), ledge = await read('physical-ledge');
  assert.equal(core.states, 45); assert.equal(core.distinctCorePoses, 180);
  assert.equal(core.coreFrameDraws, 360); assert.equal(core.gripFrameDraws, 8);
  assert.equal(core.physicsUnchanged, true);
  for (const state of ['jumpRise', 'fall', 'land', 'turn']) assert.deepEqual(movement.summary[state].columns, [0, 1, 2, 3]);
  assert.equal(movement.pause.unchanged, true);
  assert.deepEqual(superResult.sourceDraws.rows, [7]);
  assert.deepEqual(superResult.sourceDraws.columns, [0, 1, 2, 3]);
  assert.deepEqual(superResult.sourceDraws.sheets, ['/sprites/generated/combat-character-animations-wave13-part-a/ripley.png']);
  assert.equal(superResult.final.hitCount, 1); assert.equal(superResult.sameInput.retriggered, false);
  assert.equal(ledge.caseCount, 20); assert.equal(ledge.attachedDraws, 32);
  for(const entry of ledge.cases.filter(entry=>['drop','jump'].includes(entry.action))){
    assert.deepEqual(entry.columns,[0,1,2,3]);
    assert.ok(entry.captured.naturalExit.length>=23,'Exit timeline must come from natural fixed ticks');
  }
  return {
    passed: true, generatedAt: new Date().toISOString(), heroId: 'ripley',
    preliminary: false, phase: 'final', allBrowserWindowsClosed: true,
    sourceWork: 'Aliens (1986), Ellen Ripley before the power-loader fight, M41A', source1to1Verified: false,
    scope: 'Quatre harnais Chromium : deux parcours GameCanvas par clavier et deux séquences contrôlées du vrai renderer/moteur ; aucune certification officielle 1:1.',
    counts: { flows: 4, states: 45, nativePoses: 180, coreDraws: 360, controlledGripDraws: 8, physicalLedgeCases: 20, physicalGripDraws: 32 },
    limitations: [
      'Les deux orientations utilisent le miroir horizontal du runtime, y compris les asymétries de tenue et d’équipement.',
      'Le parcours de rebord appelle directement applyPhysics et les commandes du runtime ; il ne prétend pas être un parcours clavier GameCanvas.',
      'Les quatre poses de lâcher et de saut avancent naturellement avec la physique ; une collision, une attaque, une reprise légale ou une commande explicite peuvent interrompre la séquence.',
      'Les moteurs, catalogues de rendu, ressources Ripley et ancres M41A part A sont liés aux empreintes de ce rejeu après gel.',
      'Une requête Google Fonts bloquée par le réseau est comptabilisée explicitement dans les rapports concernés.',
    ],
    productionFreeze: { ...await fingerprint(freezePath), createdAt: freeze.createdAt },
    execution, flows, resources,
  };
}

async function main() {
  const target = `${base}/ripley-evidence.json`;
  if (process.argv.includes('--check')) {
    const previous = JSON.parse(await fs.readFile(target, 'utf8'));
    const current = await collect({ execution: previous.execution });
    assert.equal(previous.passed, true);
    assert.deepEqual(previous.resources, current.resources, 'Current Ripley/runtime files must match the reviewed browser resources');
    assert.deepEqual(previous.flows, current.flows, 'Harnesses, results, traces and captures must be unchanged');
    assert.deepEqual(previous.productionFreeze, current.productionFreeze, 'Production freeze receipt must stay unchanged');
    assert.equal(previous.execution?.resourcesUnchangedDuringRun, true, 'Evidence must come from the complete runner with before/after hashes');
    console.log(JSON.stringify({ passed: true, checked: target, flows: current.counts.flows }));
  } else {
    throw new Error('Use run-ripley-browser-checks.mjs to execute all four flows before collecting evidence.');
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) await main();

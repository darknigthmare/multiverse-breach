import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { getMeleeAnimationManifest } from '../../../src/game/melee/meleeAnimationManifest.js';
const directory = 'docs/combat-fidelity-wave13-2026-10-24/ripley-sources';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const read = async path => JSON.parse(await fs.readFile(path, 'utf8'));
const historicalIds = ['cloud_ff7', 'tifa_ff7', 'goku_dbz', 'vegeta_dbz', 'sonic_hedgehog', 'ragna', 'kiryu_yakuza', 'chris_redfield', 'neo', 'freeman', 'buffy_summers', 'arthur_kaamelott', 'isaac'];
const previous = Object.fromEntries(historicalIds.map(id => [id, { sha256: hash(JSON.stringify(getMeleeAnimationManifest(id))), manifest: getMeleeAnimationManifest(id) }]));
if (Object.values(previous).some(record => !record.manifest)) throw new Error('Missing pre-existing manifest');
const beforePath = `${directory}/previous-thirteen-manifests-before.json`;
try { if (JSON.stringify(await read(beforePath)) !== JSON.stringify(previous)) throw new Error('Historical manifest snapshot drift'); }
catch (error) { if (error.code === 'ENOENT') await fs.writeFile(beforePath, JSON.stringify(previous, null, 2) + '\n'); else throw error; }

const actualStates = {
  'ripley-motion-a': ['idle', 'walk', 'run', 'turn', 'jumpRise', 'jumpApex', 'fall'],
  'ripley-motion-b': ['fastFall', 'land', 'crouchEnter', 'crouchIdle', 'crouchExit', 'taunt1', 'hitStun'],
  'ripley-defense': ['shieldEnter', 'shieldHold', 'shieldHit', 'shieldBreak', 'shieldExit', 'dead', 'defeat'],
  'ripley-combat-a': ['attackLight1', 'attackLight2', 'attackLight3', 'chargeStart', 'chargeLoop', 'chargeRelease', 'discardedIncompleteChargeRecovery'],
  'ripley-combat-b': ['attackRecovery', 'special', 'aerialNeutral', 'aerialForward', 'intro', 'victory', 'discardedIncorrectLedgeAttack'],
  'ripley-ledge': ['ledgeCatch', 'ledgeHang', 'discardedIncompleteLedgeClimb', 'ledgeDrop', 'uprightCalibration', 'discardedCroppedGripStudy', 'discardedCroppedSlingStudy'],
  'ripley-corrective-movement': ['jumpStart', 'crouchCharge', 'perfectShield', 'uprightCalibration'],
  'ripley-corrective-combat': ['chargeRecovery', 'crouchLight', 'aerialDown', 'ledgeAttack'],
  'ripley-corrective-ledge': ['ledgeClimb', 'ledgeJump', 'uprightCalibration', 'reservedGripStudy']
};
const calibrations = {
  'ripley-motion-a': [0, 0, 160, 18, 102, 208],
  'ripley-motion-b': [5, 0, 84, 1020, 134, 264],
  'ripley-defense': [4, 3, 849, 939, 111, 248],
  'ripley-combat-a': [3, 0, 46, 708, 160, 219],
  'ripley-combat-b': [5, 0, 76, 1100, 128, 254],
  'ripley-ledge': [4, 0, 90, 901, 102, 232],
  'ripley-corrective-movement': [3, 0, 72, 1148, 157, 367],
  'ripley-corrective-combat': [0, 3, 816, 47, 156, 387],
  'ripley-corrective-ledge': [2, 0, 68, 798, 124, 363]
};
const sources = Object.entries(actualStates).map(([id, states]) => {
  const [row, column, x, y, width, height] = calibrations[id];
  return { id, image: `${directory}/${id}.native.png`, states, promptFile: `${directory}/${id}.prompt.txt`,
    calibration: { reviewed: true, state: states[row], row, column, bodyBounds: { x, y, width, height },
      nativeStandingBodyHeight: height, raisedArmsExcluded: true,
      reason: 'Manually reviewed complete upright crown-to-sneaker-sole vertical interval; width excludes extended rifle where needed. No raised palm, sling, barrel or flash is used as body height. One uniform scale for this whole native source.' } };
});
const initialPlan = await read('docs/combat-fidelity-wave12-2026-10-23/isaac-sources/packing-plan.json');
const corrections = new Map();
for (const source of sources) for (const [row, state] of source.states.entries()) {
  if (state.startsWith('discarded') || state.startsWith('reserved') || state === 'uprightCalibration') continue;
  if (corrections.has(state)) throw new Error('Duplicate reviewed Ripley state: ' + state);
  corrections.set(state, { sourceId: source.id, row });
}
const atlases = initialPlan.atlases.map(old => {
  const id = old.id.replace('isaac-', 'ripley-');
  const selection = Object.fromEntries(old.states.map(state => {
    const selected = corrections.get(state);
    if (!selected) throw new Error('No real native Ripley state: ' + state);
    return [state, selected];
  }));
  return { id, batch: old.batch, states: old.states, selection,
    ...(id === 'ripley-combat-a' ? { discardedRows: [{ sourceImage: `${directory}/ripley-combat-a.native.png`, nativeRow: 6, poses: 4, reason: 'Sneakers clip the original source bottom; replaced by newly drawn corrective chargeRecovery.' }] } : {}),
    ...(id === 'ripley-combat-b' ? { discardedRows: [{ sourceImage: `${directory}/ripley-combat-b.native.png`, nativeRow: 6, poses: 4, reason: 'Low rifle aim does not depict the selected physical ledgeAttack; replaced by newly drawn forearm shove.' }] } : {}),
    ...(id === 'ripley-ledge' ? { discardedRows: [
      { sourceImage: `${directory}/ripley-ledge.native.png`, nativeRow: 2, poses: 4, reason: 'Incomplete body in a candidate climb and insufficient ascent; all four replaced by real corrective climb.' },
      { sourceImage: `${directory}/ripley-ledge.native.png`, nativeRow: 4, poses: 4, reason: 'Complete upright calibration only, not a game-state row.' },
      { sourceImage: `${directory}/ripley-ledge.native.png`, nativeRow: 5, poses: 4, reason: 'Cropped torso study, never counted as a complete pose.' },
      { sourceImage: `${directory}/ripley-ledge.native.png`, nativeRow: 6, poses: 4, reason: 'Cropped torso study, never counted as a complete pose.' }
    ] } : {}) };
});
const cfg = {
  heroId: 'ripley', registryStem: 'ripley', universe: 'Alien', sourceWork: 'Aliens (1986), Ellen Ripley before the power-loader fight',
  sourceReference: 'https://www.20thcenturystudios.com/movies/aliens', date: '2026-10-24',
  archiveDir: directory, outputDir: 'public/sprites/generated/melee-ripley-wave13',
  reference: { asset: 'docs/combat-fidelity-wave13-2026-10-24/part-a/sources/ripley-native-original.png', savedImage: `${directory}/ripley-identity-reference-original.png` },
  correctionId: null, sources, atlases,
  visualReview: { complete: false,
    outfit: 'Adult Aliens1986 Ripley, short curly brown hair, blue-gray work clothes with rolled sleeves, dark webbing, light sneakers; no power loader or other-film costume.',
    weapons: 'M41A pulse rifle, only conventional brief barrel flashes on declared shot rows; physically slung back/hip on motion, guard and ledge states with free bare palms.',
    limitations: ['Original generated adaptation, not official source frames or certified1:1.', 'Native opposite facing uses a runtime horizontal mirror, including costume asymmetry.', 'Shared platform-fighter charge, guard, kicks and aerial motion are explicit physical gameplay adaptations.'] },
  incompleteInitialSources: Object.entries(actualStates).filter(([id]) => !id.includes('corrective')).map(([id, rows]) => ({ id, expectedRows: 8, actualRows: rows.length, missingOrRejectedStates: initialPlan.atlases.find(spec => spec.id.replace('isaac-', 'ripley-') === id).states.filter(state => !rows.includes(state)) }))
};
await fs.writeFile(`${directory}/packing-plan.json`, JSON.stringify(cfg, null, 2) + '\n');

const calls = await read(`${directory}/actual-tool-calls.json`);
for (const call of calls) {
  const segmentation = await read(`${directory}/${call.id}.segmentation.json`);
  call.sourceSha256 = segmentation.sha256;
  call.observedRows = segmentation.actualSegmentedRows;
  call.observedRowCounts = actualStates[call.id].map(() => 4);
  call.observedCompleteRowCounts = call.observedRowCounts.map((n, index) => call.id === 'ripley-combat-a' && index === 6 ? 0
    : call.id === 'ripley-ledge' && index === 2 ? 3 : call.id === 'ripley-ledge' && index >= 5 ? 0 : n);
  call.observedNativePoses = call.observedCompleteRowCounts.reduce((sum, count) => sum + count, 0);
  call.observedSegmentedBodies = segmentation.frames.length;
  call.review = { actualStateOrder: actualStates[call.id],
    retainedStateRows: atlases.flatMap(atlas => Object.entries(atlas.selection).filter(([, spec]) => spec.sourceId === call.id).map(([state, spec]) => ({ state, row: spec.row }))),
    canvasClippedFrames: segmentation.frames.filter(frame => frame.canvasClipped).map(frame => [frame.nativeRow, frame.nativeColumn]),
    noOriginalReferencePoseReused: true };
}
await fs.writeFile(`${directory}/actual-tool-calls.json`, JSON.stringify(calls, null, 2) + '\n');
console.log(JSON.stringify({ sources: sources.length, states: corrections.size, atlases: atlases.length, poses: atlases.reduce((sum, atlas) => sum + atlas.states.length * 4, 0), previousManifestsPreserved: historicalIds.length }));

/** Independent, bounded read-only probe of the final FPS source adapter. */
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(process.argv[2] || process.cwd());
const out = process.argv[3];
assert.ok(out, 'Pass the JSON report destination');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const sourcePath = 'src/game/extinctionFighterProfiles.js';
const sourceCommit = '5667556bfb3d00e2cf9959c3d22c3038712cd5a2';
const expectedSha256 = '4ffe9ec65bd4ceb0997fe954d58542c5a19b50532c16cdb9e09f593570dae6fc';
const beforeSourceHash = sha(readFileSync(path.join(root, sourcePath)));
assert.equal(beforeSourceHash, expectedSha256);
const gitRead = args => execFileSync('git', args, { cwd: root,
  env: { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_OPTIONAL_LOCKS: '0' }, maxBuffer: 4 * 1024 * 1024 });
const frozenGitSha256 = sha(gitRead(['cat-file', 'blob', `${sourceCommit}:${sourcePath}`]));
assert.equal(frozenGitSha256, beforeSourceHash);
const gitBlobOid = gitRead(['rev-parse', `${sourceCommit}:${sourcePath}`]).toString().trim();
const load = file => import(pathToFileURL(path.join(root, file)).href);
const { HEROES_DB } = await load('src/game/heroes.js');
const { createPlayerHero } = await load('src/game/playerHero.js');
const { adaptExtinctionSourceAction, getExtinctionFighterProfile } = await load(sourcePath);
const { createExtinctionProtocolState, activateExtinctionProtocol } = await load('src/game/extinctionSignatures.js');
const heroes = [createPlayerHero(), ...HEROES_DB];
const snapshot = JSON.stringify(heroes);
const expectedIds = ['marcus', 'masterchief', 'dom', 'cole', 'anya_stroud', 'hoffman_cog', 'carmine_cog',
  'carver', 'ellie', 'zach_hammond', 'bill_l4d', 'ellis_l4d', 'coach_l4d', 'nick_l4d', 'baird', 'kait_diaz'].sort();
const bound = heroes.filter(hero => getExtinctionFighterProfile(hero).signature?.actions.simple?.sourceBallisticCompatibility);
assert.deepEqual(bound.map(hero => hero.id).sort(), expectedIds);
const ownerPath = 'docs/assets/p0-p1-p2-continuation-02-2026-11-13/validation/extinction-final-inventory-freeze3.json';
const ownerBytes = readFileSync(path.join(root, ownerPath));
const owner = JSON.parse(ownerBytes);
assert.deepEqual(owner.ballisticBindings.map(row => row.id).sort(), expectedIds);
const actualKinds = {}, actualBadBindings = [], actualSupportAmmo = [];
let eligible = 0, actions = 0;
for (const hero of heroes) {
  const profile = getExtinctionFighterProfile(hero);
  if (!profile.eligible) continue;
  eligible++;
  for (const [slot, action] of Object.entries(profile.signature.actions)) {
    actions++;
    actualKinds[action.kind] = (actualKinds[action.kind] || 0) + 1;
    if (['energy', 'rocket', 'plasma', 'magic', 'laser', 'beam', 'water', 'cannon_aoe'].includes(action.sourceType)
      && (action.kind === 'hitscan' || action.sourceBallisticCompatibility)) actualBadBindings.push(`${hero.id}.${slot}`);
    if (['guard', 'buff', 'heal', 'support'].includes(action.kind) && action.resource === 'ammo') actualSupportAmmo.push(`${hero.id}.${slot}`);
  }
}
assert.equal(heroes.length, 1912); assert.equal(eligible, 1811); assert.equal(actions, 7244);
assert.deepEqual(actualBadBindings, []); assert.deepEqual(actualSupportAmmo, []);
const positives = [];
const negativeTypes = ['energy', 'rocket', 'plasma', 'magic', 'laser', 'beam', 'water', 'cannon_aoe'];
let nonballisticTypeCases = 0, supportCases = 0, discriminatorCases = 0;
const mutateCases = [
  ['identity', h => { h.id += '_foreign'; }],
  ['universe', h => { h.universe = 'Foreign'; }],
  ['incarnation', h => { h.incarnation += ' custom'; }],
  ['name', h => { h.name += ' custom'; }],
  ['reference', h => { h.referenceUrl += '?custom'; }],
  ['equipment', h => { h.equipment = ['Unknown physical firearm']; }],
  ['weapon', h => { h.weaponType = 'energy'; }],
  ['revision', h => { h[['Gears of War', 'Dead Space'].includes(h.universe) ? 'sourceFidelityAudit' : 'sourceContractRevision'] += '-foreign'; }],
  ['extra RPG profile', h => { h.simple.rpgProfile = { effect: 'damage', delivery: 'projectile' }; }],
  ['extra attack profile', h => { h.simple.attackProfile = { effect: 'damage', delivery: 'projectile' }; }],
  ['extra targeting key', h => { h.simple.targeting.unknown = true; }],
  ['missing own hitAt', h => { const value = h.simple.hitAt; delete h.simple.hitAt; Object.setPrototypeOf(h.simple, { hitAt: value }); }]
];
for (const hero of bound) {
  const profile = getExtinctionFighterProfile(hero);
  const action = profile.signature.actions.simple;
  assert.equal(action.kind, 'hitscan'); assert.equal(action.resource, 'ammo');
  const state = { phase: 'running', runId: 'independent-freeze3', heroId: hero.id, heroCategory: hero.category,
    hp: 20, maxHp: 120, px: 0, py: 0, angle: 0, t: 0, kills: 0, ammo: 24, reserveAmmo: 72,
    weapon: { type: 'pistol', ammo: 24, maxAmmo: 24, resource: 'ammo' },
    enemies: [{ id: 'target', kind: 'Traqueur', wx: 0, wy: 1, hp: 500, maxHp: 500, size: 1 }],
    protocols: createExtinctionProtocolState(profile.signature, 'independent-freeze3') };
  assert.equal(activateExtinctionProtocol(state, 'simple').activated, true);
  assert.equal(state.ammo, 23); assert.equal(state.weapon.ammo, 23);
  assert.equal(state.enemies[0].hp, 500 - action.damage);
  assert.equal(state.protocols.projectiles.length, 0);
  positives.push({ id: hero.id, universe: hero.universe, resource: action.resource, kind: action.kind,
    ammoBefore: 24, ammoAfter: state.ammo, appliedDamage: 500 - state.enemies[0].hp });
  for (const type of negativeTypes) {
    const clone = structuredClone(hero); clone.simple.type = type;
    const rejected = adaptExtinctionSourceAction(clone, 'simple');
    assert.ok(!rejected.sourceBallisticCompatibility, `${hero.id}: ${type}`);
    assert.notEqual(rejected.kind, 'hitscan'); assert.equal(rejected.resource, 'cooldown');
    nonballisticTypeCases++;
  }
  for (const effect of ['guard', 'buff', 'heal', 'support']) {
    const clone = structuredClone(hero); clone.simple.targeting.effect = effect;
    const rejected = adaptExtinctionSourceAction(clone, 'simple');
    assert.equal(rejected.kind, effect); assert.equal(rejected.damage, 0);
    assert.equal(rejected.resource, 'cooldown'); assert.ok(!rejected.sourceBallisticCompatibility);
    supportCases++;
  }
  for (const [label, mutate] of mutateCases) {
    const clone = structuredClone(hero); mutate(clone);
    const rejected = adaptExtinctionSourceAction(clone, 'simple');
    assert.ok(!rejected.sourceBallisticCompatibility, `${hero.id}: ${label}`);
    assert.equal(rejected.kind, 'projectile'); assert.equal(rejected.resource, 'cooldown');
    discriminatorCases++;
  }
}
assert.equal(JSON.stringify(heroes), snapshot);
assert.equal(sha(readFileSync(path.join(root, sourcePath))), beforeSourceHash);
const report = {
  schemaVersion: 1,
  scope: 'Independent native read-only probe of final FPS adapter bindings and classification; no browser, Vite, media loading, source edits or second actor export.',
  sourceCommit,
  source: { path: sourcePath, sha256: beforeSourceHash, gitBlobOid, frozenGitSha256,
    workingBytesEqualFrozenGit: true, unchangedDuringProbe: true },
  command: [process.execPath, '--max-old-space-size=1024', '--no-warnings', '--loader',
    './scripts/sourceSceneTestLoader.mjs', path.relative(root, new URL(import.meta.url).pathname), root, out],
  scriptSha256: sha(readFileSync(new URL(import.meta.url))),
  ownerInventory: { path: ownerPath, sha256: sha(ownerBytes), bindingIdsAgree: true },
  actualCatalog: { characters: heroes.length, eligible, actions, kinds: actualKinds,
    unsafeEnergyOrRocketBindings: actualBadBindings, supportActionsConsumingAmmo: actualSupportAmmo },
  exactBindingCount: positives.length, positiveActivations: positives,
  negativeCases: { changedSourceTypes: nonballisticTypeCases, types: negativeTypes,
    explicitSupportEffects: supportCases, actorAndCustomProfileDiscriminators: discriminatorCases,
    testedDiscriminators: mutateCases.map(row => row[0]) },
  sourceRecordsUnchanged: true,
  decision: 'ACCEPT_BOUNDED_FPS_BINDINGS',
  limits: [
    'Positive activation witnesses cover exactly the 16 reviewed bindings; the 7,244-action catalog scan checks mapping, not 7,244 full simulated activations.',
    'FPS guard duration and reduction now expose selected source tuning; this report does not assert deep equality with historical FPS profiles or official timing fidelity.',
    'RPG/melee profile preservation is a separate cohort audit and is not inferred from the FPS checks.',
    'No visual, animation, art or full-actor 1:1 approval.'
  ],
  fullActorClosures: 0, artApprovals: 0, visual1to1Verified: false
};
writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ exactBindings: positives.length, catalogActions: actions,
  negativeCases: nonballisticTypeCases + supportCases + discriminatorCases, decision: report.decision }));

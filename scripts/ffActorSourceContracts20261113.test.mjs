import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { HEROES_DB, EVENT_ITEMS_DB } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { resolveCombatAbility } from '../src/game/combatIdentity.js';
import { buildActorFidelityBacklog } from '../src/game/actorFidelityBacklog.js';
import { prepareSourceSignature, resolveSourceSignature } from '../src/game/signatureSourceKits.js';
import { installSignatureDirector } from '../src/game/signatureDirector.js';
import { EngineRpg } from '../src/game/engineRpg.js';
import { EngineSmash } from '../src/game/engineSmash.js';
import { EngineTactics } from '../src/game/engineTactics.js';
import { DLC_PACK_MANIFESTS } from '../DLC/index.js';
import { createDlcProfileTransformer } from './dlcProfileTransform.mjs';
import { fileURLToPath } from 'node:url';

const folder = new URL('../docs/assets/p0-p1-p2-continuation-2026-11-13/ff-lot-040/', import.meta.url);
const read = file => JSON.parse(fs.readFileSync(new URL(file, folder)));
const plan = read('plan.json');
const baseline = read('runtime-before.json').rows;
const declarations = read('source-declarations.json');
const clone = value => structuredClone(value);
const current = row => row.actor.id
  ? HEROES_DB.find(actor => actor.id === row.actor.id && actor.universe === row.actor.universe)
  : { ...ENEMIES_DB[row.actor.universe][row.backlog.kind === 'boss' ? 'bosses' : 'monsters'].find(actor => actor.name === row.actor.name), universe: row.actor.universe };
const heroes = baseline.filter(row => row.backlog.kind === 'hero');
const aliases = heroes.filter(row => current(row).sourceSignatureDeclaration);
const codes = row => row.tasks.map(task => task.code);

test('frozen forty identities have exact editions, references and bounded contracts without art approval', () => {
  assert.equal(plan.selectionFrozenBeforeEdits, true);
  assert.equal(baseline.length, 40);
  assert.equal(new Set(baseline.map(row => row.actorKey)).size, 40);
  assert.equal(heroes.length, 28);
  assert.equal(aliases.length, 18);
  for (const row of baseline) {
    const actor = current(row);
    assert.ok(actor, row.actorKey);
    assert.equal(actor.name, row.actor.name);
    for (const field of ['id', 'hp', 'atk', 'def', 'spd', 'color', 'category']) assert.deepEqual(actor[field], row.actor[field], `${row.actorKey}:${field}`);
    assert.ok(actor.incarnation.includes('Final Fantasy '));
    assert.match(actor.referenceUrl, /^https:\/\//);
    assert.ok(actor.visualAnchor.length > 80);
    assert.equal(actor.source1to1Verified, false);
    assert.equal(actor.artApproved, false);
    assert.equal(actor.gameplayAdaptation, true);
    const after = buildActorFidelityBacklog(actor, { kind: row.backlog.kind, rasterProbes: row.backlog.rasterProbes });
    for (const code of ['INCARNATION_UNSPECIFIED', 'REFERENCE_MISSING', 'VISUAL_CONTRACT_MISSING', 'GENERIC_TECHNIQUE_NAMES']) assert.equal(codes(after).includes(code), false, `${row.actorKey}:${code}`);
    for (const code of codes(row.backlog).filter(code => !['INCARNATION_UNSPECIFIED', 'REFERENCE_MISSING', 'VISUAL_CONTRACT_MISSING', 'GENERIC_TECHNIQUE_NAMES'].includes(code))) assert.ok(codes(after).includes(code), `${row.actorKey} must keep ${code}`);
    assert.deepEqual(after.rasterPaths, row.backlog.rasterPaths);
    assert.deepEqual(after.missingRasterPaths, row.backlog.missingRasterPaths);
    assert.equal(after.artApproved, false);
  }
});

test('canonical four-slot combat semantics remain unchanged for all twenty-eight heroes', () => {
  const semantics = value => Object.fromEntries(Object.entries(value).filter(([key]) => !['sourceAbility', 'provenance'].includes(key)));
  for (const row of heroes) for (const slot of ['simple', 'secondary', 'defense', 'special']) {
    const after = resolveCombatAbility(current(row), slot);
    assert.deepEqual(semantics(after), semantics(row.resolved[slot]), `${row.actor.id}:${slot}`);
  }
});

test('all forty actors preserve their source kit, prepared special and resolved prepared semantics', () => {
  let preparedCount = 0;
  const semantics = value => Object.fromEntries(Object.entries(value).filter(([key]) => !['sourceAbility', 'provenance'].includes(key)));
  for (const row of baseline) {
    const before = clone(row.actor), after = clone(current(row));
    const oldKit = prepareSourceSignature(before), newKit = prepareSourceSignature(after);
    assert.equal(newKit, oldKit, row.actorKey);
    if (oldKit) { preparedCount++; assert.deepEqual(after.special, before.special, row.actorKey); }
    if (row.backlog.kind === 'hero') for (const slot of ['simple', 'secondary', 'defense', 'special']) assert.deepEqual(semantics(resolveCombatAbility(after, slot)), semantics(resolveCombatAbility(before, slot)), `${row.actorKey}:${slot}:prepared`);
  }
  assert.equal(preparedCount, 21);
});

test('eighteen declared current labels retain the identical legacy source kit and prepared special', () => {
  for (const row of aliases) {
    const before = clone(row.actor), after = clone(current(row));
    const oldKit = prepareSourceSignature(before), newKit = prepareSourceSignature(after);
    assert.ok(oldKit, row.actor.id);
    assert.equal(newKit, oldKit, row.actor.id);
    assert.deepEqual(after.special, before.special, row.actor.id);
    assert.equal(prepareSourceSignature(after), oldKit);
    assert.equal(after.sourceSignature.key, before.sourceSignature.key);
  }
});

test('declaration compatibility rejects changed identities, labels, editions and custom signatures', () => {
  for (const row of aliases) {
    const actor = current(row);
    for (const key of Object.keys(actor.sourceSignatureDeclaration)) {
      const bad = clone(actor); bad.sourceSignatureDeclaration[key] += '-other';
      assert.equal(resolveSourceSignature(bad), null, `${actor.id}:${key}`);
    }
    for (const change of [
      bad => { delete bad.sourceSignatureDeclaration; },
      bad => { delete bad.sourceSignatureDeclaration.audit; },
      bad => { bad.sourceSignatureDeclaration.extra = true; },
      bad => { bad.sourceSignatureDeclaration = Object.create(bad.sourceSignatureDeclaration); },
      bad => { bad.sourceSignatureDeclaration = []; },
      bad => { bad.universe = 'Final Fantasy X'; },
      bad => { bad.sourceUniverse = 'Final Fantasy X'; },
      bad => { bad.id += '_different'; },
      bad => { bad.incarnation += ' Remake'; },
      bad => { bad.special.name += ' Custom'; },
      bad => { bad.special.smashProfile = {}; },
      bad => { bad.special.rpgProfile = {}; },
      bad => { bad.canonCombatPresentation = true; },
      bad => { bad.smashAttacks = { special: {} }; },
      bad => { bad.rpgAttacks = { special: {} }; }
    ]) { const bad = clone(actor); change(bad); assert.equal(resolveSourceSignature(bad), null, actor.id); }
    const legacy = clone(row.actor); delete legacy.sourceSignatureDeclaration;
    assert.ok(resolveSourceSignature(legacy), `${actor.id}: old API`);
  }
});

test('equipment changes affect the actual tactics role resolver instead of generic ranged defaults', () => {
  const role = actor => EngineTactics.prototype.getEnemyTacticsRole.call({}, actor);
  for (const [name, beforeRole, afterRole] of [['Midgar Zolom', 'shooter', 'monster'], ['Galbadian Soldier', 'monster', 'monster'], ['MT Trooper', 'monster', 'shooter']]) {
    const row = baseline.find(record => record.actor.name === name);
    assert.equal(role(row.actor), beforeRole, name);
    assert.equal(role(current(row)), afterRole, name);
  }
  assert.equal(current(baseline.find(row => row.actor.name === 'Galbadian Soldier')).weapon, 'sword');
  for (const [id, weapon] of [['aerith_ff7', 'staff'], ['quistis_ff8', 'whip'], ['selphie_ff8', 'nunchaku'], ['lunafreya_ff15', 'staff']]) assert.equal(HEROES_DB.find(actor => actor.id === id).weaponType, weapon);
});

const foe = { id: 'ff-contract-foe', name: 'FF contract target', universe: 'Nexus de Convergence', hp: 20000, atk: 1, spd: 1, def: 0, color: '#777' };
const make = (template, mode) => {
  const stage = { universe: 'Nexus de Convergence', mode, disableHazards: true, customBattle: { singleRoster: true, opponentControl: 'p2' } };
  const engine = new (mode === 'RPG' ? EngineRpg : EngineSmash)(760, 420, [clone(template)], { customRoster: [foe], monsters: [foe], bosses: [] }, { add() {} }, () => {}, () => {}, stage);
  engine.syncPreMatchFromServer?.(3000); engine.completeMeleeIntros?.();
  const actor = engine.heroes[0]; Object.assign(actor, { state: 'idle', atb: 100, specialCharge: 100, action: null, x: 200, y: 250, facing: 1 });
  Object.assign(engine.enemies[0], { x: 240, y: 250 });
  installSignatureDirector(engine, { mode }); return engine;
};
const tick = (engine, count) => { for (let index = 0; index < count; index++) engine.update({}, {}, { preMatchDeltaMs: 1000 / 60, stageDeltaMs: 1000 / 60 }); };

test('real melee engines preserve each prepared super/partner and spend the meter once before and after', () => {
  const nativeRandom = Math.random;
  Math.random = () => 0.5;
  try {
  for (const row of aliases) {
    const receipts = [];
    for (const template of [row.actor, current(row)]) {
      const engine = make(template, 'Smash');
      try {
        const actor = engine.heroes[0], target = engine.enemies[0];
        actor.currentHp = Math.max(1, actor.maxHp - 50);
        const definition = engine.signatureDirector.superReadiness(actor).definition;
        assert.ok(definition, row.actor.id);
        assert.equal(engine.triggerAbility(actor, 'special'), true, row.actor.id);
        assert.equal(actor.specialCharge, 0);
        assert.equal(engine.triggerAbility(actor, 'special'), false);
        const contacts = []; const native = engine.applyDamage;
        engine.applyDamage = (...args) => { contacts.push(args[2]); return native(...args); };
        tick(engine, 240);
        assert.equal(actor.specialCharge, 0);
        receipts.push({ name: actor.special.name, key: definition.key, partner: definition.summonName || null, contacts, targetHp: target.currentHp, actorHp: actor.currentHp });
      } finally { engine.dispose(); }
    }
    assert.deepEqual(receipts[1], receipts[0], row.actor.id);
  }
  } finally { Math.random = nativeRandom; }
});

test('real RPG engines retain Knights of the Round thirteen contacts and one ATB/item spend', () => {
  const row = baseline.find(record => record.actor.id === 'cloud_ff7');
  const receipts = [];
  for (const template of [row.actor, current(row)]) {
    const engine = make(template, 'RPG');
    try {
      const actor = engine.heroes[0], contacts = []; const native = engine.applyDamage;
      engine.applyDamage = (...args) => { contacts.push(args[2]); return native(...args); };
      assert.equal(engine.signatureDirector.triggerInvocation(EVENT_ITEMS_DB['Final Fantasy VII'], actor), true);
      assert.equal(actor.atb, 0);
      assert.equal(engine.signatureDirector.triggerInvocation(EVENT_ITEMS_DB['Final Fantasy VII'], actor), false);
      tick(engine, 204);
      assert.equal(contacts.length, 13);
      assert.equal(contacts.reduce((sum, damage) => sum + damage, 0), 260);
      actor.atb = 100;
      assert.equal(engine.signatureDirector.eventReadiness(EVENT_ITEMS_DB['Final Fantasy VII'], actor).reason, 'spent');
      receipts.push(contacts);
    } finally { engine.dispose(); }
  }
  assert.deepEqual(receipts[1], receipts[0]);
});

test('DLC-local declarations expose no runtime raster URLs or artwork approval', () => {
  assert.equal(declarations.actors.length, 40);
  for (const dir of ['FinalFantasyVII', 'FinalFantasyVIII', 'FinalFantasyXIII', 'FinalFantasyXV']) {
    const source = fs.readFileSync(new URL(`../DLC/${dir}/data/actorSourceContracts.js`, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /(?:spriteSheet|spriteUrl|backgroundUrl|assetUrl|\.png|\.webp|import\s*\()/);
    assert.match(source, /source1to1Verified: false/);
  }
});

test('actual base profile removes the four DLC imports and selected private helpers remain declared', () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const directories = ['FinalFantasyVII', 'FinalFantasyVIII', 'FinalFantasyXIII', 'FinalFantasyXV'];
  const local = directories.map(directory => JSON.parse(fs.readFileSync(new URL(`../DLC/${directory}/manifest.json`, import.meta.url))));
  const manifests = DLC_PACK_MANIFESTS.map(manifest => local.find(current => current.id === manifest.id) || manifest);
  const base = createDlcProfileTransformer({ root, manifests, installedPackIds: [] });
  for (const name of ['heroes', 'enemies', 'expandedUniverses']) {
    const file = `${root}/src/game/${name}.js`;
    const output = base.transform(fs.readFileSync(file, 'utf8'), file);
    assert.ok(output);
    for (const directory of directories) assert.equal(output.code.includes(`/DLC/${directory}/`), false);
  }
  for (const manifest of local) {
    assert.deepEqual(manifest.modules.find(module => module.path === 'data/actorSourceContracts.js'), { path: 'data/actorSourceContracts.js' });
    const selected = createDlcProfileTransformer({ root, manifests, installedPackIds: [manifest.id] });
    const file = `${root}/${manifest.directory}/data/heroes.js`;
    assert.doesNotThrow(() => selected.transform(fs.readFileSync(file, 'utf8'), file));
  }
});

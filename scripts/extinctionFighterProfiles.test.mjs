import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseAst } from 'rolldown/parseAst';
import { createServer } from './fixtures/ssrTestServer.mjs';
import { HEROES_DB } from '../src/game/heroes.js';
import { createPlayerHero } from '../src/game/playerHero.js';
import { getExtinctionFighterProfile, getExtinctionPrimaryInstruction, rememberExtinctionPersonalKit, restoreExtinctionPersonalKit } from '../src/game/extinctionFighterProfiles.js';
import { EXTINCTION_SIGNATURE_IDS, getExtinctionSignature, createExtinctionProtocolState, activateExtinctionProtocol,
  tickExtinctionProtocols, damageExtinctionEnemy, mitigateExtinctionProtocolDamage,
  getExtinctionProtocolSpeedFactor, clearExtinctionProtocolEffects } from '../src/game/extinctionSignatures.js';
import { getExtinctionHandFrame, getExtinctionRoster, drawExtinctionSchematic } from '../src/game/extinctionContent.js';
import { buildExtinctionFighterCatalog } from './extinctionFighterCatalog.mjs';
import * as protocols from '../src/game/extinctionSignatures.js';
import * as directives from '../src/game/extinctionFieldDirectives.js';
import * as relays from '../src/game/extinctionRelayOperation.js';
import * as field from '../src/game/nexusFieldOperation.js';
import * as equipment from '../src/game/extinctionFieldEquipment.js';

const heroes = [createPlayerHero(), ...HEROES_DB];
const hero = id => heroes.find(candidate => candidate.id === id);
const enemy = (wy = 1, hp = 500) => ({ id: 'target', kind: 'Traqueur', wx: 0, wy, hp, maxHp: hp, size: 1 });
const make = actor => {
  const profile = getExtinctionFighterProfile(typeof actor === 'string' ? hero(actor) : actor);
  return { phase: 'running', runId: 'source-run', heroId: profile.heroId, heroCategory: 'marine',
    hp: 20, maxHp: 120, px: 0, py: 0, angle: 0, t: 0, kills: 0, ammo: 24, reserveAmmo: 72,
    weapon: { type: 'pistol', ammo: 24, maxAmmo: 24, resource: profile.resource.kind }, enemies: [enemy()],
    protocols: createExtinctionProtocolState(profile.signature, 'source-run') };
};
const tick = (state, count) => { for (let i = 0; i < count; i++) { state.t += 1; tickExtinctionProtocols(state); } };

test('every actual combatant has four executable source actions; no source catalog mutation or implicit ownership', () => {
  const before = JSON.stringify(heroes);
  const profiles = heroes.map(getExtinctionFighterProfile);
  assert.equal(profiles.length, 1912); assert.equal(profiles.filter(profile => profile.eligible).length, 1811);
  assert.equal(profiles.filter(profile => !profile.eligible).length, 101);
  assert.deepEqual(getExtinctionRoster(heroes, []), []);
  let executed = 0;
  for (const actor of heroes) {
    const profile = getExtinctionFighterProfile(actor);
    if (!profile.eligible) { assert.equal(profile.signature, null); assert.equal(profile.resource.kind, 'none'); continue; }
    assert.deepEqual(Object.keys(profile.signature.actions), ['simple', 'secondary', 'defense', 'special'], actor.id);
    for (const [slot, action] of Object.entries(profile.signature.actions)) {
      assert.deepEqual(action.name, actor[slot].name, `${actor.id}.${slot} name`);
      assert.equal(action.sourceType, actor[slot].type, `${actor.id}.${slot} source type`);
      const state = make(actor); state.protocols.charge = 100;
      const result = activateExtinctionProtocol(state, slot);
      assert.equal(result.activated, true, `${actor.id}.${slot}`);
      const effectNow = state.hp > 20 || state.px !== 0 || state.py !== 0 || mitigateExtinctionProtocolDamage(state, 100) < 100
        || state.protocols.buff > 0 || getExtinctionProtocolSpeedFactor(state, state.enemies[0]) < 1
        || state.protocols.returnProbe || state.protocols.reflection || state.protocols.drone > 0;
      tick(state, 90);
      assert.ok(effectNow || state.enemies[0].hp < 500, `${actor.id}.${slot} must change gameplay, not only a cast counter`);
      executed += 1;
    }
  }
  assert.equal(executed, 7244); assert.equal(JSON.stringify(heroes), before);
});

test('the twelve authored Nexus kits remain byte-for-byte primary to the shared adapter', () => {
  for (const id of EXTINCTION_SIGNATURE_IDS) {
    const profile = getExtinctionFighterProfile(hero(id));
    assert.deepEqual(profile.signature, getExtinctionSignature(hero(id)));
    assert.equal(profile.reviewStatus, 'AUTHORED_KIT_ART_PENDING');
  }
  assert.equal(getExtinctionSignature(hero('masterchief')), null, 'legacy API remains authored-only');
});

test('equipment, incarnation and generic source limits are copied from the exact identity', () => {
  const predator = getExtinctionFighterProfile(hero('predator'));
  assert.deepEqual(predator.equipment.map(item => item.label), hero('predator').equipment);
  assert.equal(predator.source.incarnation, hero('predator').incarnation);
  assert.equal(predator.signature.actions.simple.kind, 'melee');
  assert.equal(predator.signature.actions.secondary.kind, 'projectile');
  assert.equal(predator.resource.reload, false);
  assert.equal(predator.view.morphologyInferred, false);
  const serj = getExtinctionFighterProfile(hero('serj_tankian'));
  assert.equal(serj.reviewStatus, 'GENERIC_SOURCE_REVIEW_REQUIRED');
  assert.ok(serj.view.src); assert.equal(serj.view.ownerId, 'serj_tankian');
  const peaceful = heroes.find(actor => actor.nonCombat || actor.category === 'trial');
  assert.equal(getExtinctionFighterProfile(peaceful).reviewStatus, 'NON_COMBAT_PRESERVED');
});

test('the real briefing distinguishes documented equipment from legacy categories and generated action names in both languages', async () => {
  const vite = await createServer({ root: fileURLToPath(new URL('../', import.meta.url)), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  try {
    const { default: Briefing } = await vite.ssrLoadModule('/src/components/ExtinctionFighterBriefing.jsx');
    const cases = [
      ['arthur_kaamelott', 'primary-action', 'Excalibur Order Cut'],
      ['serj_tankian', 'primary-action', 'Serj Tankian Signature Strike'],
      ['hazbin_hotel_charlie_morningstar', 'primary-action', 'Charlie Morningstar signature action'],
      ['predator', 'equipment', 'Wristblades · Shoulder plasma caster · Biomask · Cloaking device'],
      ['counter_strike_sas', 'equipment', 'M4A1-S'],
      ['bioshock_rapture_jack', 'equipment', 'Wrench'],
      ['bioshock_rapture_bouncer', 'equipment', 'Drill']
    ];
    for (const lang of ['fr', 'en']) {
      for (const [id, kind, value] of cases) {
        const actor = hero(id), profile = getExtinctionFighterProfile(actor);
        const before = JSON.stringify({ actor, profile });
        const html = renderToStaticMarkup(React.createElement(Briefing, { profile, lang }));
        const line = html.match(/<p data-fps-loadout="(equipment|primary-action)">([\s\S]*?)<\/p>/);
        assert.ok(line, `${id} ${lang}: loadout remains visible`);
        assert.equal(line[1], kind, `${id} ${lang}: a category is not an equipment claim`);
        const prefix = kind === 'equipment'
          ? lang === 'fr' ? 'Équipement : ' : 'Equipment: '
          : lang === 'fr' ? 'Action principale du kit : ' : 'Kit primary action: ';
        assert.ok(line[2].includes(renderToStaticMarkup(React.createElement('span', null, prefix))), `${id} ${lang}: clear localized label`);
        assert.ok(line[2].includes(renderToStaticMarkup(React.createElement('span', { 'data-fps-loadout-value': true }, value))), `${id} ${lang}: source equipment or actual primary action`);
        assert.equal(JSON.stringify({ actor, profile }), before, `${id} ${lang}: consultation preserves the source and kit`);
      }
    }
  } finally {
    await vite.close();
  }
});

test('personal sheets stay exact-owner and costume-bound; new profiles never manufacture art', () => {
  const bound = heroes.map(getExtinctionFighterProfile).filter(profile => profile.eligible && profile.view.src);
  assert.deepEqual(bound.map(profile => profile.heroId).sort(), ['arca_mirelle', 'arthur_kaamelott', 'serj_tankian']);
  for (const profile of bound) {
    assert.equal(profile.view.id, profile.heroId);
    assert.equal(getExtinctionFighterProfile({ ...hero(profile.heroId), activeSkin: 'unknown' }).view.src, '');
    assert.equal(getExtinctionHandFrame(profile.view, { weapon: { type: 'rocket' } }), null);
  }
  assert.equal(getExtinctionFighterProfile(hero('buckethead_avatar')).view.src, '');
  const arthur = make('arthur_kaamelott'); activateExtinctionProtocol(arthur, 'simple');
  assert.equal(arthur.muzzle, undefined, 'a sword does not manufacture a gun muzzle');
  assert.equal(getExtinctionHandFrame(getExtinctionFighterProfile(hero('arthur_kaamelott')).view, arthur).phase, 'attack');
});

test('ammunition is consumed by ballistic primaries; contact and non-ballistic effects use cooldowns', () => {
  const chief = make('masterchief'); activateExtinctionProtocol(chief, 'simple');
  assert.equal(chief.ammo, 23); assert.ok(chief.enemies[0].hp < 500);
  for (const id of ['predator', 'serj_tankian', 'lilo_pelekai']) {
    const state = make(id); state.ammo = 0; state.weapon.ammo = 0; state.reloadPulse = 30;
    assert.equal(activateExtinctionProtocol(state, 'simple').activated, true, id);
    assert.equal(state.ammo, 0, id);
    assert.equal(activateExtinctionProtocol(state, 'simple').reason, 'cooldown', id);
  }
});

test('control is non-damaging, earns charge on actual contact, expires and freezes during pause', () => {
  const state = make('lilo_pelekai'), target = state.enemies[0];
  activateExtinctionProtocol(state, 'simple');
  assert.equal(target.hp, 500); assert.equal(getExtinctionProtocolSpeedFactor(state, target), 0.45);
  assert.equal(state.protocols.charge, 8);
  state.paused = true; const remaining = target.protocolControl.life; tick(state, 100);
  assert.equal(target.protocolControl.life, remaining);
  assert.equal(activateExtinctionProtocol(state, 'secondary').reason, 'paused');
  state.paused = false; tick(state, remaining);
  assert.equal(getExtinctionProtocolSpeedFactor(state, target), 1);
  state.angle = Math.PI; activateExtinctionProtocol(state, 'simple');
  assert.equal(state.protocols.charge, 8, 'missed control cannot farm ultimate charge');
});

test('scatter and sweep cover a cone; ordinary contact remains close and aimed', () => {
  const doom = make('doomslayer'); doom.enemies = [enemy(2), { ...enemy(3), id: 'side', wx: 1 }, enemy(-1), enemy(12)];
  activateExtinctionProtocol(doom, 'simple');
  assert.ok(doom.enemies[0].hp < 500 && doom.enemies[1].hp < 500);
  assert.equal(doom.enemies[2].hp, 500); assert.equal(doom.enemies[3].hp, 500);
  const predator = make('predator'); predator.enemies = [enemy(7)]; activateExtinctionProtocol(predator, 'simple');
  assert.equal(predator.enemies[0].hp, 500);
});

test('shared summon is delayed, world-anchored, owner-bound and respects the Champion shield', () => {
  const actor = heroes.find(candidate => getExtinctionFighterProfile(candidate).signature?.actions.secondary?.kind === 'summon');
  assert.ok(actor);
  const state = make(actor); const boss = { ...enemy(3), kind: 'Champion de Trame', shieldActive: true };
  const drone = { ...enemy(3), id: 'drone', wx: 2, kind: 'Drone Protecteur' }; state.enemies = [boss, drone];
  activateExtinctionProtocol(state, 'secondary'); assert.equal(boss.hp, 500);
  const anchor = { wx: state.protocols.summon.wx, wy: state.protocols.summon.wy };
  state.px = 5; tick(state, 60); assert.equal(boss.hp, 500);
  assert.deepEqual({ wx: state.protocols.summon.wx, wy: state.protocols.summon.wy }, anchor);
  damageExtinctionEnemy(state, drone, 1000); tick(state, 60); assert.ok(boss.hp < 500);
  state.protocols.summon.ownerId = 'foreign'; const hp = boss.hp; tick(state, 60);
  assert.equal(boss.hp, hp); assert.equal(state.protocols.summon, null);
});

test('returning to the personal kit retains its actual stock and cooldowns without refill or repeated return', () => {
  const state = make('masterchief'); activateExtinctionProtocol(state, 'simple');
  state.reserveAmmo = 51; assert.equal(rememberExtinctionPersonalKit(state), true);
  state.weapon = { type: 'rocket', ammo: 4, maxAmmo: 4 }; state.ammo = 4; state.reserveAmmo = 8;
  state.paused = true; assert.equal(restoreExtinctionPersonalKit(state), false);
  state.paused = false; assert.equal(restoreExtinctionPersonalKit(state), true);
  assert.equal(state.weapon.type, 'pistol'); assert.equal(state.ammo, 23); assert.equal(state.reserveAmmo, 51);
  assert.equal(state.protocols.cooldowns.simple, 20); assert.equal(restoreExtinctionPersonalKit(state), false);
  rememberExtinctionPersonalKit(state); state.weapon = { type: 'plasma', ammo: 60 }; state.runId = 'different';
  assert.equal(restoreExtinctionPersonalKit(state), false);
});

test('the abstract non-ballistic view never draws a gun body or mutates simulation', () => {
  const state = make('long_horse'); const before = structuredClone(state); let rects = 0, strokes = 0;
  const context = new Proxy({ fillRect() { rects++; }, stroke() { strokes++; } }, { get: (target, key) => target[key] || (() => {}), set: () => true });
  drawExtinctionSchematic(context, state, 840, 430);
  assert.equal(rects, 0); assert.ok(strokes > 0); assert.deepEqual(state, before);
  activateExtinctionProtocol(state, 'secondary'); clearExtinctionProtocolEffects(state);
  assert.equal(state.enemies[0].protocolControl, undefined);
});

test('future unsupported source types are explicit instead of becoming a borrowed gun or a no-op action', () => {
  const actor = { ...hero('masterchief'), secondary: { name: 'Unknown source mechanic', type: 'future-unmapped-type' } };
  const profile = getExtinctionFighterProfile(actor);
  assert.equal(profile.reviewStatus, 'UNSUPPORTED_SOURCE_ACTION'); assert.equal(profile.signature.actions.secondary, undefined);
  assert.equal(activateExtinctionProtocol(make(actor), 'secondary').reason, 'unavailable');
});

test('workbook export is deterministic and covers all four modes with provenance and honest production states', () => {
  const first = buildExtinctionFighterCatalog(), second = buildExtinctionFighterCatalog();
  assert.deepEqual(first, second);
  assert.deepEqual(first.counts, { characters: 1912, combatants: 1811, peaceful: 101, authoredKits: 12,
    sourceAdaptedKits: 1799, genericSourceReview: 1633, boundPersonalViews: 3, actions: 7244 });
  assert.deepEqual(first.modes.map(mode => mode.mode), ['extraction', 'last_signal', 'infestation', 'hunt']);
  assert.ok(first.profiles.every(profile => profile.actions.every(action => action.sourcePath.includes(`${profile.heroId}.${action.slot}`))));
  assert.ok(first.profiles.every(profile => profile.actions.every(action => typeof action.reach?.kind === 'string' && Number.isFinite(action.reach.value))));
  assert.equal(first.profiles.find(profile => profile.heroId === 'arca_nova').actions.find(action => action.slot === 'defense').reach.value, 2.4);
  assert.equal(first.profiles.find(profile => profile.heroId === 'hw_wheelchair_guy').actions.find(action => action.slot === 'simple').range, 2.4);
});

test('movement reach matches actual dash/teleport displacement and preserves historical authored metadata', () => {
  let covered = 0;
  for (const actor of heroes) {
    const profile = getExtinctionFighterProfile(actor);
    for (const [slot, action] of Object.entries(profile.signature?.actions || {})) {
      if (!['dash', 'teleport'].includes(action.kind)) continue;
      const state = make(actor); state.py = 14; state.angle = Math.PI / 3; state.protocols.charge = 100;
      const before = { px: state.px, py: state.py }, reach = protocols.getExtinctionActionReach(action);
      assert.equal(reach.kind, 'movement');
      assert.equal(activateExtinctionProtocol(state, slot).activated, true);
      assert.ok(Math.abs(Math.hypot(state.px - before.px, state.py - before.py) - reach.value) < 1e-10, `${actor.id}.${slot}`);
      if (EXTINCTION_SIGNATURE_IDS.includes(actor.id)) assert.equal(action.range, 24, 'historical authored object is not rewritten');
      else assert.equal(action.range, reach.value);
      assert.match(getExtinctionPrimaryInstruction(action, 'fr'), /Déplacement principal/);
      assert.match(getExtinctionPrimaryInstruction(action, 'en'), /Primary movement/);
      assert.doesNotMatch(getExtinctionPrimaryInstruction(action, 'fr'), /portée 24|Vise/);
      covered++;
    }
  }
  assert.ok(covered >= 10, 'all existing authored and adapted movement actions are exercised');
});

test('personal effects report no target while summons and reflections expose their actual eight-unit radius', () => {
  const samples = new Map();
  for (const actor of heroes) for (const [slot, action] of Object.entries(getExtinctionFighterProfile(actor).signature?.actions || {})) {
    if (!samples.has(action.kind)) samples.set(action.kind, { actor, slot, action });
  }
  for (const kind of ['heal', 'guard', 'buff', 'support', 'barricade', 'drone']) {
    const { actor, slot, action } = samples.get(kind), state = make(actor); state.enemies = []; state.protocols.charge = 100;
    assert.deepEqual(protocols.getExtinctionActionReach(action), { kind: 'self', value: 0 });
    assert.equal(activateExtinctionProtocol(state, slot).activated, true);
    assert.equal(state.px, 0); assert.equal(state.py, 0);
    assert.match(getExtinctionPrimaryInstruction(action, 'fr'), /sans cible à viser/);
    assert.match(getExtinctionPrimaryInstruction(action, 'en'), /no target/);
    if (!EXTINCTION_SIGNATURE_IDS.includes(actor.id)) assert.equal(action.range, 0);
  }
  for (const kind of ['summon', 'reflection']) {
    const { actor, slot, action } = samples.get(kind), state = make(actor);
    state.enemies = [{ ...enemy(7.9), id: 'inside' }, { ...enemy(8.1), id: 'outside' }]; state.protocols.charge = 100;
    assert.deepEqual(protocols.getExtinctionActionReach(action), { kind: 'support-radius', value: 8 });
    assert.equal(activateExtinctionProtocol(state, slot).activated, true);
    assert.equal(state.protocols[kind].range, 8);
    tick(state, 60); assert.ok(state.enemies[0].hp < 500); assert.equal(state.enemies[1].hp, 500);
    assert.match(getExtinctionPrimaryInstruction(action, 'fr'), /rayon de 8 unités/);
    if (!EXTINCTION_SIGNATURE_IDS.includes(actor.id)) assert.equal(action.range, 8);
  }
});

test('mine metadata distinguishes actual deployment distance from the explosion radius without changing either', () => {
  let covered = 0;
  for (const actor of heroes) for (const [slot, action] of Object.entries(getExtinctionFighterProfile(actor).signature?.actions || {})) {
    if (action.kind !== 'mine') continue;
    const state = make(actor); state.protocols.charge = 100;
    const reach = protocols.getExtinctionActionReach(action);
    assert.deepEqual(reach, { kind: 'placement', value: 2, effectRadius: 2.5 });
    assert.equal(activateExtinctionProtocol(state, slot).activated, true);
    const shot = state.protocols.projectiles[0];
    assert.equal(Math.hypot(shot.wx - state.px, shot.wy - state.py), reach.value);
    assert.equal(shot.splash, reach.effectRadius);
    if (!EXTINCTION_SIGNATURE_IDS.includes(actor.id)) assert.equal(action.range, 2);
    assert.match(getExtinctionPrimaryInstruction(action, 'en'), /up to 2 units ahead/);
    covered++;
  }
  assert.ok(covered >= 3);
});

// These regressions execute the current component callbacks/simulation. Only
// rendering, sound and React bookkeeping are replaced; gameplay helpers are real.
const hubSource = readFileSync(new URL('../src/components/HubScreen.jsx', import.meta.url), 'utf8');
const fpsNode = parseAst(hubSource, { lang: 'jsx' }).body.find(node => node.type === 'FunctionDeclaration' && node.id?.name === 'ExtinctionRoyale');
const fpsDeclarations = fpsNode.body.body.flatMap(node => node.type === 'VariableDeclaration' ? node.declarations : []);
function callback(name, state, actor = hero(state.heroId), overrides = {}) {
  const initializer = fpsDeclarations.find(candidate => candidate.id?.name === name).init;
  const node = initializer.type === 'CallExpression' && initializer.callee?.name === 'useCallback' ? initializer.arguments[0] : initializer;
  const environment = { ...protocols, ...directives, ...relays, ...field, ...equipment,
    rememberExtinctionPersonalKit, restoreExtinctionPersonalKit,
    stateRef: { current: state }, sessionPausedRef: { current: false }, intelRef: { current: false },
    selectedHero: actor, lang: 'fr', roleProfile: { marine: { dmg: 1 } }, EXTINCTION_BEACON_TARGET: 3,
    projectWorld: (target, run) => ({ camZ: target.wy - run.py, aim: (target.wx - run.px) / (target.wy - run.py), dist: Math.hypot(target.wx - run.px, target.wy - run.py) }),
    sound: { playSfx() {} }, triggerEnemyDrop() {}, setRunSnapshot() {}, buildRunSnapshot() { return {}; },
    extinctionEnemyLabel: kind => kind, activateSignature() { throw new Error('Unexpected personal cast in pickup callback'); },
    finishRun() { throw new Error('Unexpected run completion'); }, ...overrides };
  return new Function(...Object.keys(environment), `return (${hubSource.slice(node.start, node.end)});`)(...Object.values(environment));
}
const loopStart = hubSource.indexOf('for (let step = 0; step < simulationSteps', fpsNode.start);
const fixedLoop = hubSource.slice(loopStart, hubSource.indexOf('      ctx.save();', loopStart));
const simulationHelpers = { ...protocols, ...directives, ...relays, ...field };
const fixedStep = new Function(...Object.keys(simulationHelpers), `return (state, selectedHero, simulationSteps) => {
  if (state.paused) return;
  const runMode = state.runMode || 'extraction', lang = 'fr';
  const EXTINCTION_BEACON_TARGET = 3, EXTINCTION_INFESTATION_TARGET_FRAMES = 3600;
  const sound = { playSfx() {} }, triggerEnemyDrop = () => {}, setRunSnapshot = () => {}, buildRunSnapshot = () => ({});
  const projectWorld = (enemy, run) => ({ dist: Math.hypot(enemy.wx - run.px, enemy.wy - run.py) });
  const buildEnemies = () => { throw new Error('Unexpected wave'); }, buildLoot = () => [];
  const finishRun = () => { throw new Error('Unexpected run completion'); };
  ${fixedLoop}
};`)(...Object.values(simulationHelpers));
const liveState = id => ({ ...make(id), runMode: 'extraction', armor: 0, vx: 0, vy: 0, turnVel: 0, moveKeys: {},
  zone: 1, wave: 1, loot: [], glitchZones: [], reloadPulse: 0, muzzle: 0, dash: 0, scan: 0, turret: 0,
  skillCooldown: 0, hitMarkerTimer: 0, screenShake: 0, enemies: [{ ...enemy(16), speed: 0.0025, dmg: 4 }] });

test('the actual pickup fire callback preserves unmarked-Hunt refusal and shows an impact only after real damage', () => {
  const state = liveState('masterchief');
  Object.assign(state, { runMode: 'hunt', t: 100, wave: 3, lang: 'fr', ammo: 8,
    weapon: { type: 'shotgun', ammo: 8, maxAmmo: 8, fireRate: 1, spread: .15, dmgMult: 1.5 },
    enemies: [{ ...enemy(5), id: 'champion', kind: 'Champion de Trame' }], hitMarkerTimer: 3 });
  state.fieldDirective = directives.createExtinctionFieldDirective(state, { enabled: true, mode: 'hunt' });
  const fire = callback('fire', state);
  fire(); assert.equal(state.enemies[0].hp, 500); assert.equal(state.ammo, 7);
  assert.equal(state.hitMarkerTimer, 0); assert.equal(state.screenShake, 0);
  assert.match(state.statusText, /Noyau masqué/); assert.doesNotMatch(state.statusText, /Impact confirmé/);
  assert.equal(state.protocols.charge, 0);
  directives.markExtinctionHuntTarget(state); state.t += 20; fire();
  assert.equal(state.enemies[0].hp, 478, 'three of seven pellets reach this five-unit target'); assert.equal(state.ammo, 6);
  assert.equal(state.hitMarkerTimer, 6); assert.ok(state.screenShake > 0); assert.match(state.statusText, /Impact confirmé/);
});

test('actual reload, pickup and kit return retain 36/26/11/0 active reload ticks and the independent primary cooldown', () => {
  for (const elapsed of [0, 10, 25, 40]) {
    const state = liveState('masterchief'); state.weapon.ammo = 2; state.ammo = 2;
    activateExtinctionProtocol(state, 'simple');
    callback('reload', state)(); assert.equal(state.reloadPulse, 36); assert.equal(state.ammo, 24);
    const reserve = state.reserveAmmo;
    state.loot = [{ id: 'actual-drop', type: 'weapon', wx: state.px, wy: state.py, label: 'Shotgun',
      weaponData: { type: 'shotgun', maxAmmo: 8, dmgMult: 1.5 } }];
    callback('collectLoot', state)(); assert.equal(state.weapon.type, 'shotgun');
    fixedStep(state, hero('masterchief'), elapsed);
    assert.equal(restoreExtinctionPersonalKit(state), true);
    assert.equal(state.reloadPulse, Math.max(0, 36 - elapsed));
    assert.equal(state.protocols.cooldowns.simple, Math.max(0, 20 - elapsed));
    assert.equal(state.reserveAmmo, reserve); assert.equal(state.ammo, 24);
    assert.equal(protocols.getExtinctionProtocolStatus(state, 'simple'), elapsed < 20 ? 'cooldown' : elapsed < 36 ? 'reload' : 'ready');
  }
});

test('actual collection, fire, reload and V/B callbacks keep separate stocks and reloads in all 48 mode/profile/pickup combinations', () => {
  let combinations = 0;
  for (const runMode of ['extraction', 'last_signal', 'infestation', 'hunt']) {
    for (const id of ['masterchief', 'arca_mirelle', 'predator', 'lilo_pelekai']) {
      for (const type of ['shotgun', 'plasma', 'rocket']) {
        const state = liveState(id); state.runMode = runMode; state.t = 100;
        activateExtinctionProtocol(state, 'simple');
        const personal = { ammo: state.ammo, reserveAmmo: state.reserveAmmo };
        state.loot = [{ id: 'carried-field-drop', type: 'weapon', wx: 0, wy: 0, label: type,
          weaponData: { ...PICKUP_FIXTURES[type], name: type } }];
        callback('collectLoot', state)(); assert.equal(state.loot[0].used, true);
        callback('fire', state)(); assert.equal(state.ammo, PICKUP_FIXTURES[type].maxAmmo - 1);
        callback('reload', state)(); assert.equal(state.reloadPulse, 36);
        const reserve = state.reserveAmmo, afterReload = structuredClone(state.protocols), lastFireTime = state.lastFireTime;
        callback('restorePersonalKit', state)();
        assert.equal(state.weapon.type, 'pistol'); assert.equal(state.ammo, personal.ammo); assert.equal(state.reserveAmmo, personal.reserveAmmo);
        assert.equal(state.fieldWeapon.weapon.type, type); assert.equal(state.fieldWeapon.reserveAmmo, reserve);
        assert.deepEqual(state.protocols, afterReload); assert.equal(state.lastFireTime, lastFireTime);
        fixedStep(state, hero(id), 10);
        const afterTicks = structuredClone(state.protocols);
        callback('restoreFieldWeapon', state)();
        assert.equal(state.weapon.type, type); assert.equal(state.reloadPulse, 26); assert.equal(state.reserveAmmo, reserve);
        assert.deepEqual(state.protocols, afterTicks); assert.equal(state.fieldWeapon, null);
        const ammo = state.ammo;
        callback('fire', state)(); assert.equal(state.ammo, ammo, 'B must not bypass the remaining field reload');
        callback('restorePersonalKit', state)(); fixedStep(state, hero(id), 40);
        callback('restoreFieldWeapon', state)();
        assert.equal(state.reloadPulse, 0); assert.equal(state.ammo, ammo); assert.equal(state.reserveAmmo, reserve);
        callback('fire', state)(); assert.equal(state.ammo, ammo - 1, 'restored equipment still reaches the actual fire route');
        callback('restorePersonalKit', state)();
        assert.equal(state.ammo, personal.ammo); assert.equal(state.reserveAmmo, personal.reserveAmmo);
        assert.equal(state.fieldWeapon.weapon.ammo, ammo - 1); assert.equal(state.fieldWeapon.reserveAmmo, reserve);
        combinations++;
      }
    }
  }
  assert.equal(combinations, 48);
});

test('actual collection announces replacement of the active or stored weapon and refuses invalid drops before consumption', () => {
  for (const holstered of [false, true]) {
    const state = liveState('masterchief');
    state.loot = [{ id: 'first-field-drop', type: 'weapon', wx: 0, wy: 0, label: 'Plasma Rifle',
      weaponData: { ...PICKUP_FIXTURES.plasma, name: 'Plasma Rifle' } }];
    callback('collectLoot', state)();
    if (holstered) callback('restorePersonalKit', state)();
    state.loot.push({ id: 'second-field-drop', type: 'weapon', wx: 0, wy: 0, label: 'Rocket Launcher',
      weaponData: { ...PICKUP_FIXTURES.rocket, name: 'Rocket Launcher' } });
    callback('collectLoot', state)();
    assert.equal(state.weapon.type, 'rocket'); assert.equal(state.fieldWeapon, null);
    assert.match(state.statusText, /Plasma Rifle/); assert.match(state.statusText, /remplac/i);
    callback('restorePersonalKit', state)();
    assert.equal(state.fieldWeapon.weapon.type, 'rocket'); assert.equal(state.ammo, 24); assert.equal(state.reserveAmmo, 72);
  }
  const state = liveState('masterchief'); state.relayOperation = null;
  state.loot = [{ id: 'invalid-field-drop', type: 'weapon', wx: 0, wy: 0, label: 'Invalid',
    weaponData: { type: 'rocket', maxAmmo: -1 }, used: false }];
  const before = structuredClone(state);
  callback('collectLoot', state)();
  const { statusText, ...after } = state;
  assert.match(statusText, /reste au sol/); assert.deepEqual(after, before);
});

test('actual completion clears carried equipment and retains one unchanged reward receipt per mode', () => {
  for (const runMode of ['extraction', 'last_signal', 'infestation', 'hunt']) {
    for (const result of ['victory', 'defeat']) {
      const state = liveState('masterchief'); state.runMode = runMode;
      state.loot = [{ id: 'finish-field-drop', type: 'weapon', wx: 0, wy: 0, label: 'Rocket Launcher',
        weaponData: { ...PICKUP_FIXTURES.rocket, name: 'Rocket Launcher' } }];
      callback('collectLoot', state)(); callback('restorePersonalKit', state)();
      assert.equal(state.fieldWeapon.weapon.type, 'rocket');
      const receipts = [];
      const finish = callback('finishRun', state, hero(state.heroId), { runMode,
        sceneInputsRef: { current: { clear() {} } }, aimPointerRef: { current: {} }, emptySceneAim: () => ({}),
        onSessionEnd: receipt => receipts.push(receipt) });
      finish(result); finish(result);
      assert.equal(state.phase, 'ended'); assert.equal(state.fieldWeapon, null); assert.equal(state.personalKit, null);
      assert.equal(equipment.restoreExtinctionFieldWeapon(state), false);
      assert.equal(receipts.length, 1); assert.equal(receipts[0].reason, 'completed'); assert.equal(receipts[0].mode, runMode);
      assert.equal(receipts[0].rewards.gold, result === 'victory' ? 70 + state.wave * 22 + state.kills * 3 : 18 + state.kills);
      assert.equal(receipts[0].rewards.shards, result === 'victory' ? 24 + state.wave * 7 : 7 + Math.floor(state.kills / 2));
      assert.equal(receipts[0].rewards.modeXp, result === 'victory' ? 120 + state.wave * 30 : 35 + state.kills * 4);
    }
  }
});

test('pause cannot age a stored personal reload, and ordinary loot cannot shorten an active reload', () => {
  const state = liveState('masterchief'); state.weapon.ammo = 1; state.ammo = 1;
  callback('reload', state)();
  state.loot = [{ id: 'ammo-cache', type: 'normal', effect: 'ammo', label: 'Ammo', wx: 0, wy: 0 }];
  callback('collectLoot', state)(); assert.equal(state.reloadPulse, 36);
  rememberExtinctionPersonalKit(state); state.weapon = { type: 'rocket', ammo: 4, maxAmmo: 4 };
  state.paused = true; fixedStep(state, hero('masterchief'), 120);
  assert.equal(state.t, 0); assert.equal(restoreExtinctionPersonalKit(state), false);
  state.paused = false; assert.equal(restoreExtinctionPersonalKit(state), true);
  assert.equal(state.reloadPulse, 36); assert.equal(protocols.getExtinctionProtocolStatus(state, 'simple'), 'reload');
});

test('all three mobility kits earn their first legal ultimate from zero through five actual evasions, without a foreign weapon', () => {
  const ids = ['hw_wheelchair_guy', 'hw_business_guy', 'hw_irresponsible_dad'];
  assert.deepEqual(heroes.map(getExtinctionFighterProfile).filter(profile => profile.ultimateCharge.kind === 'evasion').map(profile => profile.heroId).sort(), [...ids].sort());
  for (const id of ids) {
    const actor = hero(id), state = liveState(id); state.py = 14;
    assert.equal(activateExtinctionProtocol(state, 'special').reason, 'charge');
    activateExtinctionProtocol(state, 'secondary'); activateExtinctionProtocol(state, 'defense');
    assert.equal(state.protocols.charge, 0, 'buff and guard activation alone are not credit');
    for (let success = 1; success <= 5; success++) {
      let approach = 0;
      while (Math.hypot(state.enemies[0].wx - state.px, state.enemies[0].wy - state.py) > 2.25 && approach++ < 100) {
        state.angle = Math.atan2(state.enemies[0].wx - state.px, state.enemies[0].wy - state.py);
        state.moveKeys = { forward: true }; fixedStep(state, actor, 1);
      }
      assert.ok(approach < 100, `${id} must approach through the actual movement simulation`);
      state.moveKeys = {}; state.angle = Math.atan2(state.px - state.enemies[0].wx, state.py - state.enemies[0].wy);
      const before = { px: state.px, py: state.py };
      assert.equal(activateExtinctionProtocol(state, 'simple').activated, true);
      assert.ok(Math.hypot(state.px - before.px, state.py - before.py) >= 1);
      assert.equal(state.protocols.charge, success * 20, id);
      fixedStep(state, actor, 20);
    }
    assert.equal(state.protocols.successfulEvasions, 5);
    const hp = state.enemies[0].hp;
    assert.equal(protocols.getExtinctionProtocolStatus(state, 'special'), 'ready');
    assert.equal(activateExtinctionProtocol(state, 'special').activated, true);
    assert.equal(state.protocols.charge, 0); assert.ok(state.enemies[0].hp < hp);
    assert.equal(state.weapon.type, 'pistol'); assert.equal(state.ammo, 24); assert.equal(state.personalKit, undefined);
    assert.ok(getExtinctionFighterProfile(actor).ultimateCharge.rule.fr.includes('20'));
    assert.ok(getExtinctionFighterProfile(actor).ultimateCharge.rule.en.includes('20'));
  }
});

test('mobility charge rejects empty, harmless, distant, approaching, wall-clipped, paused and foreign-run activations', () => {
  const cases = [
    state => { state.enemies = []; },
    state => { state.enemies[0].dmg = 0; },
    state => { state.enemies[0].hp = 0; },
    state => { state.enemies[0].wy = 25; },
    state => { state.angle = 0; },
    state => { state.py = 28; state.enemies[0].wy = 27; state.angle = 0; },
    state => { state.py = 27.6; state.enemies[0].wy = 26.6; state.angle = 0; },
    state => { state.enemies.push({ ...enemy(11.6), id: 'other-threat', dmg: 4 }); },
    state => { state.paused = true; },
    state => { state.heroId = 'another-hero'; },
    state => { state.runId = 'another-run'; }
  ];
  for (const change of cases) {
    const state = liveState('hw_wheelchair_guy'); state.py = 14; state.angle = Math.PI; change(state);
    activateExtinctionProtocol(state, 'simple'); assert.equal(state.protocols.charge, 0);
  }
  const state = liveState('hw_wheelchair_guy'); activateExtinctionProtocol(state, 'defense');
  assert.ok(mitigateExtinctionProtocolDamage(state, 100) < 100);
  assert.equal(state.protocols.charge, 0, 'a nominal mitigation calculation is not an actual credited event');
  state.fieldDirective = directives.createExtinctionFieldDirective(state, { enabled: true, mode: 'last_signal' }); state.runMode = 'last_signal';
  const marker = state.fieldDirective.markers[0]; state.px = marker.wx; state.py = marker.wy; state.enemies = [];
  directives.interactExtinctionFieldDirective(state);
  for (let tick = 0; tick < 120; tick++) { state.t++; directives.tickExtinctionFieldDirective(state); }
  directives.interactExtinctionFieldDirective(state); directives.interactExtinctionFieldDirective(state);
  assert.equal(state.protocols.charge, 0, 'objective interactions, including repeats, are not evasions');
});

const PICKUP_FIXTURES = {
  shotgun: { type: 'shotgun', ammo: 8, maxAmmo: 8, fireRate: 1.5, spread: .28, dmgMult: 2.1, color: '#e67e22' },
  plasma: { type: 'plasma', ammo: 60, maxAmmo: 60, fireRate: .45, spread: .05, dmgMult: .65, color: '#3498db' },
  rocket: { type: 'rocket', ammo: 4, maxAmmo: 4, fireRate: 2.4, spread: .15, dmgMult: 4.5, color: '#e74c3c' }
};
function pickupRun(type, id = 'masterchief') {
  const state = liveState(id);
  state.t = 100; state.weapon = { ...PICKUP_FIXTURES[type] }; state.ammo = state.weapon.ammo;
  state.enemies = [{ ...enemy(4), speed: 0, dmg: 0 }];
  return state;
}

test('the real fire callback gives all three pickups their own delivery in each mode and preserves personal actions', () => {
  for (const id of ['masterchief', 'arca_mirelle', 'predator', 'lilo_pelekai']) {
    for (const mode of ['extraction', 'last_signal', 'infestation', 'hunt']) {
      for (const type of Object.keys(PICKUP_FIXTURES)) {
        const state = pickupRun(type, id); state.runMode = mode;
        const profile = JSON.stringify(state.protocols.profile), casts = { ...state.protocols.casts }, ammo = state.ammo;
        callback('fire', state)();
        assert.equal(state.ammo, ammo - 1, `${id}/${mode}/${type}`);
        assert.equal(state.weapon.ammo, state.ammo);
        if (type === 'shotgun') {
          assert.ok(state.enemies[0].hp < 500); assert.equal(state.protocols.projectiles.length, 0);
        } else {
          assert.equal(state.enemies[0].hp, 500, 'a launched projectile has not impacted yet');
          const shot = state.protocols.projectiles[0];
          assert.equal(shot.source, 'pickup'); assert.equal(shot.weaponType, type);
          assert.equal(shot.ownerId, id); assert.equal(shot.runId, state.runId);
          fixedStep(state, hero(id), 18);
          assert.ok(state.enemies[0].hp < 500, 'the actual component loop advances projectile collision');
        }
        assert.deepEqual(state.protocols.casts, casts);
        assert.equal(JSON.stringify(state.protocols.profile), profile, 'pickup never rewrites or borrows a personal action');
        assert.equal(state.rewards, undefined);
      }
    }
  }
});

test('shotgun pellets stop at their first body, stay within nine units and concentrate only at close range', () => {
  const state = pickupRun('shotgun');
  const front = { ...enemy(1), size: 2 }, behind = { ...enemy(4), id: 'behind' };
  const side = { ...enemy(2), id: 'side', wx: 4 }, back = { ...enemy(-2), id: 'back' }, far = { ...enemy(10), id: 'far' };
  state.enemies = [behind, far, side, back, front];
  const result = protocols.fireExtinctionPickupWeapon(state);
  assert.equal(result.pellets, 7); assert.equal(result.damage, 71); assert.equal(result.hitCount, 1);
  assert.equal(front.hp, 429);
  for (const target of [behind, far, side, back]) assert.equal(target.hp, 500);
  assert.equal(state.protocols.charge, 8, 'one shot does not give seven ultimate credits');
  const distant = pickupRun('shotgun'); distant.enemies[0].wy = 10;
  assert.equal(protocols.fireExtinctionPickupWeapon(distant).reason, 'miss');
  assert.equal(distant.enemies[0].hp, 500); assert.equal(distant.protocols.charge, 0);
  const medium = pickupRun('shotgun'); protocols.fireExtinctionPickupWeapon(medium);
  assert.ok(medium.enemies[0].hp > front.hp && medium.enemies[0].hp < 500, 'spread lowers damage beyond point-blank range');
});

test('a shotgun spreads across separate targets without penetrating a centre target or multiplying charge', () => {
  const state = pickupRun('shotgun');
  const front = enemy(4), left = { ...enemy(Math.cos(.28) * 4), id: 'left', wx: -Math.sin(.28) * 4 },
    right = { ...enemy(Math.cos(.28) * 4), id: 'right', wx: Math.sin(.28) * 4 }, behind = { ...enemy(7), id: 'behind' };
  state.enemies = [behind, right, front, left];
  const result = protocols.fireExtinctionPickupWeapon(state);
  assert.equal(result.hitCount, 3);
  for (const target of [front, left, right]) assert.ok(target.hp < 500);
  assert.equal(behind.hp, 500); assert.equal(state.protocols.charge, 8); assert.equal(state.ammo, 7);
});

test('plasma travels, can miss a moving target and collides with the closest body before a farther one', () => {
  const state = pickupRun('plasma'); const near = enemy(3), far = { ...enemy(6), id: 'far' }; state.enemies = [far, near];
  protocols.fireExtinctionPickupWeapon(state); tick(state, 1);
  assert.equal(near.hp, 500); assert.equal(state.protocols.projectiles[0].wy, .6);
  tick(state, 9); assert.equal(near.hp, 478); assert.equal(far.hp, 500);
  assert.equal(state.protocols.projectiles.length, 0); assert.equal(state.protocols.charge, 8);
  const moving = pickupRun('plasma'); protocols.fireExtinctionPickupWeapon(moving);
  moving.enemies[0].wx = 4; tick(moving, 41);
  assert.equal(moving.enemies[0].hp, 500); assert.equal(moving.protocols.charge, 0);
  assert.equal(moving.protocols.projectiles.length, 0, 'a missed projectile expires at its bounded range');
});

test('Slayer pickup projectiles keep close damage at impact, including movement and individual blast victims', () => {
  assert.equal(hero('doomslayer').category, 'slayer');
  for (const type of ['plasma', 'rocket']) {
    for (const id of ['masterchief', 'doomslayer']) for (const range of [1, 2.2, 3]) for (const multiplier of [1, 1.25]) {
      const state = pickupRun(type, id); state.heroCategory = hero(id).category; state.enemies = [enemy(range)];
      protocols.fireExtinctionPickupWeapon(state, { damageMultiplier: multiplier });
      assert.equal(state.enemies[0].hp, 500, 'the close bonus must not apply damage before flight');
      const raw = 34 * multiplier * PICKUP_FIXTURES[type].dmgMult;
      const expected = Math.round(raw * (id === 'doomslayer' && range < 2.2 ? 1.45 : 1));
      tick(state, 20);
      assert.equal(state.enemies[0].hp, 500 - expected, `${id}/${type}: ${range} units, multiplier ${multiplier}`);
      assert.equal(state.protocols.charge, 8, 'bonus damage does not multiply charge');
    }
    for (const [range, playerY, close] of [[4, 3, true], [1, -3, false]]) {
      const state = pickupRun(type, 'doomslayer'); state.heroCategory = 'slayer'; state.enemies = [enemy(range)];
      protocols.fireExtinctionPickupWeapon(state); state.py = playerY;
      assert.equal(state.enemies[0].hp, 500);
      tick(state, 20);
      const expected = Math.round(34 * PICKUP_FIXTURES[type].dmgMult * (close ? 1.45 : 1));
      assert.equal(state.enemies[0].hp, 500 - expected, `${type}: proximity follows the player at impact`);
    }
  }
  const blast = id => {
    const state = pickupRun('rocket', id); state.heroCategory = hero(id).category;
    state.enemies = [enemy(1), { ...enemy(1), id: 'close-splash', wx: 1.2 }, { ...enemy(1), id: 'far-splash', wx: 2.1 }];
    protocols.fireExtinctionPickupWeapon(state); tick(state, 20); return state;
  };
  const marine = blast('masterchief'), slayer = blast('doomslayer');
  assert.ok(slayer.enemies[0].hp < marine.enemies[0].hp);
  assert.ok(slayer.enemies[1].hp < marine.enemies[1].hp, 'a nearby blast victim receives close damage');
  assert.equal(slayer.enemies[2].hp, marine.enemies[2].hp, 'a distant blast victim does not inherit the direct target’s bonus');
  assert.ok(slayer.enemies[2].hp < 500, 'the distant victim is actually inside the blast');
  assert.equal(slayer.protocols.charge, 8);
});

test('projectile segment collision catches fast shots and range exhaustion does not create a remote explosion', () => {
  for (const type of ['plasma', 'rocket']) {
    const state = pickupRun(type), near = enemy(3), far = { ...enemy(8), id: 'far' }; state.enemies = [far, near];
    protocols.fireExtinctionPickupWeapon(state); state.protocols.projectiles[0].vy = 10; tick(state, 1);
    assert.ok(near.hp < 500); assert.equal(far.hp, 500, type);
    const miss = pickupRun(type); miss.enemies[0].wy = 25;
    protocols.fireExtinctionPickupWeapon(miss); tick(miss, 90);
    assert.equal(miss.enemies[0].hp, 500); assert.equal(miss.protocols.projectiles.length, 0);
    assert.equal(miss.protocols.effects.filter(item => item.kind === 'explosion').length, 0, 'expiry without collision is not an explosion');
  }
});

test('rocket impact damages nearby threats with falloff, counts each kill once and gives one charge credit', () => {
  const state = pickupRun('rocket'); const direct = enemy(4), nearby = { ...enemy(4), id: 'nearby', wx: 1.2 }, far = { ...enemy(4), id: 'far', wx: 3 };
  state.enemies = [nearby, far, direct];
  protocols.fireExtinctionPickupWeapon(state); assert.deepEqual(state.enemies.map(item => item.hp), [500, 500, 500]);
  tick(state, 14);
  assert.equal(direct.hp, 347); assert.ok(nearby.hp > direct.hp && nearby.hp < 500); assert.equal(far.hp, 500);
  assert.equal(state.protocols.charge, 8); assert.equal(state.ammo, 3);
  assert.equal(state.protocols.effects.filter(item => item.kind === 'explosion').length, 1);
  const lethal = pickupRun('rocket'); lethal.enemies = [{ ...enemy(4, 10), id: 'first' }, { ...enemy(4, 10), id: 'second', wx: 1 }];
  const drops = []; protocols.fireExtinctionPickupWeapon(lethal, { onKill: target => drops.push(target.id) });
  for (let i = 0; i < 90; i++) { lethal.t++; tickExtinctionProtocols(lethal, target => drops.push(target.id)); }
  assert.equal(lethal.kills, 2); assert.equal(new Set(drops).size, 2); assert.equal(drops.length, 2);
  assert.equal(lethal.protocols.charge, 8, 'blast victims do not multiply charge');
});

test('travelling pickups handle point-blank overlap, stale metadata and consecutive contacts without duplicate drops', () => {
  for (const type of ['plasma', 'rocket']) {
    const contact = pickupRun(type); contact.enemies = [enemy(0)];
    protocols.fireExtinctionPickupWeapon(contact); tick(contact, 1);
    assert.ok(contact.enemies[0].hp < 500, `${type}: the muzzle does not skip an overlapping threat`);
    assert.equal(contact.protocols.projectiles.length, 0);
    for (const key of ['ownerId', 'runId']) {
      const stale = pickupRun(type); stale.enemies = [enemy(0)];
      protocols.fireExtinctionPickupWeapon(stale); stale.protocols.projectiles[0][key] = 'foreign';
      tick(stale, 1);
      assert.equal(stale.enemies[0].hp, 500); assert.equal(stale.protocols.projectiles.length, 0);
      assert.equal(stale.protocols.charge, 0);
    }
  }
  const state = pickupRun('rocket'); state.enemies = [{ ...enemy(14, 10), id: 'near' }, { ...enemy(18, 10), id: 'far' }];
  const drops = [], advance = count => { for (let i = 0; i < count; i++) { state.t++; tickExtinctionProtocols(state, target => drops.push(target.id)); } };
  protocols.fireExtinctionPickupWeapon(state); advance(44);
  assert.equal(state.enemies[0].hp, 10, 'first rocket is still travelling when the next legal shot becomes available');
  assert.equal(protocols.fireExtinctionPickupWeapon(state).fired, true);
  assert.equal(state.protocols.projectiles.length, 2);
  advance(80);
  assert.deepEqual(drops, ['near', 'far']); assert.equal(state.kills, 2);
  assert.equal(state.protocols.projectiles.length, 0); assert.equal(state.protocols.charge, 16);
});

test('one explosion cannot strip drones then damage the shielded Champion through target array order', () => {
  for (const reverse of [false, true]) {
    const state = pickupRun('rocket'), boss = { ...enemy(4), id: 'boss', kind: 'Champion de Trame', shieldActive: true },
      drone = { ...enemy(4, 24), id: 'drone', kind: 'Drone Protecteur', wx: 1.2 };
    state.enemies = reverse ? [drone, boss] : [boss, drone];
    protocols.fireExtinctionPickupWeapon(state); tick(state, 44);
    assert.equal(drone.hp, 0); assert.equal(boss.hp, 500); assert.equal(state.protocols.charge, 8);
    protocols.fireExtinctionPickupWeapon(state); tick(state, 14);
    assert.equal(boss.hp, 347); assert.equal(boss.shieldActive, false);
  }
});

test('Hunt marking is evaluated on projectile impact, not remembered from the trigger press', () => {
  const state = pickupRun('rocket'); state.runMode = 'hunt';
  const boss = { ...enemy(10), id: 'champion', kind: 'Champion de Trame' }; state.enemies = [boss];
  state.fieldDirective = directives.createExtinctionFieldDirective(state, { enabled: true, mode: 'hunt' });
  assert.equal(directives.markExtinctionHuntTarget(state).activated, true);
  // Spend most of the legal marking interval before firing a slow projectile.
  for (let i = 0; i < 230; i++) { state.t++; directives.tickExtinctionFieldDirective(state); }
  protocols.fireExtinctionPickupWeapon(state);
  for (let i = 0; i < 40; i++) { state.t++; tickExtinctionProtocols(state); directives.tickExtinctionFieldDirective(state); }
  assert.equal(boss.hp, 500); assert.equal(state.hitMarkerTimer, 0); assert.equal(state.protocols.charge, 0);
  assert.match(state.statusText, /Noyau masqué/);
  assert.equal(directives.markExtinctionHuntTarget(state).activated, true);
  tick(state, 4); protocols.fireExtinctionPickupWeapon(state);
  for (let i = 0; i < 40; i++) { state.t++; tickExtinctionProtocols(state); directives.tickExtinctionFieldDirective(state); }
  assert.equal(boss.hp, 347); assert.equal(state.protocols.charge, 8);
});

test('a pickup projectile survives a legal kit switch, freezes in pause and never borrows its owner’s personal art', () => {
  for (const type of ['plasma', 'rocket']) {
    const state = liveState('arca_mirelle'); state.enemies = [enemy(6)]; state.t = 100;
    state.weapon.ammo = 11; state.ammo = 11; state.reserveAmmo = 31;
    rememberExtinctionPersonalKit(state); state.weapon = { ...PICKUP_FIXTURES[type] }; state.ammo = state.weapon.ammo;
    protocols.fireExtinctionPickupWeapon(state);
    const projectile = state.protocols.projectiles[0], source = structuredClone(projectile);
    state.paused = true; const frozen = JSON.stringify(state);
    for (let i = 0; i < 90; i++) tickExtinctionProtocols(state);
    assert.equal(protocols.fireExtinctionPickupWeapon(state).reason, 'paused'); assert.equal(JSON.stringify(state), frozen);
    state.paused = false; assert.equal(restoreExtinctionPersonalKit(state), true);
    assert.equal(state.weapon.type, 'pistol'); assert.equal(state.ammo, 11); assert.equal(state.reserveAmmo, 31);
    assert.deepEqual(projectile, source, 'switching equipment does not reset a projectile in flight');
    let imageDraws = 0;
    const context = new Proxy({ drawImage() { imageDraws++; } }, { get: (target, key) => target[key] || (() => {}), set: () => true });
    const before = JSON.stringify(state);
    protocols.drawExtinctionProtocols(context, state, 840, 430, () => ({ camZ: 3, aim: .2 }),
      { ownerId: 'arca_mirelle', image: { complete: true, naturalWidth: 300, naturalHeight: 100 } });
    assert.equal(imageDraws, 0); assert.equal(JSON.stringify(state), before);
    tick(state, 24); assert.ok(state.enemies[0].hp < 500); assert.equal(state.ammo, 11); assert.equal(state.reserveAmmo, 31);
  }
});

test('pickup fire obeys reload, empty stock, cadence, source ownership and run cleanup without rewards', () => {
  for (const type of Object.keys(PICKUP_FIXTURES)) {
    for (const [reason, mutate] of [
      ['reload', state => { state.reloadPulse = 12; }],
      ['paused', state => { state.paused = true; }],
      ['unavailable', state => { state.phase = 'ended'; }],
      ['unavailable', state => { state.hp = 0; }],
      ['unavailable', state => { state.heroId = 'foreign'; }],
      ['unavailable', state => { state.runId = 'old-run'; }],
      ['unavailable', state => { state.protocols.profile = { ...state.protocols.profile, heroId: 'foreign' }; }],
      ['unavailable', state => { state.angle = NaN; }]
    ]) {
      const state = pickupRun(type); mutate(state); const before = JSON.stringify(state);
      assert.equal(protocols.fireExtinctionPickupWeapon(state).reason, reason);
      assert.equal(JSON.stringify(state), before);
    }
    const state = pickupRun(type); protocols.fireExtinctionPickupWeapon(state);
    const before = JSON.stringify(state);
    assert.equal(protocols.fireExtinctionPickupWeapon(state).reason, 'cooldown'); assert.equal(JSON.stringify(state), before);
    tick(state, 45); state.weapon.ammo = 0; state.ammo = 0;
    assert.equal(protocols.fireExtinctionPickupWeapon(state).reason, 'ammo'); assert.equal(state.ammo, 0);
    state.phase = 'ended'; clearExtinctionProtocolEffects(state); clearExtinctionProtocolEffects(state);
    const hp = state.enemies[0].hp; tick(state, 90);
    assert.equal(state.protocols.projectiles.length, 0); assert.equal(state.protocols.effects.length, 0);
    assert.equal(state.enemies[0].hp, hp); assert.equal(state.rewards, undefined);
  }
});

test('projectile feedback aligns with the scene projection and the held pickup has bilingual instructions', () => {
  for (const type of ['plasma', 'rocket']) {
    const state = pickupRun(type), observed = [];
    protocols.fireExtinctionPickupWeapon(state);
    const ctx = new Proxy({ arc(x) { observed.push(x); }, moveTo(x) { observed.push(x); } },
      { get: (target, key) => target[key] || (() => {}), set: () => true });
    protocols.drawExtinctionProtocols(ctx, state, 1000, 500, () => ({ camZ: 3, aim: .2 }));
    assert.equal(observed[0], 656, 'world effects share the x projection used for actual threats and loot');
  }
  for (const type of Object.keys(PICKUP_FIXTURES)) {
    assert.ok(protocols.getExtinctionPickupBrief(type, 'fr').length > 70);
    assert.ok(protocols.getExtinctionPickupBrief(type, 'en').length > 70);
  }
  assert.equal(protocols.getExtinctionPickupBrief('pistol'), '', 'a personal action does not become a pickup');
});

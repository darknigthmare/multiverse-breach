import assert from 'node:assert/strict';
import { after, afterEach, before, test } from 'node:test';
import { createServer } from 'vite';
import { getHeroById } from '../src/game/heroes.js';
import { EXPANDED_EXTRA_HERO_DATA } from '../src/game/expandedUniverses.js';
import { getHeroSpriteSheetSrc } from '../src/game/spriteAssets.js';
import { getRpgActionProfile } from '../src/game/rpgTargeting.js';
import { resolveCanonHeroAttackEffect } from '../src/game/canonHeroAttackEffects.js';
import {
  applyCanonBlackPearlSourceKit, BLACK_PEARL_JACK_INCARNATION,
  BLACK_PEARL_SOURCE_UNIVERSE, CANON_BLACK_PEARL_SOURCE_KIT_IDS,
  getBlackPearlSourceAmmunition, getCanonBlackPearlSourcePlaque
} from '../src/game/canonBlackPearlSourceKits.js';

const ACTIONS = ['simple', 'secondary', 'defense', 'special'];
const EXPECTED_STATS = {
  jack_sparrow_potc: { hp: 100, atk: 12, def: 6, spd: 6 },
  will_turner_potc: { hp: 105, atk: 14, def: 5, spd: 6 },
  elizabeth_swann_potc: { hp: 120, atk: 11, def: 7, spd: 4 }
};

test('all three 2003 playable identities retain their saved IDs, baseline balance and sprite paths', () => {
  assert.deepEqual([...CANON_BLACK_PEARL_SOURCE_KIT_IDS].sort(), Object.keys(EXPECTED_STATS).sort());
  for (const id of CANON_BLACK_PEARL_SOURCE_KIT_IDS) {
    const hero = getHeroById(id);
    assert.equal(hero.universe, BLACK_PEARL_SOURCE_UNIVERSE, id);
    assert.match(hero.incarnation, /The Curse of the Black Pearl \(2003\)/, id);
    assert.deepEqual(hero.stats, EXPECTED_STATS[id], id);
    assert.equal(hero.simple.dmg, 1, id);
    assert.equal(hero.secondary.dmg, 2.2, id);
    assert.equal(hero.secondary.cd, 8, id);
    assert.equal(hero.defense.dur, 2, id);
    assert.equal(hero.defense.reduce, 0.75, id);
    assert.equal(hero.special.dmg, 4.5, id);
    assert.equal(hero.visualReviewStatus, 'pending', id);
    assert.equal(hero.canonCombatPresentation, true, id);
    const corrected = applyCanonBlackPearlSourceKit(hero);
    assert.equal(getHeroSpriteSheetSrc(corrected), getHeroSpriteSheetSrc(hero), id);
    for (const url of hero.referenceUrls) assert.equal(new URL(url).protocol, 'https:');
    const expanded = EXPANDED_EXTRA_HERO_DATA[BLACK_PEARL_SOURCE_UNIVERSE].find(item => item.id === id);
    assert.equal(expanded.weaponType, corrected.weaponType, id);
    assert.equal(expanded.special.type, 'melee', id);
  }
});

test('source-kit projection preserves custom numerical balances without mutating caller profiles or source arrays', () => {
  for (const id of CANON_BLACK_PEARL_SOURCE_KIT_IDS) {
    const original = structuredClone(getHeroById(id));
    Object.assign(original.secondary, { dmg: 9.25, cd: 19, resourceCost: 37 });
    const snapshot = structuredClone(original);
    const corrected = applyCanonBlackPearlSourceKit(original);
    assert.deepEqual(original, snapshot, id);
    assert.deepEqual(applyCanonBlackPearlSourceKit(corrected), corrected, id);
    for (const key of ACTIONS) {
      for (const [name, value] of Object.entries(original[key])) {
        if (typeof value === 'number') assert.equal(corrected[key][name], value, `${id}:${key}.${name}`);
      }
    }
    corrected.simple.attackProfile.delivery = 'test-only';
    corrected.equipment.push('test-only');
    if (corrected.sourceAmmunition) corrected.sourceAmmunition.actionIds.push('special');
    assert.deepEqual(original, snapshot, id);
    assert.equal(applyCanonBlackPearlSourceKit(original).simple.attackProfile.delivery, 'melee', id);
    assert.equal(getBlackPearlSourceAmmunition(original)?.actionIds.includes('special'), id === 'jack_sparrow_potc' ? false : undefined);
  }
});

test('unrelated IDs, other universes and prototype names do not receive the film kit or plaque', () => {
  const cases = [null, undefined, { id: 'constructor' }, { id: 'toString' },
    { id: 'will_turner_potc', universe: 'Another Universe' }, getHeroById('freeman')];
  for (const value of cases) {
    assert.equal(applyCanonBlackPearlSourceKit(value), value);
    assert.equal(getCanonBlackPearlSourcePlaque(value), null);
  }
});

test('Jack keeps his reserved pistol and non-offensive compass while Will and Elizabeth lose class powers', () => {
  const jack = getHeroById('jack_sparrow_potc');
  assert.equal(jack.incarnation, BLACK_PEARL_JACK_INCARNATION);
  assert.match(jack.secondary.name, /Reserved.*Flintlock/);
  assert.equal(getBlackPearlSourceAmmunition(jack, 'secondary').maxShots, 1);
  assert.equal(getBlackPearlSourceAmmunition(jack, 'secondary').resetPolicy, 'new-battle');
  assert.equal(getBlackPearlSourceAmmunition(jack, 'simple'), null);
  assert.equal(resolveCanonHeroAttackEffect(jack, 'secondary').kind, 'flintlock');
  assert.match(jack.loreLocalized.en, /one shot per battle/i);
  assert.match(jack.loreLocalized.en, /without an attack or automatic enemy tracking/);
  for (const id of ['will_turner_potc', 'elizabeth_swann_potc']) {
    const hero = getHeroById(id);
    for (const action of ['simple', 'secondary', 'special']) {
      assert.equal(hero[action].type, 'melee', `${id}:${action}`);
      assert.equal(getRpgActionProfile(hero, action).shape, 'single', `${id}:${action}`);
      assert.equal(getRpgActionProfile(hero, action).delivery, 'melee', `${id}:${action}`);
      assert.equal(hero[action].tacticsProfile.range, 1, `${id}:${action}`);
      assert.equal(resolveCanonHeroAttackEffect(hero, action).kind, 'melee', `${id}:${action}`);
      assert.doesNotMatch(JSON.stringify(hero[action]), /origin_aoe|signature|laser|vortex|magic|bullet/);
    }
  }
  const elizabeth = getHeroById('elizabeth_swann_potc');
  assert.equal(elizabeth.weaponType, 'knife');
  assert.match(elizabeth.sourceProps.join(' '), /Medallion.*not a weapon/);
  assert.match(elizabeth.loreLocalized.en, /Barbossa confiscates/);
  assert.match(elizabeth.visualAnchor, /No Pirate King costume/);
});

test('reserved ammunition accepts exact source actors and P2 clones while rejecting adjacent incarnations', () => {
  const jack = getHeroById('jack_sparrow_potc');
  for (const actor of [jack, { ...jack, id: 'p2:jack_sparrow_potc:0' },
    { ...jack, id: 'custom-opponent', sourceId: 'jack_sparrow_potc' }]) {
    assert.equal(getBlackPearlSourceAmmunition(actor, 'secondary').maxShots, 1);
  }
  for (const actor of [null, getHeroById('will_turner_potc'),
    { ...jack, universe: undefined }, { ...jack, universe: 'Another Universe' },
    { ...jack, incarnation: 'Pirates of the Caribbean: At World’s End (2007)' },
    { ...jack, canonCombatPresentation: false }, { ...jack, id: 'unknown', sourceId: undefined }]) {
    assert.equal(getBlackPearlSourceAmmunition(actor, 'secondary'), null);
  }
});

test('FR and EN source plaques preserve film lore and distinguish combat adaptations from visual approval', () => {
  for (const id of CANON_BLACK_PEARL_SOURCE_KIT_IDS) {
    const plaque = getCanonBlackPearlSourcePlaque(getHeroById(id));
    for (const language of ['fr', 'en']) {
      assert.match(plaque.origin[language], /2003/);
      assert.ok(plaque.dossier[language].length > 100);
      assert.match(plaque.doctrine[language], /adapt/);
      assert.match(plaque.doctrine[language], /visu/);
    }
  }
});

const engines = [];
let vite;
let EngineRpg;
let EngineTactics;
let EngineSmash;
const threats = Array.from({ length: 3 }, (_, index) => ({
  id: `black-pearl-kit-target-${index}`, name: `Target ${index}`, hp: 10000,
  atk: 1, def: 0, spd: 1, weapon: 'melee', color: '#808080'
}));
const makeEngine = (mode, heroId) => {
  const calls = [];
  const sounds = [];
  const Engine = { RPG: EngineRpg, Tactics: EngineTactics, Smash: EngineSmash }[mode];
  const engine = new Engine(760, 420, [getHeroById(heroId)],
    { monsters: threats, bosses: [], customRoster: threats },
    { add: (...args) => calls.push(args) }, cue => sounds.push(cue), () => {}, {
      universe: 'Nexus de Convergence', disableHazards: true,
      customBattle: { singleRoster: true, opponentControl: 'p2' }
    });
  engines.push(engine);
  engine.calls = calls;
  engine.sounds = sounds;
  const actor = engine.heroes[0];
  Object.assign(actor, { state: 'idle', atb: 100, specialCharge: 100, cooldown: 0 });
  if (mode === 'RPG') engine.enemyGlobalRecovery = 9999;
  else if (mode === 'Tactics') {
    Object.assign(engine, { cols: 10, rows: 8, tiles: [], obstacles: [], escortUnit: null,
      protectedArtifact: null, objective: 'rout', activeUnit: actor, activeUnitType: 'hero',
      actionPhase: 'action', selectedAction: null });
    Object.assign(actor, { gridX: 2, gridY: 2 });
    engine.enemies.forEach((unit, index) => Object.assign(unit,
      { gridX: [3, 5, 8][index], gridY: 2 }));
  } else {
    engine.syncPreMatchFromServer(3000);
    Object.assign(actor, { x: 100, y: 300, facing: 1, state: 'idle' });
    engine.enemies.forEach((unit, index) => Object.assign(unit,
      { x: [140, 160, 450][index], y: 300, currentHp: 10000, maxHp: 10000, state: 'idle' }));
  }
  calls.length = 0;
  sounds.length = 0;
  return engine;
};

before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  [{ EngineRpg }, { EngineTactics }, { EngineSmash }] = await Promise.all([
    vite.ssrLoadModule('/src/game/engineRpg.js?black-pearl-source-kits'),
    vite.ssrLoadModule('/src/game/engineTactics.js?black-pearl-source-kits'),
    vite.ssrLoadModule('/src/game/engineSmash.js?black-pearl-source-kits')
  ]);
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose?.()));
after(async () => { await vite?.close(); });

for (const heroId of CANON_BLACK_PEARL_SOURCE_KIT_IDS) {
  for (const action of ['simple', 'secondary', 'special']) {
    for (const mode of ['RPG', 'Tactics', 'Smash']) {
      test(`${mode} ${heroId} ${action} damages one valid victim without a generated laser or group burst`, () => {
        const engine = makeEngine(mode, heroId);
        const actor = engine.heroes[0];
        const hp = engine.enemies.map(unit => unit.currentHp);
        const effect = resolveCanonHeroAttackEffect(actor, action);
        assert.ok(effect);
        let victimIndex = 0;
        if (mode === 'RPG') {
          victimIndex = 2;
          assert.equal(engine.triggerAbility(actor, action, [engine.enemies[victimIndex].battleId]), true);
          assert.deepEqual(engine.enemies.map(unit => unit.currentHp), hp);
          for (let tick = 0; tick < 18; tick++) engine.update();
        } else if (mode === 'Tactics') {
          assert.equal(engine.getAttackProfile(actor, action).maxTargets, 1);
          assert.equal(engine.selectAction(action), true);
          if (effect.kind === 'melee') {
            const resources = { atb: actor.atb, cooldown: actor.cooldown, charge: actor.specialCharge };
            assert.equal(engine.handleCellClick(5, 2).handled, false);
            assert.deepEqual({ atb: actor.atb, cooldown: actor.cooldown, charge: actor.specialCharge }, resources);
          } else victimIndex = 1;
          const victim = engine.enemies[victimIndex];
          assert.equal(engine.handleCellClick(victim.gridX, victim.gridY).handled, true);
        } else assert.equal(engine.triggerAbility(actor, action), true);
        engine.enemies.forEach((unit, index) => assert.equal(unit.currentHp < hp[index], index === victimIndex));
        const kinds = engine.calls.map(call => call[7]);
        assert.ok(!kinds.includes('laser_line'));
        assert.ok(!kinds.includes('glitch'));
        if (effect.kind === 'flintlock') {
          assert.ok(kinds.includes('bullet'));
          assert.ok(kinds.includes('smoke'));
        } else {
          assert.equal(effect.kind, 'melee');
          assert.ok(engine.calls.some(call => call[7] === 'spark' && call[4] === effect.color));
          assert.ok(!kinds.includes('bullet'));
        }
      });
    }
  }
}

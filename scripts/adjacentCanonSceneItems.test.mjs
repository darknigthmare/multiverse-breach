import { after, afterEach, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { getExpandedStages, EXPANDED_GEAR, EXPANDED_UNIVERSES } from '../src/game/expandedUniverses.js';
import { EQUIP_ITEMS_DB, getHeroById } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { getEnemySpriteSheetSrc, getItemSpriteSrc } from '../src/game/spriteAssets.js';
import { resolveStageEnemyData } from '../src/game/stageEnemyResolver.js';
import { resolveStageArchiveBoss } from '../src/game/canonicalArchiveLore.js';
import { getRpgActionProfile } from '../src/game/rpgTargeting.js';

let vite;
let getEnemyLoreDescription;
let getStageLoreDescription;
let LORE_DB;
let EngineRpg;
const engines = [];
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ getEnemyLoreDescription, getStageLoreDescription } = await vite.ssrLoadModule('/src/game/loreDescriptions.js?adjacent-scene'));
  ({ LORE_DB } = await vite.ssrLoadModule('/src/game/lore.js?adjacent-scene'));
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js?adjacent-scene'));
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose()));
after(async () => { await vite?.close(); });

const universe = 'Pirates of the Caribbean';
const piratesStage = () => getExpandedStages().find(stage => stage.id === 269);

test('saved Pirates stage 269 is the 2003 treasure cavern and selects its actual Barbossa roster', () => {
  const stage = piratesStage();
  assert.equal(stage.name, 'Isla de Muerta / Barbossa Duel');
  assert.equal(stage.universe, universe);
  assert.match(stage.incarnation, /Curse of the Black Pearl \(2003\).*Isla de Muerta/);
  assert.equal(stage.bossName, 'Hector Barbossa');
  assert.equal(stage.canonicalBossName, 'Hector Barbossa');
  assert.deepEqual(stage.enemyRoster, ['Cursed Aztec Pirate', 'Hector Barbossa']);
  assert.equal(stage.enemyRosterExclusive, true);
  const resolved = resolveStageEnemyData({ stage, ...ENEMIES_DB[universe] });
  assert.deepEqual(resolved.monsters.map(enemy => enemy.name), ['Cursed Aztec Pirate']);
  assert.deepEqual(resolved.bosses.map(enemy => enemy.name), ['Hector Barbossa']);
  assert.equal(resolved.worldBoss, null, 'Calypso is not fought as a world boss in this source scene');
  assert.equal(resolveStageArchiveBoss(stage, ENEMIES_DB[universe]).name, 'Hector Barbossa');
});

test('Pirates preserves its saved mode, rewards, stats and image identities while sword combat replaces class magic', () => {
  const stage = piratesStage();
  assert.equal(stage.id, 269);
  assert.equal(stage.mode, 'RPG');
  assert.equal(stage.difficulty, 'Hard');
  assert.equal(stage.goldPrize, 143);
  assert.equal(stage.shardPrize, 44);
  assert.equal(stage.visualReviewStatus, 'pending');
  const pool = ENEMIES_DB[universe];
  const pirate = pool.monsters.find(enemy => enemy.name === 'Cursed Aztec Pirate');
  const barbossa = pool.bosses.find(enemy => enemy.name === 'Hector Barbossa');
  assert.deepEqual([pirate.hp, pirate.atk, pirate.spd], [103, 13, 4]);
  assert.deepEqual([barbossa.hp, barbossa.atk, barbossa.spd], [490, 22, 4]);
  assert.equal(pirate.weapon, 'sword');
  assert.equal(barbossa.weapon, 'sword');
  assert.equal(getEnemySpriteSheetSrc({ ...barbossa, universe }), '/sprites/generated/bosses/pirates-of-the-caribbean/hector-barbossa.png');
  assert.equal(pool.worldBoss.name, 'Calypso Maelstrom', 'the historical asset identity is not reassigned');
  assert.equal(pool.bosses.find(enemy => enemy.name === 'Davy Jones').hp, 555);
  assert.match(stage.gameplayAdaptation, /882/);
  assert.match(stage.gameplayAdaptation, /Will.*Jack/s);
  assert.doesNotMatch(stage.gameplayAdaptation, /curse.*not simulated/);
});

test('Pirates mission and combatants use the 2003 source in both archive languages instead of a maelstrom narrative', () => {
  const stage = piratesStage();
  for (const lang of ['fr', 'en']) {
    const text = getStageLoreDescription({ stage, lang, lore: LORE_DB[universe], bossIntel: ENEMIES_DB[universe].worldBoss });
    assert.match(text, /2003.*Isla de Muerta/s);
    assert.match(text, /Barbossa.*Will Turner/s);
    assert.match(text, /Adaptation Breach/);
    assert.doesNotMatch(text, /Calypso|maelstrom|Davy Jones/i);
    for (const name of stage.enemyRoster) {
      const pool = ENEMIES_DB[universe];
      const enemy = [...pool.monsters, ...pool.bosses].find(entry => entry.name === name);
      const description = getEnemyLoreDescription({ enemy, universe, lang, lore: LORE_DB[universe] });
      assert.match(description, /2003/);
      assert.match(description, /Barbossa/);
      assert.doesNotMatch(description, /Calypso|maelstrom|deformation active|active deformation/i);
    }
  }
  const jack = getHeroById('jack_sparrow_potc');
  assert.match(jack.incarnation, /Black Pearl \(2003\)/);
});

test('the expanded source lock is isolated to Pirates and does not relabel every scene in the catalog', () => {
  const stages = getExpandedStages();
  assert.equal(stages.filter(stage => stage.sourceSceneLore).length, 1);
  assert.equal(new Set(stages.map(stage => stage.id)).size, stages.length);
  assert.equal(EXPANDED_UNIVERSES.find(pack => pack.universe === universe).stageName, piratesStage().name);
  const unchanged = stages.find(stage => stage.universe === 'Minions');
  assert.ok(unchanged, 'an unrelated real expanded scene remains present');
  assert.equal(unchanged.sourceSceneLore, undefined);
});

test('the historical Joker face relic is Death of the Family and stays outside the Endgame default kit', () => {
  const item = EQUIP_ITEMS_DB.find(entry => entry.id === 'joker_face_mask');
  assert.equal(item.canonicalItemId, 'joker_reattached_face_death_of_the_family');
  assert.match(item.incarnation, /Death of the Family.*#13-17.*2012-2013/);
  assert.match(item.name.en, /Death of the Family/);
  assert.equal(item.defaultKitPolicy, 'not-part-of-endgame-joker');
  assert.match(item.desc.en, /not.*default equipment.*Endgame/);
  const joker = getHeroById('joker_n52');
  assert.match(joker.incarnation, /Endgame/);
  assert.doesNotMatch(JSON.stringify([joker.equipment, joker.simple, joker.secondary, joker.defense, joker.special]), /stapled|reattached|face mask|joker_face_mask/i);
  assert.equal(EXPANDED_GEAR.find(entry => entry.id === item.id).incarnation, item.incarnation);
});

test('the Joker relic preserves its saved ID, passive stats, price and unapproved image path', () => {
  const item = EQUIP_ITEMS_DB.find(entry => entry.id === 'joker_face_mask');
  assert.deepEqual(item.boost, { atk: 10, def: 3 });
  assert.equal(item.cost, 120);
  assert.equal(item.gameplayPolicy.runtimeEffect, 'stat-boost-only');
  assert.equal(item.visualReviewStatus, 'pending');
  assert.equal(getItemSpriteSrc(item), '/sprites/generated/items/joker-new-52/joker-face-mask.png');
  assert.equal(EQUIP_ITEMS_DB.filter(entry => entry.id === item.id).length, 1);
});

test('Luke’s blue legacy relic is ANH/ESB and does not turn the playable ROTJ blade blue', () => {
  const item = EQUIP_ITEMS_DB.find(entry => entry.id === 'blue_saber');
  assert.match(item.name.en, /Blue.*ANH.*ESB/);
  assert.match(item.incarnation, /A New Hope \(1977\).*Empire Strikes Back \(1980\)/);
  assert.match(item.sourceOwner, /Anakin Skywalker/);
  assert.match(item.desc.en, /lost on Cloud City.*distinct.*green/s);
  assert.equal(item.gameplayPolicy.replacesHeroWeapon, false);
  const luke = getHeroById('luke');
  assert.match(luke.incarnation, /Return of the Jedi \(1983\)/);
  assert.equal(luke.weaponColor, '#00ff00');
  assert.doesNotMatch(JSON.stringify(luke.equipment), /inherited blue|ANH|ESB/i);
});

test('the blue saber preserves saved identity and passive economics without certifying its old image', () => {
  const item = EQUIP_ITEMS_DB.find(entry => entry.id === 'blue_saber');
  assert.equal(item.id, 'blue_saber');
  assert.deepEqual(item.boost, { atk: 15 });
  assert.equal(item.cost, 150);
  assert.equal(item.gameplayPolicy.runtimeEffect, 'stat-boost-only');
  assert.equal(item.visualReviewStatus, 'pending');
  assert.equal(getItemSpriteSrc(item), '/sprites/generated/items/star-wars/blue-saber.png');
  assert.equal(EQUIP_ITEMS_DB.filter(entry => entry.id === item.id).length, 1);
});

for (const name of ['Cursed Aztec Pirate', 'Hector Barbossa']) {
  test(`${name} has named contact profiles and preserves inherited RPG multipliers and cooldown`, () => {
    const pool = ENEMIES_DB[universe];
    const enemy = [...pool.monsters, ...pool.bosses].find(entry => entry.name === name);
    const expected = { simple: 1, secondary: 1.45, special: name === 'Hector Barbossa' ? 1 : 1.15 };
    for (const ability of ['simple', 'secondary', 'special']) {
      const profile = getRpgActionProfile(enemy, ability, 'enemy');
      assert.match(profile.name, /Sword/);
      assert.equal(profile.effect, 'damage');
      assert.equal(profile.delivery, 'melee');
      assert.equal(profile.shape, 'single');
      assert.equal(profile.maxTargets, 1);
      assert.equal(profile.multiplier, expected[ability]);
      assert.doesNotMatch(profile.name, /Strong attack|Special|Breach Pattern|magic|laser/i);
    }
    assert.equal(enemy.secondary.cd, 3);
  });

  for (const ability of ['simple', 'secondary', 'special']) {
    test(`actual stage 269 ${name} ${ability} reaches one chosen hero with a sword and emits no projectile`, () => {
      const calls = [];
      const sounds = [];
      const stage = piratesStage();
      const resolved = resolveStageEnemyData({ stage, ...ENEMIES_DB[universe] });
      const heroes = ['arca_mirelle', 'arca_marrow', 'arca_loom'].map(getHeroById);
      const engine = new EngineRpg(760, 420, heroes, resolved,
        { add: (...args) => calls.push(args) }, sound => sounds.push(sound), () => {}, stage);
      engines.push(engine);
      engine.opponentControl = 'p2';
      engine.enemyGlobalRecovery = 0;
      assert.equal(engine.wave, 1, 'the source curse ritual and duel share one encounter');
      assert.equal(engine.maxWaves, 1);
      assert.deepEqual(engine.enemies.map(enemy => enemy.name), ['Cursed Aztec Pirate', 'Cursed Aztec Pirate', 'Hector Barbossa']);
      assert.equal(engine.getPiratesCurseEncounterState().curseActive, true);
      const actor = engine.enemies.find(enemy => enemy.name === name);
      assert.ok(actor);
      actor.atb = 100;
      actor.specialCharge = 100;
      actor.cooldown = 0;
      const target = engine.heroes[1];
      const hp = engine.heroes.map(hero => hero.currentHp);
      const home = { x: actor.homeX, y: actor.homeY };
      calls.length = 0;
      sounds.length = 0;
      const context = engine.getActionContext(actor, ability, 'enemy');
      assert.equal(context.profile.delivery, 'melee');
      assert.equal(engine.executeRpgAction(context, [target.battleId]), true);
      assert.notDeepEqual({ x: actor.x, y: actor.y }, home, 'the actor moves to sword contact');
      assert.ok(sounds.includes('slash'));
      assert.ok(!sounds.includes('shoot'));
      assert.ok(!calls.some(call => call[7] === 'laser_line'));
      assert.equal(actor.cooldown, ability === 'secondary' ? 180 : 0);
      for (let frame = 0; frame < 11; frame++) engine.update();
      assert.deepEqual(engine.heroes.map(hero => hero.currentHp), hp, 'contact damage waits for the melee impact');
      engine.update();
      engine.heroes.forEach((hero, index) => assert.equal(hero.currentHp < hp[index], index === 1));
      assert.equal(actor.x, home.x);
      assert.equal(actor.y, home.y);
    });
  }
}

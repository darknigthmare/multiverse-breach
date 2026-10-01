import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { CANON_PRIORITY_STAGES } from '../src/game/canonPriorityStages.js';
import {
  CANONICAL_ARCHIVE_ENEMY_LORE,
  getCanonicalArchiveEnemyLore,
  getCanonicalArchiveStageLore,
  resolveStageArchiveBoss
} from '../src/game/canonicalArchiveLore.js';

let vite;
let ENEMIES_DB;
let LORE_DB;
let getEnemyLoreDescription;
let getStageLoreDescription;

before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ ENEMIES_DB } = await vite.ssrLoadModule('/src/game/enemies.js?canonical-archive'));
  ({ LORE_DB } = await vite.ssrLoadModule('/src/game/lore.js?canonical-archive'));
  ({ getEnemyLoreDescription, getStageLoreDescription } = await vite.ssrLoadModule('/src/game/loreDescriptions.js?canonical-archive'));
});
after(async () => { await vite?.close(); });

const scenarios = [
  [CANON_PRIORITY_STAGES.lightmassTrain, /Lightmass.*RAAM|RAAM.*Lightmass/s, /Aspho Fields|Brumak|Skorge/],
  [CANON_PRIORITY_STAGES.metropolisScarab, /Metropolis.*New Mombasa.*Protos/s, /Installation 04|Halo CE|Deutoros/],
  [CANON_PRIORITY_STAGES.hadleysQueen, /Hadley.*Newt.*Sulaco/s, /Derelict Hive|Predalien|Praetorian/],
  [CANON_PRIORITY_STAGES.xenNihilanth, /Xen.*Nihilanth/s, /Anomalous Materials|Combine Strider|Race X/],
  [CANON_PRIORITY_STAGES.shadowMoses, /Shadow Moses.*REX.*Liquid Snake/s, /Operation furtive|Moissonneur|Arsenal Gear/],
  [CANON_PRIORITY_STAGES.legatesCamp, /Hoover Dam.*Lanius.*Blade of the East/s, /Liberty Prime|Seigneur Mutant/]
];

test('the six real archive opponents match the six selected mission rosters', () => {
  for (const [stage] of scenarios) {
    const pool = ENEMIES_DB[stage.universe];
    const enemy = resolveStageArchiveBoss(stage, pool);
    assert.equal(enemy?.name, stage.bossName, `stage ${stage.id} must not use its universe's unrelated world boss`);
    assert.equal(enemy.canonicalName || enemy.name, stage.canonicalBossName);
    assert.ok(stage.enemyRoster.includes(enemy.name));
  }
});

test('an explicitly missing or disabled boss does not become another universe boss', () => {
  const pool = { bosses: [{ name: 'Other local boss' }], worldBoss: { name: 'Unrelated world boss' } };
  assert.equal(resolveStageArchiveBoss({ bossName: 'Missing source boss' }, pool), null);
  const stage = CANON_PRIORITY_STAGES.metropolisScarab;
  const withoutScarab = { ...ENEMIES_DB.Halo, worldBoss: null };
  assert.equal(resolveStageArchiveBoss(stage, withoutScarab), null);
});

test('archive boss resolution preserves the fallback only when no opponent is specified', () => {
  const worldBoss = { name: 'World opponent' };
  const boss = { name: 'Local opponent' };
  assert.equal(resolveStageArchiveBoss({}, { worldBoss, bosses: [boss] }), worldBoss);
  assert.equal(resolveStageArchiveBoss({}, { bosses: [boss] }), boss);
  assert.equal(resolveStageArchiveBoss(null, {}), null);
  assert.equal(resolveStageArchiveBoss({}, {}), null);
});

test('an exact historical opponent beats a canonical alias and monster objectives are resolvable', () => {
  const exact = { name: 'Historical key', canonicalName: 'Canon opponent' };
  const alias = { name: 'Different key', canonicalName: 'Canon opponent' };
  assert.equal(resolveStageArchiveBoss({ bossName: 'Historical key', canonicalBossName: 'Canon opponent' }, { bosses: [alias, exact] }), exact);
  assert.equal(resolveStageArchiveBoss({ bossName: 'Canon opponent' }, { monsters: [exact] }), exact);
});

for (const [stage, required, forbidden] of scenarios) {
  test(`stage ${stage.id} keeps its source setting in both archive languages despite conflicting generic intel`, () => {
    for (const lang of ['fr', 'en']) {
      const text = getStageLoreDescription({
        stage, lang, lore: LORE_DB[stage.universe],
        bossIntel: { name: 'Wrong universe-wide boss' }
      });
      assert.match(text, required);
      assert.doesNotMatch(text, forbidden);
      assert.doesNotMatch(text, /Wrong universe-wide boss|point de rupture|rupture point/);
      assert.ok(text.includes(stage.incarnation));
      assert.match(text, /Adaptation Breach/);
      assert.ok(text.includes(String(stage.goldPrize)));
      assert.ok(text.includes(String(stage.shardPrize)));
    }
  });

  test(`stage ${stage.id} enemy archive entries identify the source instead of the generic franchise arena`, () => {
    const pool = ENEMIES_DB[stage.universe];
    const enemies = [...pool.monsters, ...pool.bosses, pool.worldBoss].filter(Boolean);
    for (const name of stage.enemyRoster) {
      const enemy = enemies.find(candidate => candidate.name === name);
      assert.ok(enemy, `actual runtime enemy ${name} exists`);
      const before = structuredClone(enemy);
      const locked = getCanonicalArchiveEnemyLore(stage.universe, enemy);
      assert.ok(locked, `${name} has its opt-in canonical notice`);
      assert.match(locked.referenceUrl, /^https:\/\//);
      for (const lang of ['fr', 'en']) {
        const text = getEnemyLoreDescription({ enemy, universe: stage.universe, lang, lore: LORE_DB[stage.universe] });
        assert.ok(text.includes(locked.incarnation));
        assert.ok(text.includes(locked.lore[lang]));
        assert.doesNotMatch(text, /deformation active|active deformation|Installation 04|Anomalous Materials Lab|Metal Gear fantome/);
      }
      assert.deepEqual(enemy, before, 'displaying lore cannot relabel or approve its sprite');
    }
  });
}

test('source notices do not leak onto different incarnations, franchises or prototype names', () => {
  assert.equal(getCanonicalArchiveEnemyLore('Halo', { name: 'Covenant Scarab Mech', incarnation: 'Halo 3 (2007)' }), null);
  assert.equal(getCanonicalArchiveEnemyLore('Half-Life', { name: 'Vortigaunt Shock Trooper', incarnation: 'Half-Life 2 (2004)' }), null);
  assert.equal(getCanonicalArchiveEnemyLore('Fallout', { name: 'Metal Gear REX Shadow' }), null);
  assert.equal(getCanonicalArchiveEnemyLore('Halo', { name: 'constructor' }), null);
  assert.equal(getCanonicalArchiveEnemyLore('__proto__', { name: 'Covenant Scarab Mech' }), null);
  assert.equal(getCanonicalArchiveStageLore({ ...CANON_PRIORITY_STAGES.metropolisScarab, incarnation: 'Halo CE (2001)' }), null);
  assert.equal(getCanonicalArchiveStageLore({ ...CANON_PRIORITY_STAGES.metropolisScarab, universe: 'Different world' }), null);
  assert.equal(getCanonicalArchiveStageLore({ ...CANON_PRIORITY_STAGES.metropolisScarab, characterArc: {} }), null);
  assert.equal(getCanonicalArchiveStageLore({ ...CANON_PRIORITY_STAGES.metropolisScarab, id: 99999 }), null);
});

test('the scope contains sixteen mission notices and four Pirates notices without a visual approval field', () => {
  const entries = Object.values(CANONICAL_ARCHIVE_ENEMY_LORE).flatMap(Object.values);
  assert.equal(entries.length, 20);
  assert.equal(Object.keys(CANONICAL_ARCHIVE_ENEMY_LORE).length, 7);
  assert.ok(entries.every(entry => !Object.hasOwn(entry, 'visualReviewStatus')));
});

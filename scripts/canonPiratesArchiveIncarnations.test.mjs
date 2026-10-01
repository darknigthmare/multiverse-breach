import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';
import { getCanonicalArchiveEnemyLore } from '../src/game/canonicalArchiveLore.js';

const universe = 'Pirates of the Caribbean';
const cases = [
  ['Davy Jones', /Dead Man.s Chest \(2006\)/, /Hollandais volant|Flying Dutchman/],
  ['Flying Dutchman Crew', /Dead Man.s Chest \(2006\)/, /Bootstrap Bill Turner/],
  ['East India Company Marine', /At World.s End \(2007\)/, /Cutler Beckett/],
  ['Calypso Maelstrom', /At World.s End \(2007\)/, /Tia Dalma/]
];
let vite;
let pool;
let lore;
let getEnemyLoreDescription;
let getUniverseLoreDescription;

before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  const { ENEMIES_DB } = await vite.ssrLoadModule('/src/game/enemies.js?pirates-archive-incarnations');
  const { LORE_DB } = await vite.ssrLoadModule('/src/game/lore.js?pirates-archive-incarnations');
  ({ getEnemyLoreDescription, getUniverseLoreDescription } = await vite.ssrLoadModule('/src/game/loreDescriptions.js?pirates-archive-incarnations'));
  pool = ENEMIES_DB[universe];
  lore = LORE_DB[universe];
});
after(async () => { await vite?.close(); });

const findEnemy = name => [...pool.monsters, ...pool.bosses, pool.worldBoss].filter(Boolean)
  .find(enemy => enemy.name === name);

for (const [name, incarnation, fact] of cases) {
  test(`the real global ${name} archive has its own later-film source in both languages`, () => {
    const enemy = findEnemy(name);
    assert.ok(enemy, `${name} remains in the existing global roster`);
    const original = structuredClone(enemy);
    const notice = getCanonicalArchiveEnemyLore(universe, enemy);
    assert.ok(notice);
    assert.match(notice.incarnation, incarnation);
    assert.match(notice.referenceUrl, /^https:\/\//);
    for (const lang of ['fr', 'en']) {
      const text = getEnemyLoreDescription({ enemy, universe, lang, lore, type: enemy === pool.worldBoss ? 'worldBoss' : 'menace' });
      assert.match(text, incarnation);
      assert.match(text, fact);
      assert.doesNotMatch(text, /Isla de Muerta|The Curse of the Black Pearl \(2003\)|deformation active|active deformation|pression de Calypso|pressure from Calypso/);
    }
    assert.deepEqual(enemy, original, 'rendering the new lore preserves IDs, stats and image fields');
  });
}

test('later-film notices are opt-in to exact names, franchise and compatible source incarnation', () => {
  for (const [name] of cases) {
    const enemy = findEnemy(name);
    assert.equal(getCanonicalArchiveEnemyLore('Halo', enemy), null);
    assert.equal(getCanonicalArchiveEnemyLore(universe, { ...enemy, name: `${name} Prototype` }), null);
    assert.equal(getCanonicalArchiveEnemyLore(universe, { ...enemy, incarnation: 'Pirates of the Caribbean: The Curse of the Black Pearl (2003)' }), null);
  }
  assert.equal(getCanonicalArchiveEnemyLore(universe, { name: 'constructor' }), null);
  assert.equal(getCanonicalArchiveEnemyLore('__proto__', { name: 'Davy Jones' }), null);
});

test('Calypso retains her released goddess lore while its numerical boss is labelled original project adaptation', () => {
  const notice = getCanonicalArchiveEnemyLore(universe, findEnemy('Calypso Maelstrom'));
  assert.match(notice.name, /manifestation originale Multiverse/);
  assert.match(notice.lore.fr, /Tia Dalma.*crabes.*tempête/s);
  assert.match(notice.lore.en, /Tia Dalma.*crabs.*storm/s);
  assert.match(notice.lore.fr, /manifestation de combat originale du projet Multiverse/);
  assert.match(notice.lore.en, /original Multiverse combat manifestation/);
  assert.match(notice.lore.fr, /attaques numériques sont des adaptations/);
  assert.match(notice.lore.en, /numerical attacks are adaptations/);
  assert.ok(!Object.hasOwn(notice, 'visualReviewStatus'), 'the lore notice cannot certify its existing boss image');
});

test('the compass and moving-islands Nexus premise is explicitly original Multiverse plot in actual universe lore', () => {
  for (const lang of ['fr', 'en']) {
    const text = getUniverseLoreDescription({ universe, lore, lang });
    assert.match(text, /2007/);
    assert.match(text, lang === 'fr' ? /intrigue originale du projet Multiverse/ : /original Multiverse plot/);
    assert.match(text, lang === 'fr' ? /scenario crossover est invente.*ni une capacite source de la boussole/s : /crossover premise is invented.*not a scene or source compass ability/s);
  }
});

test('the two original 2003 opponents keep their explicit source notice', () => {
  for (const name of ['Hector Barbossa', 'Cursed Aztec Pirate']) {
    const enemy = findEnemy(name);
    const notice = getCanonicalArchiveEnemyLore(universe, enemy);
    assert.match(notice.incarnation, /The Curse of the Black Pearl \(2003\)/);
    for (const lang of ['fr', 'en']) {
      assert.match(getEnemyLoreDescription({ enemy, universe, lore, lang }), /The Curse of the Black Pearl \(2003\)/);
    }
  }
});

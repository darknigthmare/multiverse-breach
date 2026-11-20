import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { ENEMY_SPRITE_BINDINGS, getBoundEnemySpriteSrc } from '../src/game/enemySpriteBindings.js';
import { SOURCE_SCENE_STAGES } from '../src/game/sourceSceneStages.js';
import { preserveEnemySpriteIdentity } from '../src/game/enemySpriteIdentity.js';
import { getEnemySpriteSheetSrc, getSpriteSheetLayout } from '../src/game/spriteAssets.js';

const originalTemplates = {
  'Chestburster Larva': { name: 'Chestburster Larva', hp: 45, atk: 16, spd: 8, color: '#c7a17a', weapon: 'inner_jaw' },
  'Big Chap Stalker': { name: 'Big Chap Stalker', hp: 560, atk: 22, spd: 7, color: '#05070a', weapon: 'tail', special: 'Vent Shaft Ambush' },
  'Synthetic Ash Protocol': { name: 'Synthetic Ash Protocol', hp: 115, atk: 12, spd: 5, color: '#e8e8df', weapon: 'corporate_override' }
};

for (const [name, binding] of Object.entries(ENEMY_SPRITE_BINDINGS)) {
  test(`${name}: the live DLC catalogue resolves the already delivered 1979 sheet`, () => {
    const roster = ENEMIES_DB.Alien;
    const template = [...roster.monsters, ...roster.bosses].find(actor => actor.name === name);
    assert.ok(template, name);
    const { incarnation, ...gameplay } = template;
    assert.equal(incarnation, binding.incarnation);
    assert.deepEqual(gameplay, originalTemplates[name], 'only the source-edition metadata changes');
    const actor = { ...template, universe: 'Alien' };
    const before = structuredClone(actor);
    assert.equal(getBoundEnemySpriteSrc(actor), binding.sheet);
    assert.equal(getEnemySpriteSheetSrc(actor), binding.sheet);
    assert.deepEqual(actor, before, 'resolving art cannot mutate gameplay');
    assert.equal(binding.visualFidelityApproved, false);
    const png = readFileSync(new URL(`../public${binding.sheet}`, import.meta.url));
    assert.equal(createHash('sha256').update(png).digest('hex'), binding.sha256, 'preserve the exact previously authored bitmap');
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(png.readUInt32BE(16), 1024);
    assert.equal(png.readUInt32BE(20), 1024);
    const layout = getSpriteSheetLayout(binding.sheet);
    assert.equal(layout.columns, 4);
    assert.equal(layout.rows, 4);
    const mixed = { ...preserveEnemySpriteIdentity(actor), universe: 'Other', name: `${name} Echo` };
    assert.equal(getEnemySpriteSheetSrc(mixed), binding.sheet, 'the established body survives a battle label projection');
  });

  test(`${name}: another edition, weapon, universe or organism cannot borrow the sheet`, () => {
    const actor = { ...originalTemplates[name], universe: 'Alien', incarnation: 'Alien (1979)' };
    for (const changed of [
      { incarnation: 'Aliens (1986)' }, { incarnation: 'Alien: Covenant (2017)' },
      { incarnation: undefined }, { universe: 'Aliens' }, { weapon: 'acid_claws' },
      { weapon: undefined }, { name: `${name} Echo` }, { name: 'Chestburster Echo' }
    ]) {
      const other = { ...actor, ...changed };
      assert.equal(getBoundEnemySpriteSrc(other), '', JSON.stringify(changed));
      assert.notEqual(getEnemySpriteSheetSrc(other), binding.sheet, JSON.stringify(changed));
    }
    assert.equal(getBoundEnemySpriteSrc({ ...actor, universe: undefined, sourceUniverse: 'Alien' }), binding.sheet);
    assert.equal(getBoundEnemySpriteSrc({ ...actor, universe: 'Other', sourceUniverse: 'Alien' }), '');
    assert.equal(getEnemySpriteSheetSrc({ ...actor, spriteSource: '/sprites/explicit-source.png' }), '/sprites/explicit-source.png');
  });
}

test('the locked Narcissus source encounter resolves the cleaner 1979 atlas for its only threat', () => {
  const stage = SOURCE_SCENE_STAGES.find(entry => entry.id === 50102);
  assert.deepEqual(stage.enemyRoster, ['Big Chap Stalker']);
  assert.match(stage.incarnation, /^Alien \(1979\).*Narcissus/);
  const actor = ENEMIES_DB.Alien.bosses.find(entry => entry.name === stage.enemyRoster[0]);
  assert.equal(getEnemySpriteSheetSrc({ ...actor, universe: stage.universe }), ENEMY_SPRITE_BINDINGS['Big Chap Stalker'].sheet);
  assert.equal(getEnemySpriteSheetSrc({ ...actor, universe: stage.universe, incarnation: undefined }), '/sprites/generated/bosses/alien/big-chap-stalker.png');
});

test('the source-scene facehugger and egg keep their Aliens1986 identity instead of receiving the 1979 body', () => {
  for (const name of ['Skittering Facehugger', 'Egg Chamber Sac']) {
    const template = ENEMIES_DB.Alien.monsters.find(actor => actor.name === name);
    assert.ok(template, name);
    assert.equal(getBoundEnemySpriteSrc({ ...template, universe: 'Alien' }), '');
    assert.match(getEnemySpriteSheetSrc({ ...template, universe: 'Alien' }), /^\/sprites\/generated\/bosses\/alien\//);
  }
  for (const name of ['__proto__', 'constructor', 'toString']) {
    assert.equal(getBoundEnemySpriteSrc({ name, universe: 'Alien', incarnation: 'Alien (1979)' }), '');
  }
});

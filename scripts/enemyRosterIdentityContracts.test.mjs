import assert from 'node:assert/strict';
import test from 'node:test';

import { ENEMIES_DB } from '../src/game/enemies.js';
import { HEROES_DB } from '../src/game/heroes.js';
import { applySpriteCatalogContracts } from './spriteCatalogContracts.mjs';

const normalizeName = value => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const nameOf = threat => threat?.name || '';
const includesName = (entries, name) => entries.some(entry => nameOf(entry) === name);

test('every universe gives each threat one authoritative runtime role', () => {
  for (const [universe, roster] of Object.entries(ENEMIES_DB)) {
    const owners = [
      ...(roster.monsters || []).map(threat => ({ role: 'enemy', threat })),
      ...(roster.bosses || []).map(threat => ({ role: 'boss', threat })),
      ...(roster.trials || []).map(threat => ({ role: 'trial', threat })),
      ...(roster.worldBoss ? [{ role: 'boss', threat: roster.worldBoss }] : [])
    ];
    const identities = owners.map(({ role, threat }) => `${role}:${normalizeName(`${universe}-${nameOf(threat)}`)}`);
    assert.equal(new Set(identities).size, identities.length, `${universe} has duplicate kind:id owners`);

    const names = owners.map(({ threat }) => normalizeName(nameOf(threat)));
    assert.equal(new Set(names).size, names.length, `${universe} assigns the same threat to several roles`);
  }
});

test('known ambiguous threats keep the lore-authoritative role', () => {
  const simpsons = ENEMIES_DB['The Simpsons'];
  assert.equal(includesName(simpsons.bosses, 'Mr Burns Nuclear Scheme'), false);
  assert.equal(includesName(simpsons.trials, 'Mr Burns Nuclear Scheme'), true);

  const stargateUniverse = ENEMIES_DB['Stargate Universe'];
  assert.equal(includesName(stargateUniverse.monsters, 'Drone Command Ship'), false);
  assert.equal(nameOf(stargateUniverse.worldBoss), 'Drone Command Ship');

  const rogerRabbit = ENEMIES_DB['Roger Rabbit'];
  assert.equal(includesName(rogerRabbit.monsters, 'Smart Ass'), false);
  assert.equal(includesName(rogerRabbit.bosses, 'Smart Ass'), true);

  const ecco = ENEMIES_DB['Ecco the Dolphin'];
  assert.equal(includesName(ecco.monsters, 'Vortex Drone'), false);
  assert.equal(includesName(ecco.bosses, 'Vortex Drone'), true);

  const cthulhu = ENEMIES_DB.Cthulhu;
  assert.equal(includesName(cthulhu.monsters, 'Shoggoth'), false);
  assert.equal(includesName(cthulhu.bosses, 'Shoggoth'), true);
});

test('punctuation variants cannot create a second sprite identity', () => {
  const doomBosses = ENEMIES_DB.Doom.bosses
    .map(nameOf)
    .filter(name => normalizeName(name) === 'marauder-sentinel-fallen');
  assert.equal(doomBosses.length, 1);
});

test('the runtime hero and threat catalog has only the two declared visual aliases', () => {
  const entries = HEROES_DB.map(hero => ({
    kind: 'hero',
    id: hero.id,
    output: `/sprites/generated/heroes/${normalizeName(hero.universe)}/${normalizeName(hero.id)}.png`
  }));

  for (const [universe, roster] of Object.entries(ENEMIES_DB)) {
    for (const enemy of roster.monsters || []) {
      entries.push({
        kind: 'enemy',
        id: normalizeName(`${universe}-${enemy.name}`),
        output: enemy.spriteSource || `/sprites/generated/bosses/${normalizeName(universe)}/${normalizeName(enemy.name)}.png`
      });
    }
    for (const boss of [...(roster.bosses || []), roster.worldBoss].filter(Boolean)) {
      entries.push({
        kind: 'boss',
        id: normalizeName(`${universe}-${boss.name}`),
        output: boss.spriteSource || `/sprites/generated/bosses/${normalizeName(universe)}/${normalizeName(boss.name)}.png`
      });
    }
    for (const trial of roster.trials || []) {
      entries.push({
        kind: 'trial',
        id: normalizeName(`${universe}-${trial.id || trial.name}-trial`),
        output: trial.output
          || trial.spriteSource
          || `/sprites/generated/bosses/${normalizeName(universe)}/${normalizeName(trial.name)}.png`
      });
    }
  }

  const contracted = applySpriteCatalogContracts(entries, { strict: true });
  assert.deepEqual(
    contracted.filter(entry => entry.outputAliasOf).map(entry => entry.outputAliasOf).sort(),
    ['hero:the_priest_2022', 'hero:tiffany']
  );
});

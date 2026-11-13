import { sourceHeroContract, sourceEnemyContract } from './actorSourceContracts.js';
// Final Fantasy VIII — definitions consumed by src/game/expandedUniverses.js.

export function createExpandedUniverseRecord() {
  const record = ({ key: 'ff8', universe: 'Final Fantasy VIII', mediaType: 'game', faction: 'arcane', mode: 'RPG', difficulty: 'Hard', titleFr: 'Final Fantasy VIII', stage: 'Balamb Time Compression', boss: 'Ultimecia Junction Core', hero: ['squall_ff8', 'Squall Leonhart', 'slayer'], allies: [['rinoa_ff8', 'Rinoa Heartilly', 'hacker'], ['quistis_ff8', 'Quistis Trepe', 'tactical']], monsters: ['Galbadian Soldier', 'Bite Bug', 'T-Rexaur'], bosses: ['Ultimecia', 'Edea Kramer'], gear: [['gunblade_magazine', 'Gunblade Magazine', 'Chargeur de gunblade', { atk: 4, spd: 1 }], ['gf_junction_link', 'GF Junction Link', 'Lien d\'association GF', { hp: 3, def: 2 }], ['triple_triad_card', 'Triple Triad Card', 'Carte Triple Triad', { spd: 3 }]], event: ['evt_renzokuken', 'Renzokuken Limit Break', 'Limit Break Renzokuken', 'Unleash a flurry of gunblade strikes finishing with a powerful Lionheart blow', 'Déchaîne une rafale de coups de gunblade terminée par un puissant coup Cœur de Lion'], theme: 'gunblades, Gardens, Guardian Forces, sorceress wars, and time compression', motif: 'castle', colors: ['#19233b', '#03050a', '#8fb6ff'] });
  const authoredEnemyNames = new Set(['Bite Bug', 'Edea Kramer', 'Galbadian Soldier', 'T-Rexaur']);
  const enemy = value => authoredEnemyNames.has(value) ? { name: value, ...sourceEnemyContract(value) } : value;
  record.hero = [...record.hero, sourceHeroContract(record.hero[0])];
  record.allies = record.allies.map(tuple => [...tuple, sourceHeroContract(tuple[0])]);
  record.monsters = record.monsters.map(enemy);
  record.bosses = record.bosses.map(enemy);
  return record;
}

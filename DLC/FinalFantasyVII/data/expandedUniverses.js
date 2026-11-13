import { sourceHeroContract, sourceEnemyContract } from './actorSourceContracts.js';
// Final Fantasy VII — definitions consumed by src/game/expandedUniverses.js.

export function createExpandedUniverseRecord() {
  const record = ({ key: 'ff7', universe: 'Final Fantasy VII', mediaType: 'game', faction: 'sciFi', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'Final Fantasy VII', stage: 'Midgar Mako Reactor Breach', boss: 'Safer Sephiroth Jenova Core', hero: ['cloud_ff7', 'Cloud Strife', 'slayer'], allies: [['tifa_ff7', 'Tifa Lockhart', 'slayer'], ['aerith_ff7', 'Aerith Gainsborough', 'tactical']], monsters: ['Shinra SOLDIER', 'Guard Scorpion Drone', 'Midgar Zolom'], bosses: ['Safer Sephiroth', 'Jenova BIRTH'], gear: [['buster_sword_hilt', 'Buster Sword Hilt', 'Poignée d\'épée Buster', { atk: 5 }], ['materia_bracer', 'Materia Bracer', 'Brassard à matéria', { def: 3, hp: 2 }], ['ribbon_accessory', 'Ribbon Accessory', 'Accessoire ruban', { def: 2, spd: 2 }]], event: ['evt_knights_of_the_round', 'Knights of the Round', 'Chevaliers de la Table Ronde', 'Summon the 13 Knights of the Round to deal devastating sequential damage', 'Invoque les 13 Chevaliers de la Table Ronde pour infliger des dégâts séquentiels dévastateurs'], theme: 'mako reactors, SOLDIER trauma, materia, planetary memory, and Jenova corruption', motif: 'facility', colors: ['#14261f', '#020503', '#6dff8d'] });
  const authoredEnemyNames = new Set(['Jenova BIRTH', 'Midgar Zolom']);
  const enemy = value => authoredEnemyNames.has(value) ? { name: value, ...sourceEnemyContract(value) } : value;
  record.hero = [...record.hero, sourceHeroContract(record.hero[0])];
  record.allies = record.allies.map(tuple => [...tuple, sourceHeroContract(tuple[0])]);
  record.monsters = record.monsters.map(enemy);
  record.bosses = record.bosses.map(enemy);
  return record;
}

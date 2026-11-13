import { sourceHeroContract, sourceEnemyContract } from './actorSourceContracts.js';
// Final Fantasy XIII — definitions consumed by src/game/expandedUniverses.js.

export function createExpandedUniverseRecord() {
  const record = ({ key: 'ff13', universe: 'Final Fantasy XIII', mediaType: 'game', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Final Fantasy XIII', stage: 'Cocoon FalCie Purge', boss: 'Orphan Cradle Core', hero: ['lightning_ff13', 'Lightning', 'slayer'], allies: [['fang_ff13', 'Fang', 'marine'], ['vanille_ff13', 'Vanille', 'hacker']], monsters: ['PSICOM Soldier', 'Behemoth Cub', 'Cie\'th Shambler'], bosses: ['Barthandelus', 'Orphan Core'], gear: [['blazefire_saber_mod', 'Blazefire Saber Mod', 'Mod sabre Éclair', { atk: 4, spd: 1 }], ['paradigm_shift_chip', 'Paradigm Shift Chip', 'Puce de changement de paradigme', { def: 3, spd: 2 }], ['crystarium_shard', 'Crystarium Shard', 'Éclat de Cristarium', { hp: 4 }]], event: ['evt_army_of_one', 'Army of One Assault', 'Assaut Armée Solitaire', 'Lightning strikes all enemies with a lightning-fast barrage of blows', 'Lightning frappe tous les ennemis avec un barrage de coups ultra-rapide'], theme: 'lCie brands, falCie destiny, paradigm shifts, and crystalline rebellion', motif: 'shipdeck', colors: ['#20273a', '#04060a', '#f0a8d8'] });
  const authoredEnemyNames = new Set(['Barthandelus', 'PSICOM Soldier']);
  const enemy = value => authoredEnemyNames.has(value) ? { name: value, ...sourceEnemyContract(value) } : value;
  record.hero = [...record.hero, sourceHeroContract(record.hero[0])];
  record.allies = record.allies.map(tuple => [...tuple, sourceHeroContract(tuple[0])]);
  record.monsters = record.monsters.map(enemy);
  record.bosses = record.bosses.map(enemy);
  return record;
}

// Stargate Universe — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Stargate Universe',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Destiny FTL Corridor',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    bossName: 'Destiny Control Lockout',
    title: { en: 'Stargate Universe', fr: 'Stargate Universe' },
    desc: {
      en: 'A stranded crew aboard Destiny, rationing power, air, trust, and Ancient systems at the edge of galaxies.',
      fr: 'Un equipage piege sur Destiny, economisant energie, air, confiance et systemes Anciens.'
    },
    hero: { id: 'rush_sgu', name: 'Nicholas Rush', cat: 'hacker', color: '#8d6e63' },
    allies: [
      { id: 'young_sgu', name: 'Everett Young', cat: 'tactical', color: '#536d7a' },
      { id: 'greer_sgu', name: 'Ronald Greer', cat: 'marine', color: '#2f4f4f' }
    ],
    monsters: ['Lucian Raider', 'Drone Command Ship', 'Destiny System Fault'],
    bosses: ['Blue Alien Boarding Team', 'Ancient Chair Lockout'],
    worldBoss: 'Destiny Control Lockout',
    gear: [
      ['sgu_communication_stone', 'Communication Stone', 'Pierre de communication', { def: 5, spd: 2 }],
      ['sgu_destiny_console', 'Destiny Console Core', 'Console de Destiny', { atk: 8, def: 5 }],
      ['sgu_air_filter', 'Emergency Air Filter', 'Filtre a air urgence', { hp: 95 }]
    ],
    event: ['evt_sgu_ftl_jump', 'Emergency FTL Jump', 'Saut FTL urgence', 'Destiny jumps through the battlefield, scrambling enemy targeting.', 'Destiny saute en FTL et brouille le ciblage ennemi.'],
    decor: { sky: ['#2a2118', '#060403'], floor: 'rgba(168, 115, 59, 0.18)', grid: 'rgba(255, 173, 79, 0.28)', motif: 'shipdeck', accent: '#ffad4f' }
  });
}

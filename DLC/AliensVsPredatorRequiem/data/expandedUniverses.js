// Aliens vs Predator: Requiem — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Aliens vs Predator: Requiem',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Gunnison Containment Night',
    mode: 'Smash',
    difficulty: 'Very Hard',
    bossName: 'Predalien Queen',
    title: { en: 'Aliens vs Predator: Requiem', fr: 'Aliens vs Predator: Requiem' },
    desc: {
      en: 'A small-town outbreak where Wolf Predator cleans the evidence while the Predalien spreads the hive.',
      fr: 'Une infection de petite ville ou Wolf Predator efface les preuves pendant que le Predalien propage la ruche.'
    },
    hero: { id: 'wolf_avpr', name: 'Wolf Predator', cat: 'slayer', color: '#4f4a3e' },
    allies: [
      { id: 'dallas_avpr', name: 'Dallas Howard', cat: 'marine', color: '#4b5f6a' },
      { id: 'kelly_avpr', name: 'Kelly O Brien', cat: 'tactical', color: '#596d5d' }
    ],
    monsters: ['Sewer Xenomorph', 'Hospital Hive Host', 'Predalien Larva'],
    bosses: ['Wolf Cleanup Duel', 'National Guard Collapse'],
    worldBoss: 'Predalien Queen',
    gear: [
      ['avpr_cleaner_fluid', 'Cleaner Dissolve Fluid', 'Fluide dissolvant cleaner', { atk: 8, def: 5 }],
      ['avpr_dual_caster', 'Dual Plasma Caster', 'Double canon plasma', { atk: 12 }],
      ['avpr_sewer_tracker', 'Sewer Tracker Beacon', 'Balise egouts', { spd: 2, hp: 40 }]
    ],
    event: ['evt_avpr_cleaner', 'Cleaner Protocol', 'Protocole Cleaner', 'Wolf dissolves hazards and burns the enemy formation.', 'Wolf dissout les dangers et brule la formation ennemie.'],
    decor: { sky: ['#141d22', '#020405'], floor: 'rgba(73, 88, 91, 0.19)', grid: 'rgba(117, 231, 166, 0.25)', motif: 'fogtown', accent: '#75e7a6' }
  });
}

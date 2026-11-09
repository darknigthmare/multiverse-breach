// Charmed — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Charmed',
    mediaType: 'movie',
    faction: 'arcane',
    stageName: 'Halliwells Manor Nexus',
    mode: 'RPG',
    difficulty: 'Hard',
    bossName: 'Source of All Evil',
    title: { en: 'Charmed', fr: 'Charmed' },
    desc: {
      en: 'The Power of Three holds back demons, warlocks, time loops, and Book of Shadows corruption.',
      fr: 'Le Pouvoir des Trois retient demons, sorciers, boucles temporelles et corruption du Livre des Ombres.'
    },
    hero: { id: 'prue_halliwell', name: 'Prue Halliwell', cat: 'hacker', color: '#8e44ad' },
    allies: [
      { id: 'piper_halliwell', name: 'Piper Halliwell', cat: 'tactical', color: '#3498db' },
      { id: 'phoebe_halliwell', name: 'Phoebe Halliwell', cat: 'slayer', color: '#e67e22' }
    ],
    monsters: ['Lower Demon', 'Warlock Thief', 'Shadow Familiar'],
    bosses: ['Balthazor', 'The Seer'],
    worldBoss: 'Source of All Evil',
    gear: [
      ['charmed_bos_page', 'Book of Shadows Page', 'Page du Livre des Ombres', { atk: 9, def: 4 }],
      ['charmed_potion_vial', 'Vanquishing Potion', 'Potion de destruction', { atk: 8, spd: 1 }],
      ['charmed_triquetra', 'Triquetra Charm', 'Charme triquetra', { hp: 70, def: 5 }]
    ],
    event: ['evt_charmed_power_three', 'Power of Three', 'Pouvoir des Trois', 'A triple spell blasts demons and shields the squad.', 'Un sort triple frappe les demons et protege l escouade.'],
    decor: { sky: ['#2d173d', '#06030a'], floor: 'rgba(142, 68, 173, 0.18)', grid: 'rgba(214, 180, 255, 0.28)', motif: 'arcanecity', accent: '#d6b4ff' }
  });
}

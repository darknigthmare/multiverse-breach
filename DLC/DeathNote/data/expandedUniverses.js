// Death Note — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLegacyNonCombatTrialNameRoutes() {
  return (['Death Note', 'evidence', ['Task Force Tail', 'Kira Copycat', 'Shinigami Whisper', 'Rem Contract', 'Near Deduction Trap']]);
}

export function createExpandedUniverses() {
  return ({
    universe: 'Death Note',
    mediaType: 'manga',
    faction: 'horror',
    stageName: 'Kira Investigation Board',
    mode: 'Tactics',
    difficulty: 'Hard',
    bossName: 'Kira Judgment Loop',
    title: { en: 'Death Note', fr: 'Death Note' },
    desc: {
      en: 'A supernatural investigation breach where names, rules, shinigami, and deduction become lethal weapons.',
      fr: 'Une enquete surnaturelle ou noms, regles, shinigami et deduction deviennent des armes mortelles.'
    },
    hero: { id: 'light_yagami', name: 'Light Yagami', cat: 'hacker', color: '#2d3436' },
    allies: [
      { id: 'l_lawliet', name: 'L Lawliet', cat: 'tactical', color: '#dfe6e9' },
      { id: 'misa_amane', name: 'Misa Amane', cat: 'horror', color: '#f5c2d1' }
    ],
    monsters: ['Task Force Tail', 'Kira Copycat', 'Shinigami Whisper'],
    bosses: ['Rem Contract', 'Near Deduction Trap'],
    worldBoss: 'Kira Judgment Loop',
    gear: [
      ['dn_black_notebook', 'Black Notebook Page', 'Page du carnet noir', { atk: 10, def: 2 }],
      ['dn_sugar_cube', 'L Sugar Cube', 'Sucre de L', { spd: 2, hp: 35 }],
      ['dn_shinigami_apple', 'Shinigami Apple', 'Pomme shinigami', { hp: 60, atk: 5 }]
    ],
    event: ['evt_dn_name_rule', 'Name Written Rule', 'Regle du nom ecrit', 'A rule trap marks the strongest enemy and lowers its attack.', 'Une regle piege marque l ennemi le plus fort et baisse son attaque.'],
    decor: { sky: ['#151515', '#030303'], floor: 'rgba(80, 80, 80, 0.18)', grid: 'rgba(220, 220, 220, 0.22)', motif: 'hauntedset', accent: '#dfe6e9' }
  });
}

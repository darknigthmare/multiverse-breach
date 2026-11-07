// Demon Slayer — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'demon_slayer',
    universe: 'Demon Slayer',
    mediaType: 'manga',
    faction: 'arcane',
    mode: 'Smash',
    difficulty: 'Very Hard',
    titleFr: 'Demon Slayer',
    stage: 'Infinity Castle Demon Hunt',
    boss: 'Muzan Kibutsuji',
    hero: ['tanjiro_kamado', 'Tanjiro Kamado', 'slayer'],
    allies: [['nezuko_kamado', 'Nezuko Kamado', 'horror'], ['zenitsu_agatsuma', 'Zenitsu Agatsuma', 'slayer']],
    monsters: ['Hand Demon', 'Swamp Demon', 'Spider Demon Family'],
    bosses: ['Akaza Upper Three', 'Daki and Gyutaro'],
    gear: [['tanjiro_nichirin', 'Black Nichirin Blade', 'Lame Nichirin noire', { atk: 11, spd: 1 }], ['hanafuda_earrings', 'Hanafuda Earrings', 'Boucles Hanafuda', { atk: 7, def: 5 }], ['wisteria_poison', 'Wisteria Poison', 'Poison de glycine', { atk: 9, spd: 2 }]],
    event: ['evt_hinokami_kagura', 'Hinokami Kagura', 'Danse du Dieu du Feu', 'Tanjiro converts remembered dance forms into a continuous solar-breathing assault.', 'Tanjiro transforme les formes de la danse transmise en assaut continu du Souffle du Soleil.'],
    theme: 'Taisho-era demon hunts, breathing forms, Blood Demon Arts, and the bonds of the Kamado family',
    desc: { en: 'Nichirin steel and breathing disciplines remain the only reliable answer to Muzans demon blood.', fr: 'L acier Nichirin et les souffles restent la seule reponse fiable au sang demoniaque de Muzan.' },
    motif: 'castle',
    colors: ['#172520', '#030504', '#e54838'],
    stageVariants: [['RPG', 'Mount Natagumo Web Forest', 'Hard', 'Spider Demon Family'], ['Tactics', 'Entertainment District Rooftops', 'Very Hard', 'Daki and Gyutaro']]
  });
}

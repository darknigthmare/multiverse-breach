// Mashle — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'mashle',
    universe: 'Mashle',
    mediaType: 'manga',
    faction: 'arcane',
    mode: 'Smash',
    difficulty: 'Hard',
    titleFr: 'Mashle',
    stage: 'Easton Magic Academy Trial',
    boss: 'Innocent Zero Timez',
    hero: ['mash_burnedead', 'Mash Burnedead', 'slayer'],
    allies: [['finn_ames', 'Finn Ames', 'tactical'], ['lance_crown', 'Lance Crown', 'hacker']],
    monsters: ['Magia Lupus Student', 'Easton Magic Beast', 'Innocent Zero Doll'],
    bosses: ['Cell War', 'Doom First Son'],
    gear: [['mash_cream_puff', 'Mash Cream Puff', 'Chou a la creme de Mash', { hp: 95 }], ['iron_wand_mashle', 'Mashs Iron Wand', 'Baguette de fer de Mash', { atk: 11, def: 4 }], ['divine_visionary_coin', 'Divine Visionary Coin', 'Piece de l Elu divin', { def: 7, spd: 1 }]],
    event: ['evt_muscle_magic', 'Muscle Magic Full Power', 'Magie musculaire pleine puissance', 'Mash answers a spell with impossible physical force while still possessing no magic at all.', 'Mash repond a un sort par une force physique impossible sans posseder la moindre magie.' ],
    theme: 'a magic academy ruled by marks where Mash survives every spell through absurd physical training',
    desc: { en: 'Mash has no magic and must solve magical threats with strength, timing, and improvised physical technique.', fr: 'Mash ne possede aucune magie et resout les menaces magiques par force, timing et techniques physiques improvisees.' },
    motif: 'castle',
    colors: ['#172c29', '#030605', '#f0d56b'],
    stageVariants: [['RPG', 'Magia Lupus Underground Maze', 'Hard', 'Cell War'], ['Tactics', 'Divine Visionary Selection Arena', 'Very Hard', 'Doom First Son']]
  });
}

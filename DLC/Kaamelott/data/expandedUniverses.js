// Kaamelott — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Kaamelott',
    mediaType: 'series',
    faction: 'arcane',
    stageName: 'Kaamelott Table Ronde',
    mode: 'RPG',
    difficulty: 'Medium',
    bossName: 'Lancelot Noir',
    title: { en: 'Kaamelott', fr: 'Kaamelott' },
    desc: {
      en: 'A French Arthurian comedy-drama Thread where the Grail quest keeps collapsing under bad briefings, fragile authority, family politics, Breton legends, absurd council debates, and a kingdom that is heroic only when it survives its own incompetence.',
      fr: 'Une Trame de serie francaise arthurienne ou la quete du Graal s effondre sous les reunions ratees, l autorite fragile, les affaires de famille, les legendes bretonnes, les debats absurdes et un royaume heroique surtout quand il survit a sa propre incompetence.'
    },
    hero: { id: 'arthur_kaamelott', name: 'Arthur Pendragon', cat: 'tactical', color: '#34495e' },
    allies: [
      { id: 'perceval_kaamelott', name: 'Perceval', cat: 'hacker', color: '#d6b15f' },
      { id: 'karadoc_kaamelott', name: 'Karadoc', cat: 'marine', color: '#8d6e63' }
    ],
    monsters: ['Burgonde Raider', 'Saxon Scout', 'Graal Bureaucrat', 'Council Confusion Clerk', 'Bandit de Carmelite'],
    bosses: ['Roi Burgonde', 'Lancelot Noir', 'Meleagant Whisper', 'Leodagan War Council'],
    worldBoss: 'Graal Rift',
    gear: [
      ['kaamelott_excalibur', 'Excalibur Spark', 'Etincelle d Excalibur', { atk: 10, def: 4 }],
      ['kaamelott_table_ronde', 'Round Table Dossier', 'Dossier de Table Ronde', { def: 6, spd: 1 }],
      ['kaamelott_roti', 'Karadoc Ration', 'Ration de Karadoc', { hp: 90 }]
    ],
    event: ['evt_kaamelott_graal', 'Round Table Order', 'Ordre de la Table Ronde', 'The squad gains defense while enemies are confused by contradictory council orders and a very unclear Grail plan.', 'L escouade gagne de la defense pendant que les ordres contradictoires du conseil et un plan de Graal tres flou perturbent les ennemis.'],
    decor: { sky: ['#263b32', '#070c08'], floor: 'rgba(137, 111, 62, 0.18)', grid: 'rgba(214, 180, 101, 0.28)', motif: 'castle', accent: '#d6b465' }
  });
}

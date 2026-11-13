// Neon Genesis Evangelion — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'evangelion',
    universe: 'Neon Genesis Evangelion',
    mediaType: 'series',
    faction: 'sciFi',
    mode: 'Tactics',
    difficulty: 'Expert',
    titleFr: 'Neon Genesis Evangelion',
    stage: 'Tokyo-3 Geofront Defense',
    boss: 'Lilith Third Impact',
    hero: ['shinji_ikari', 'Shinji Ikari and EVA-01', 'tactical'],
    allies: [['asuka_langley', 'Asuka Langley and EVA-02', 'slayer'], ['rei_ayanami', 'Rei Ayanami and EVA-00', 'hacker']],
    monsters: ['Sachiel Third Angel', 'Ramiel Fifth Angel', 'Zeruel Fourteenth Angel'],
    bosses: ['Tabris Kaworu', 'Mass Production Evangelion'],
    gear: [['progressive_knife', 'Progressive Knife', 'Couteau progressif', { atk: 11, spd: 1 }], ['entry_plug', 'Entry Plug', 'Entry Plug', { hp: 80, def: 5 }], ['at_field_core', 'A.T. Field Core', 'Noyau de champ A.T.', { def: 10 }]],
    event: ['evt_at_field', 'A.T. Field Deployment', 'Deploiement du champ A.T.', 'The Evangelion neutralizes an Angels field while its umbilical power timer continues to fall.', 'L Evangelion neutralise le champ d un Ange tandis que son autonomie ombilicale continue de diminuer.' ],
    theme: 'NERV command, biomechanical Evangelions, Angels, synchronization trauma, and the threat of Instrumentality',
    desc: { en: 'Evangelions are restrained biomechanical beings with pilots, synchronization ratios, power limits, and A.T. Fields.', fr: 'Les Evangelions sont des etres biomecaniques contenus avec pilotes, taux de synchronisation, limites d energie et champs A.T.' },
    motif: 'facility',
    colors: ['#181229', '#030205', '#8ce339'],
    stageVariants: [['Smash', 'Tokyo-3 Ramiel Sniper Operation', 'Expert', 'Ramiel Fifth Angel'], ['RPG', 'Terminal Dogma Instrumentality', 'Expert', 'Lilith Third Impact']]
  });
}

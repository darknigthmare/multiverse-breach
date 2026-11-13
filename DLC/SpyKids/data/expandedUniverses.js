// Spy Kids — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'spy_kids',
    universe: 'Spy Kids',
    mediaType: 'movie',
    faction: 'cyber',
    mode: 'Tactics',
    difficulty: 'Medium',
    titleFr: 'Spy Kids',
    stage: 'Floop Castle Virtual Trap',
    boss: 'Toymaker Game Over Arena',
    cast: [
      ['carmen_cortez', 'Carmen Cortez', 'tactical'],
      ['juni_cortez', 'Juni Cortez', 'hacker'],
      ['gregorio_cortez', 'Gregorio Cortez', 'marine']
    ],
    enemies: ['Thumb-Thumb Guard', 'Magna Man', 'Toymaker Game Bot'],
    bosses: ['Fegan Floop Robot', 'The Toymaker'],
    gear: [
      ['machete_gadget', 'Machete Gadget Pack', 'Pack de gadgets de Machete'],
      ['electro_gum', 'Electroshock Gum', 'Chewing-gum electrochoc'],
      ['dragonfly_sub', 'Dragonfly Mini-Sub', 'Mini sous-marin libellule']
    ],
    event: ['family_spies', 'Cortez Family Operation', 'Operation de la famille Cortez', 'Every family member handles one security layer, opening the objective without triggering the final alarm.', 'Chaque membre de la famille traite une couche de securite et ouvre l objectif sans declencher l alarme finale.'],
    origin: ['Carmen and Juni discover their parents are OSS spies and inherit a world of colorful gadgets, artificial agents, and family missions.', 'Carmen et Juni decouvrent que leurs parents sont espions de l OSS et heritent d un monde de gadgets colores, agents artificiels et missions familiales.'],
    breach: ['Floop s machines turn portal avatars into programmable cast members, and the Cortez family must restore the people behind each role.', 'les machines de Floop transforment les avatars de portail en acteurs programmables, et la famille Cortez doit restaurer les personnes derriere chaque role.'],
    motif: 'facility',
    colors: ['#21334a', '#04070a', '#e85742']
  }));
}

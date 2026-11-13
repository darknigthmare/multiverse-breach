// The Conjuring — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'the_conjuring',
    universe: 'The Conjuring',
    mediaType: 'movie',
    faction: 'horror',
    mode: 'RPG',
    difficulty: 'Very Hard',
    titleFr: 'Conjuring',
    stage: 'Harrisville Perron Farmhouse',
    boss: 'Bathsheba Possession Rite',
    cast: [
      ['lorraine_warren', 'Lorraine Warren', 'hacker'],
      ['ed_warren', 'Ed Warren', 'tactical'],
      ['carolyn_perron', 'Carolyn Perron', 'horror']
    ],
    enemies: ['Clapping Cellar Spirit', 'Possessed Doll Echo', 'Crooked House Shade'],
    bosses: ['Annabelle Conduit', 'Bathsheba Sherman'],
    gear: [
      ['music_box', 'Perron Music Box', 'Boite a musique Perron'],
      ['exorcism_tape', 'Warren Exorcism Tape', 'Bande d exorcisme Warren'],
      ['rosary', 'Blessed Rosary', 'Rosaire beni']
    ],
    event: ['lorraine_vision', 'Lorraine s Clairvoyant Trace', 'Trace clairvoyante de Lorraine', 'Lorraine identifies the attached spirit and Ed severs its claim before possession completes.', 'Lorraine identifie l esprit attache et Ed brise son emprise avant la possession complete.'],
    origin: ['Ed and Lorraine Warren investigate the Perron farmhouse, where Bathsheba s curse targets Carolyn and her family.', 'Ed et Lorraine Warren enquetent dans la ferme Perron, ou la malediction de Bathsheba vise Carolyn et sa famille.'],
    breach: ['haunted objects attach themselves to unlocked universe packs, turning collection slots into doors unless each artifact is named and sealed.', 'les objets hantes s attachent aux packs d univers debloques, transformant les emplacements de collection en portes si chaque artefact n est pas nomme et scelle.'],
    motif: 'hauntedset',
    colors: ['#1b1a17', '#030303', '#b7aa76']
  }));
}

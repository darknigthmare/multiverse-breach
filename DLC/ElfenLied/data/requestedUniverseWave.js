// Elfen Lied — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'elfen_lied',
    universe: 'Elfen Lied',
    mediaType: 'manga',
    faction: 'horror',
    mode: 'RPG',
    difficulty: 'Very Hard',
    titleFr: 'Elfen Lied',
    stage: 'Kamakura Diclonius Facility Escape',
    boss: 'Lucy Vector Catastrophe',
    hero: ['lucy_nyu', 'Lucy and Nyu', 'horror'],
    allies: [['nana_diclonius', 'Nana', 'slayer'], ['kouta_elfen', 'Kouta', 'tactical']],
    monsters: ['SAT Containment Trooper', 'Diclonius Silpelit', 'Research Facility Guard'],
    bosses: ['Mariko Number 35', 'Chief Kakuzawa Diclonius'],
    gear: [['diclonius_horn_fragment', 'Diclonius Horn Fragment', 'Fragment de corne Diclonius', { atk: 10, hp: 35 }], ['music_box_elfen', 'Koutas Music Box', 'Boite a musique de Kouta', { hp: 70, def: 5 }], ['containment_collar', 'Vector Containment Collar', 'Collier de confinement vectoriel', { def: 8 }]],
    event: ['evt_vector_field', 'Invisible Vector Field', 'Champ de vecteurs invisibles', 'Lucy projects invisible arms through cover while trauma destabilizes her control.', 'Lucy projette ses bras invisibles a travers la couverture tandis que son trauma fragilise son controle.'],
    theme: 'Diclonius vectors, laboratory abuse, fractured identity, and the fragile found family at Kaede House',
    desc: { en: 'Invisible vectors keep their limited reach and lethal force; Nyu and Lucy remain parts of one traumatized identity.', fr: 'Les vecteurs invisibles gardent leur portee limitee et leur force mortelle; Nyu et Lucy restent les facettes d une meme identite traumatisee.' },
    motif: 'facility',
    colors: ['#2a1420', '#050203', '#ff6e9d'],
    stageVariants: [['Tactics', 'Kaede House Coastal Defense', 'Hard', 'Mariko Number 35'], ['Smash', 'Research Island Vector Storm', 'Expert', 'Lucy Vector Catastrophe']]
  });
}

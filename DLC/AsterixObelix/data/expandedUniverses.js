// Asterix & Obelix — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'asterix_obelix',
    universe: 'Asterix & Obelix',
    mediaType: 'manga',
    faction: 'arcane',
    mode: 'Smash',
    difficulty: 'Medium',
    titleFr: 'Asterix et Obelix',
    stage: 'Indomitable Gaul Village',
    boss: 'Roman Camp Grand Assault',
    cast: [
      ['asterix_gaul', 'Asterix', 'slayer'],
      ['obelix_gaul', 'Obelix', 'marine'],
      ['getafix_gaul', 'Getafix', 'hacker']
    ],
    enemies: ['Roman Legionary', 'Pirate Crew', 'Norman Warrior'],
    bosses: ['Centurion Caius Bonus', 'Julius Caesar Expedition'],
    gear: [
      ['magic_potion', 'Magic Potion Gourd', 'Gourde de potion magique'],
      ['menhir', 'Obelix Menhir', 'Menhir d Obelix'],
      ['laurel', 'Caesar Laurel', 'Lauriers de Cesar']
    ],
    event: ['potion_charge', 'Magic Potion Village Charge', 'Charge du village sous potion', 'The village drinks one measured cauldron and sends the entire enemy formation flying.', 'Le village boit un chaudron mesure et expulse toute la formation ennemie.'],
    origin: ['One small Gaulish village resists Roman occupation through courage, comedy, Getafix s potion, and Obelix s permanent strength.', 'Un petit village gaulois resiste a l occupation romaine par le courage, la comedie, la potion de Panoramix et la force permanente d Obelix.'],
    breach: ['Rome claims every new portal as a province, while the village treats the multiverse as one more camp to dismantle before the banquet.', 'Rome revendique chaque portail comme province, tandis que le village traite le multivers comme un camp de plus a demonter avant le banquet.'],
    motif: 'fortress',
    colors: ['#233b20', '#050804', '#e2b64a']
  }));
}

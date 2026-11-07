// Portal — definitions consumed by src/game/narrativeSystems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCuratedCharacterNarrativeArcs() {
  return ({
    id: 'chell_white_room',
    stageId: 9209,
    heroId: 'chell',
    title: { fr: 'Arc Personnage - Chambre blanche', en: 'Character Arc - White Room' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Noyau de Test Infini',
    unlock: { type: 'level', value: 3 },
    intro: { fr: 'Chell ne parle pas au Nexus. Elle lui montre seulement ou poser le second portail.', en: 'Chell does not speak to the Nexus. She only shows it where to place the second portal.' },
    missions: [
      { fr: 'Resoudre une salle ou la gravite appartient a deux univers.', en: 'Solve a room where gravity belongs to two universes.' },
      { fr: 'Retourner une tourelle contre son propre script de test.', en: 'Turn a turret against its own test script.' },
      { fr: 'Sortir d une boucle Aperture qui promet une recompense impossible.', en: 'Escape an Aperture loop promising an impossible reward.' }
    ],
    outro: { fr: 'Le Nexus apprend que survivre peut etre une forme de reponse.', en: 'The Nexus learns survival can be a form of answer.' },
    reward: { fr: 'Apparence Chambre Blanche + botte Long Fall instable', en: 'White Room Appearance + Unstable Long Fall Boot' },
    rewardItemId: 'char_chell_white_room'
  });
}

export function createSkinCatalog() {
  return ({
    id: 'char_chell_white_room',
    heroId: 'chell',
    name: { fr: 'Chambre Blanche', en: 'White Room' },
    colors: { primaryColor: '#f7f7f2', secondaryColor: '#ff7a1a' }
  });
}

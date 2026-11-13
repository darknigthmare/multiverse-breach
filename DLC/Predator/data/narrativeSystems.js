// Predator — definitions consumed by src/game/narrativeSystems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCuratedCharacterNarrativeArcs() {
  return ({
    id: 'predator_honor_breach',
    stageId: 9205,
    heroId: 'predator',
    title: { fr: 'Arc Personnage - Code du trophee', en: 'Character Arc - Trophy Code' },
    mode: 'Smash',
    difficulty: 'Personal',
    bossName: 'Trophee Sans-Visage',
    unlock: { type: 'level', value: 4 },
    intro: { fr: 'Le Yautja comprend que le Sans-Auteur ne chasse pas: il efface. Son honneur exige une reponse plus ancienne que le Nexus.', en: 'The Yautja understands the Authorless does not hunt: it erases. Honor demands an answer older than the Nexus.' },
    missions: [
      { fr: 'Marquer une cible qui change de monde a chaque blessure.', en: 'Mark a target that changes worlds with every wound.' },
      { fr: 'Refuser un trophee corrompu par une victoire trop facile.', en: 'Reject a trophy corrupted by an easy victory.' },
      { fr: 'Vaincre le Sans-Visage dans une arene sans public ni memoire.', en: 'Defeat the Faceless in an arena without audience or memory.' }
    ],
    outro: { fr: 'La chasse reste brutale, mais elle redevient lisible: proie, chasseur, regle.', en: 'The hunt remains brutal, but becomes readable again: prey, hunter, rule.' },
    reward: { fr: 'Apparence Traqueur de Faille + masque rituel', en: 'Rift Stalker Appearance + Ritual Mask' },
    rewardItemId: 'char_predator_rift_stalker'
  });
}

export function createSkinCatalog() {
  return ({
    id: 'char_predator_rift_stalker',
    heroId: 'predator',
    name: { fr: 'Traqueur de Faille', en: 'Rift Stalker' },
    colors: { primaryColor: '#6f8f72', secondaryColor: '#00ff9d' }
  });
}

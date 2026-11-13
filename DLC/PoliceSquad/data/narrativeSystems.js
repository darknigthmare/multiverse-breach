// Police Squad — definitions consumed by src/game/narrativeSystems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCuratedCharacterNarrativeArcs() {
  return ({
    id: 'drebin_wrong_case',
    stageId: 9212,
    heroId: 'frank_drebin',
    title: { fr: 'Arc Personnage - Mauvais dossier', en: 'Character Arc - Wrong Case' },
    mode: 'Smash',
    difficulty: 'Personal',
    bossName: 'Commissaire de Continuite',
    unlock: { type: 'clears', value: 3 },
    intro: { fr: 'Frank Drebin arrive toujours dans la mauvaise scene, ce qui rend le Sans-Auteur furieux: impossible d effacer une logique qui ne sait pas ou elle va.', en: 'Frank Drebin always enters the wrong scene, which infuriates the Authorless: it is impossible to erase logic that does not know where it is going.' },
    missions: [
      { fr: 'Interroger trois temoins qui appartiennent a trois univers differents.', en: 'Question three witnesses from three different universes.' },
      { fr: 'Transformer une erreur de procedure en raccourci tactique.', en: 'Turn a procedural mistake into a tactical shortcut.' },
      { fr: 'Arreter le Commissaire de Continuite sans comprendre l accusation.', en: 'Arrest the Continuity Commissioner without understanding the accusation.' }
    ],
    outro: { fr: 'Le Nexus archive Frank comme anomalie comique utile: une faille qui referme les autres par accident.', en: 'The Nexus archives Frank as a useful comic anomaly: a breach that closes others by accident.' },
    reward: { fr: 'Apparence Brigade Nexus + plaque mal classee', en: 'Nexus Squad Appearance + Misfiled Badge' },
    rewardItemId: 'char_drebin_wrong_case'
  });
}

export function createSkinCatalog() {
  return ({
    id: 'char_drebin_wrong_case',
    heroId: 'frank_drebin',
    name: { fr: 'Brigade Nexus', en: 'Nexus Squad' },
    colors: { primaryColor: '#2f75b5', secondaryColor: '#f6f1d1' }
  });
}

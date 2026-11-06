// Alien — definitions consumed by src/game/narrativeSystems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCuratedCharacterNarrativeArcs() {
  return ({
    id: 'ripley_no_hive',
    stageId: 9204,
    heroId: 'ripley',
    title: { fr: 'Arc Personnage - Refus de la ruche', en: 'Character Arc - Refusal of the Hive' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Reine-Memoire Weyland',
    unlock: { type: 'clears', value: 4 },
    intro: { fr: 'Ripley reconnait les cycles qui recommencent: compagnie, specimen, sacrifice. Dans le Nexus, elle peut enfin casser la boucle.', en: 'Ripley recognizes the loops restarting: company, specimen, sacrifice. In the Nexus, she can finally break them.' },
    missions: [
      { fr: 'Sauver une capsule de survivants avant que la breche ne les transforme en appats.', en: 'Save a survivor pod before the breach turns them into bait.' },
      { fr: 'Purger un manifeste Weyland-Yutani contamine par des oeufs de Trame.', en: 'Purge a Weyland-Yutani manifest contaminated by Thread eggs.' },
      { fr: 'Affronter une reine qui pond des souvenirs au lieu de xenomorphes.', en: 'Face a queen laying memories instead of xenomorphs.' }
    ],
    outro: { fr: 'La ruche perd son droit de recommencer l histoire de Ripley.', en: 'The hive loses its right to restart Ripley story.' },
    reward: { fr: 'Apparence Loader Nexus + cle de sas colonial', en: 'Nexus Loader Appearance + Colonial Airlock Key' },
    rewardItemId: 'char_ripley_loader_nexus'
  });
}

export function createSkinCatalog() {
  return ({
    id: 'char_ripley_loader_nexus',
    heroId: 'ripley',
    name: { fr: 'Loader Nexus', en: 'Nexus Loader' },
    colors: { primaryColor: '#f2b705', secondaryColor: '#4682b4' }
  });
}

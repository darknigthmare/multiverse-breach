// Breaking Bad — definitions consumed by src/game/narrativeSystems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCuratedCharacterNarrativeArcs() {
  return ({
    id: 'walter_blue_thread',
    stageId: 9211,
    heroId: 'walter_white',
    title: { fr: 'Arc Personnage - Formule bleue', en: 'Character Arc - Blue Formula' },
    mode: 'Tactics',
    difficulty: 'Personal',
    bossName: 'Empire Heisenberg Miroir',
    unlock: { type: 'level', value: 4 },
    intro: { fr: 'Walter White comprend le Nexus comme une reaction chimique: dosage, pression, contamination. Le probleme, c est qu il veut controler le resultat.', en: 'Walter White reads the Nexus as a chemical reaction: dosage, pressure, contamination. The problem is he wants to control the result.' },
    missions: [
      { fr: 'Isoler un catalyseur bleu sans rendre l escouade dependante de son pouvoir.', en: 'Isolate a blue catalyst without making the squad dependent on its power.' },
      { fr: 'Saboter un laboratoire de Trame avant que la formule devienne une faction.', en: 'Sabotage a Thread lab before the formula becomes a faction.' },
      { fr: 'Affronter un empire miroir construit a partir de ses pires choix.', en: 'Face a mirror empire built from his worst choices.' }
    ],
    outro: { fr: 'A.R.C.A. classe Walter comme ressource puissante et risque permanent.', en: 'A.R.C.A. classifies Walter as both powerful resource and permanent risk.' },
    reward: { fr: 'Apparence Combinaison Bleue + catalyseur de Trame', en: 'Blue Suit Appearance + Thread Catalyst' },
    rewardItemId: 'char_walter_blue_formula'
  });
}

export function createSkinCatalog() {
  return ({
    id: 'char_walter_blue_formula',
    heroId: 'walter_white',
    name: { fr: 'Formule Bleue', en: 'Blue Formula' },
    colors: { primaryColor: '#5c8a43', secondaryColor: '#3dc7ff' }
  });
}

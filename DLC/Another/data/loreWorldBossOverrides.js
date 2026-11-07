// Another — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ finalPolicy }) {
  return (finalPolicy(
    "Another",
    "another-calamity-extra-student",
    "nonCombatFinal",
    "Another - class 3-3 calamity",
    "Recouper les souvenirs, proteger les eleves et identifier l'Extra sans afficher son identite avant la resolution.",
    "Cross-check memories, protect the students and identify the Extra without revealing the identity before resolution.",
    "La calamite n'est pas une personne aleatoire a tuer et son identite est un spoiler de gameplay.",
    "The calamity is not a random person to kill, and its identity is a gameplay spoiler.",
    ["https://another.fandom.com/wiki/Countermeasures"],
    "Class 3-3, student list, photographs, anonymous silhouettes, evidence board and burning-inn states with no identity baked into art.",
  ));
}

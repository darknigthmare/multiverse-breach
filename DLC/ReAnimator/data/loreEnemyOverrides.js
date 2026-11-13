// Re-Animator — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Re-Animator", [
    candidate(
      RIFT_DRONE,
      "Reanimated Corpse",
      "Hands and improvised blunt force",
      "grab and bludgeon",
      "Cadavre de morgue ranime par le reagent, violent et incapable de controler ses mouvements.",
      "A morgue corpse revived by the reagent, violent and unable to control its movements.",
      "https://horror.fandom.com/wiki/Re-Animator_%281985%29",
      "Fresh morgue corpse with mottled post-mortem skin, hospital sheet or morgue clothing and violent uncontrolled movement.",
    ),
    candidate(
      BREACH_STALKER,
      "Reanimated Cat",
      "Claws and teeth",
      "leap and claw",
      "Chat mort ranime par le reagent qui bondit malgre ses blessures chirurgicales.",
      "A dead cat revived by the reagent that keeps leaping despite its surgical wounds.",
      "https://horror.fandom.com/wiki/Re-Animator_%281985%29",
      "Mutilated tabby cat corpse from the film, visible surgical damage and low four-legged attack silhouette.",
    ),
    candidate(
      ANOMALY_PACK,
      "Lobotomized Morgue Corpse",
      "Bare hands",
      "grab and strike",
      "Corps de morgue ranime puis lobotomise, dirige vers sa cible par des mouvements raides.",
      "A revived and lobotomized morgue body directed at its target with stiff movements.",
      "https://horror.fandom.com/wiki/Re-Animator_%281985%29",
      "Reanimated morgue body with visible head surgery, hospital/morgue clothing and stiff controlled movement.",
    ),
  ]));
}

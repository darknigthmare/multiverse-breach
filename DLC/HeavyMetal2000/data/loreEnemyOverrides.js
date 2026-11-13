// Heavy Metal 2000 — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Heavy Metal 2000", [
    candidate(
      RIFT_DRONE,
      "Tyler's Space Pirate",
      "Pirate blaster rifle",
      "blaster rifle burst",
      "Membre de l'equipage pirate de Tyler qui attaque Eden et poursuit Julie avec son armement de bord.",
      "A member of Tyler's pirate crew who attacks Eden and pursues Julie with shipboard weapons.",
      "https://www.sonypictures.com/movies/heavymetal2000",
      "Space pirate from the 2000 animated film, with the same rugged face, scavenged dark combat clothing and compact futuristic rifle visible in the selected film reference; no Nexus armor.",
    ),
    candidate(
      BREACH_STALKER,
      "Uroboris Reptilian Gladiator",
      "Arena blade and claws",
      "gladiator pounce",
      "Guerrier reptilien d'Uroboris issu du peuple que Tyler soumet apres son combat dans l'arene.",
      "A reptilian warrior from Uroboris, part of the people Tyler subjugates after the arena fight.",
      "https://en.wikipedia.org/wiki/Heavy_Metal_2000",
      "Tall muscular reptilian gladiator matching the film's Uroboris species, with scaled skin, arena harness and a simple film-visible melee weapon; no cybernetic redesign.",
    ),
    candidate(
      ANOMALY_PACK,
      "Tyler's Citadel Assault Squad",
      "Pirate rifles and breaching charges",
      "coordinated citadel assault",
      "Escouade de pirates envoyee par Tyler contre la citadelle de la fontaine d'immortalite.",
      "A pirate squad sent by Tyler against the citadel of the fountain of immortality.",
      "https://en.wikipedia.org/wiki/Heavy_Metal_2000",
      "Compact squad of Tyler's film-accurate space pirates sharing the same rugged industrial uniforms and weapons as the selected battle reference; no alien monsters or Nexus insignia.",
    ),
  ]));
}

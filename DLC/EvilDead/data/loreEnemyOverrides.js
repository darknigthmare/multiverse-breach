// Evil Dead — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Evil Dead", [
    candidate(
      RIFT_DRONE,
      "Deadite",
      "Claws and teeth",
      "claw, bite and possessed lunge",
      "Cadavre humain possede par les forces kandariennes, agressif et capable de bonds soudains.",
      "A human corpse possessed by Kandarian forces, aggressive and prone to sudden lunges.",
      "https://evildead.fandom.com/wiki/Deadite",
      "Possessed human corpse with clouded white eyes, distorted face and torn clothing from the selected Evil Dead era; no unrelated demon armor.",
    ),
    candidate(
      BREACH_STALKER,
      "Skeleton",
      "Sword and small shield",
      "sword slash",
      "Fantassin squelette de l'Armee des Tenebres combattant avec une lame et un petit bouclier.",
      "An Army of Darkness skeletal foot soldier that fights with a sword and small shield.",
      "https://evildead.fandom.com/wiki/Evil_Dead%3A_The_Game",
      "Army of Darkness skeletal foot soldier: exposed bone body, medieval scraps, sword and small shield where visible.",
    ),
  ]));
}

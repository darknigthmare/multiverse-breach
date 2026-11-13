// Lost Planet 2 — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Lost Planet 2", [
    candidate(
      RIFT_DRONE,
      "Sepia Akrid",
      "Sharp legs and claws",
      "leap and claw",
      "Petit Akrid vif dont le sac de T-ENG reste visible lorsqu'il bondit pour griffer.",
      "A small agile Akrid whose T-ENG sac remains visible as it leaps and claws.",
      "https://lostplanet.fandom.com/wiki/Sepia",
      "Small orange/red insectoid Akrid with exposed glowing thermal energy sac and sharp legs.",
    ),
    candidate(
      BREACH_STALKER,
      "Dongo Akrid",
      "Armored shell",
      "armored roll",
      "Akrid cuirasse qui se replie et roule sur le champ de bataille pour ecraser sa cible.",
      "An armored Akrid that curls up and rolls across the battlefield to crush its target.",
      "https://lostplanet.fandom.com/wiki/Dongo",
      "Armored beetle-like Akrid with thick shell plates, glowing thermal core and curled rolling posture.",
    ),
    candidate(
      ANOMALY_PACK,
      "NEVEC Soldier",
      "Ballistic or energy rifle",
      "rifle burst",
      "Soldat NEVEC en armure climatique qui maintient la pression avec des rafales de fusil.",
      "A cold-weather NEVEC soldier who maintains pressure with rifle bursts.",
      "https://lostplanet.fandom.com/wiki/NEVEC",
      "Human NEVEC combatant in cold-weather sci-fi armor, sealed helmet and standard ballistic or energy rifle.",
    ),
  ]));
}

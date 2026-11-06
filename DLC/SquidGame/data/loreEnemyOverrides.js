// Squid Game — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Squid Game", [
    candidate(
      RIFT_DRONE,
      "Pink Soldier",
      "Compact rifle",
      "rifle burst",
      "Garde masque au triangle charge d'executer les ordres armes des jeux.",
      "A triangle-masked guard tasked with carrying out the games' armed orders.",
      "https://squid-game.fandom.com/wiki/Guard",
      "Pink/red hooded jumpsuit, black full-face mask marked with a white triangle and compact firearm.",
    ),
    candidate(
      BREACH_STALKER,
      "Pink Manager",
      "Sidearm and radio",
      "command and sidearm shot",
      "Gestionnaire masque au carre qui coordonne les gardes et utilise son arme de poing si necessaire.",
      "A square-masked manager who coordinates guards and uses a sidearm when required.",
      "https://squid-game.fandom.com/wiki/Guard",
      "Pink/red hooded jumpsuit, black full-face mask marked with a white square; radio/sidearm only when shown.",
    ),
  ]));
}

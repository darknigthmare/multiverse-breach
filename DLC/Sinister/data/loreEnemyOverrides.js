// Sinister — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Sinister", [
    candidate(
      RIFT_DRONE,
      "Ghost Child",
      "Bare hands",
      "silent flank and grab",
      "Enfant victime de Bughuul qui se deplace silencieusement dans les angles morts avant de saisir.",
      "One of Bughuul's child victims, moving silently through blind spots before grabbing.",
      "https://sinister.fandom.com/wiki/Ghost_Children",
      "One of Bughuul's dead children: desaturated skin, darkened eyes and exact period clothing from a home-movie murder sequence.",
    ),
  ]));
}

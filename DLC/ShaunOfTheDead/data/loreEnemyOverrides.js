// Shaun of the Dead — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Shaun of the Dead", [
    candidate(
      RIFT_DRONE,
      "Zombie",
      "Hands and teeth",
      "grab and bite",
      "Londonien recemment transforme qui avance lentement pour agripper et mordre les survivants.",
      "A recently turned Londoner who shambles forward to grab and bite survivors.",
      "https://shaunofthedead.fandom.com/wiki/Zombies",
      "Recently dead human in ordinary London clothing; pale skin, blood around mouth, unfocused eyes and stiff gait.",
    ),
  ]));
}

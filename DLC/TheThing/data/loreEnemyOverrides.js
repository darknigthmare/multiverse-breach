// The Thing — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("The Thing", [
    candidate(
      RIFT_DRONE,
      "Dog-Thing",
      "Assimilating tendrils and kennel limbs",
      "kennel assimilation lunge",
      "Imitation du husky qui se deploie dans le chenil en tentacules, pattes articulees et masse assimilatrice.",
      "The husky imitation that unfolds in the kennel into tendrils, jointed limbs and an assimilating mass.",
      "https://www.universalpicturesathome.com/movies/the-thing-1982",
      "The 1982 film's kennel Dog-Thing: recognizable sled-dog head and fur splitting into wet tendrils, flower-like jaws and practical-effect jointed limbs; no generic wolf monster or 2011 creature design.",
    ),
    candidate(
      BREACH_STALKER,
      "Bennings-Thing",
      "Elongated hands and assimilation grip",
      "snowfield escape howl",
      "Assimilation inachevee de Bennings, encore humanoide, avec des mains deformees lors de sa fuite dans la neige.",
      "Bennings' incomplete assimilation, still humanoid with deformed hands during its escape into the snow.",
      "https://www.imdb.com/title/tt0084787/plotsummary/",
      "Bennings-Thing from the 1982 snowfield scene: adult station worker silhouette, torn winter layers, raw elongated malformed hands and open-mouthed howl; no extra tentacle crown or unrelated alien armor.",
    ),
    candidate(
      ANOMALY_PACK,
      "Palmer-Thing",
      "Split-head jaws and spider limbs",
      "blood-test breakout",
      "Imitation de Palmer revelee par le test sanguin, dont la tete se fend en machoire avant l'attaque de Windows.",
      "Palmer's imitation exposed by the blood test, its head splitting into jaws before attacking Windows.",
      "https://www.imdb.com/title/tt0084787/plotsummary/",
      "Palmer-Thing from the 1982 recreation-room blood test: work-clothed human torso with the head split vertically into a huge practical-effect mouth, restrained spider-like limbs and wet tissue; no Blair-Thing mass and no multiple characters.",
    ),
  ]));
}

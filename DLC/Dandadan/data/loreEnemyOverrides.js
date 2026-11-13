// Dandadan — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ ANOMALY_PACK, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Dandadan", [
    candidate(
      RIFT_DRONE,
      "Serpo",
      "Psychokinesis",
      "psychokinetic shockwave",
      "Alien Serpo utilisant ses facultes psychokinetiques pour repousser et immobiliser ses adversaires.",
      "A Serpo alien that uses psychokinesis to repel and restrain opponents.",
      "https://dandadan.fandom.com/wiki/Serpo",
      "True Serpo form: angular slug-like head, broad geometric torso, black body markings, crystal headlight eyes and four-digit hands.",
    ),
    candidate(
      ANOMALY_PACK,
      "Kur Soldier",
      "Bioengineered exosuit weapon modules",
      "exosuit weapon attack",
      "Soldat Kur protege par un exosquelette biofabrique dont les modules assurent l'attaque a distance.",
      "A Kur soldier protected by a bioengineered exosuit whose modules provide ranged attacks.",
      "https://dandadan.fandom.com/wiki/Kur",
      "Soft-bodied Kur enclosed in a bioengineered combat exosuit; use one exact suit from the reference gallery, with its shown weapon modules.",
    ),
  ]));
}

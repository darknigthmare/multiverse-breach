// House of the Dead 2 — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("House of the Dead 2", [
    candidate(
      RIFT_DRONE,
      "David",
      "Hands and teeth",
      "grab and bite",
      "Creature humanoide lente et commune qui attaque par morsure ou coup de bras.",
      "A slow common humanoid creature that attacks with bites and arm swipes.",
      "https://thehouseofthedead.fandom.com/wiki/David",
      "Exact 1998 David model: shirtless decayed humanoid in tattered jeans, one bulging eye, missing facial and chest flesh; no House of the Dead 4 redesign.",
    ),
    candidate(
      BREACH_STALKER,
      "Ebitan",
      "Claws and aquatic lunge",
      "canal ambush",
      "Creature aquatique qui surgit des canaux et frappe a courte portee.",
      "An aquatic creature that emerges from canals and strikes at close range.",
      "https://thehouseofthedead.fandom.com/wiki/Ebitan",
      "Exact House of the Dead 2 Ebitan aquatic humanoid, wet green-brown body, hunched posture and long clawed arms; no generic fish monster redesign.",
    ),
    candidate(
      ANOMALY_PACK,
      "Devilon",
      "Wings and claws",
      "diving claw attack",
      "Creature volante qui fond sur les agents avec ses griffes depuis les hauteurs de la ville.",
      "A flying creature that dives at the agents with its claws from above the city route.",
      "https://thehouseofthedead.fandom.com/wiki/Devilon",
      "Exact House of the Dead 2 Devilon: small red-brown batlike humanoid creature, broad membrane wings, pointed ears and clawed limbs; no giant demon armor.",
    ),
  ]));
}

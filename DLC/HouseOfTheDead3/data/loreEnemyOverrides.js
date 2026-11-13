// House of the Dead 3 — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("House of the Dead 3", [
    candidate(
      RIFT_DRONE,
      "Mark",
      "Hands and teeth",
      "facility rush",
      "Creature humanoide commune de l EFI qui accelere pour saisir et mordre les agents.",
      "A common EFI humanoid creature that accelerates to grab and bite the agents.",
      "https://thehouseofthedead.fandom.com/wiki/Mark",
      "Exact House of the Dead III Mark creature from the Sega guide art, preserving its ruined work clothing, decomposed head and facility-zombie proportions; no generic soldier armor.",
    ),
    candidate(
      BREACH_STALKER,
      "Rogan Commando",
      "Dual combat knives and kicks",
      "failed-team knife rush",
      "Ancien membre de l unite Rogan reanime dans l installation EFI, qui conserve son agilite et attaque avec deux couteaux de combat et des coups de pied.",
      "A reanimated member of Rogan's unit inside the EFI facility who retains his agility and attacks with two combat knives and kicks.",
      "https://thehouseofthedead.fandom.com/wiki/Rogan_Commando",
      "Exact House of the Dead III Rogan Commando: black undershirt, white collared shirt and white trousers, black sleeveless vest, gloves, boots, knee pads and cap, one large combat knife in each hand; no firearm, helmet or generic modern armor.",
    ),
    candidate(
      ANOMALY_PACK,
      "Cain",
      "Vine-like arms",
      "plant-hybrid vine sweep",
      "Hybride humain-vegetal de l EFI qui fouette les agents avec ses longs bras en forme de lianes.",
      "An EFI human-plant hybrid that lashes the agents with its long vine-like arms.",
      "https://thehouseofthedead.fandom.com/wiki/List_of_creatures_in_The_House_of_the_Dead_III",
      "Exact House of the Dead III Cain from the Sega Perfect Guide: low creature-plant hybrid with a bark-and-vine body, long flexible vine arms and rooted organic limbs; no biblical costume, humanoid clothing, dragon anatomy or generic reptile armor.",
    ),
  ]));
}

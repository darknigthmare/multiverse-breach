// Roger Rabbit — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Roger Rabbit", [
    candidate(
      RIFT_DRONE,
      "Smart Ass",
      "Revolver",
      "revolver shot",
      "Chef Toon des fouines de Doom, arme d'un revolver et reconnaissable a son costume violet.",
      "The Toon leader of Doom's weasels, armed with a revolver and marked by his purple suit.",
      "https://disney.fandom.com/wiki/Smart_Ass",
      "Tall Toon weasel in purple zoot suit and fedora, cigar and revolver; preserve exaggerated cartoon proportions.",
    ),
    candidate(
      BREACH_STALKER,
      "Greasy",
      "Switchblade",
      "knife slash",
      "Fouine Toon mince qui attaque avec son cran d'arret en profitant de ses membres extensibles.",
      "A thin Toon weasel that attacks with a switchblade and exaggerated flexible limbs.",
      "https://disney.fandom.com/wiki/Greasy",
      "Thin Toon weasel with green zoot suit, slick hair and switchblade; long flexible cartoon limbs.",
    ),
    candidate(
      ANOMALY_PACK,
      "Psycho",
      "Head and body",
      "leaping headbutt",
      "Fouine Toon en camisole qui se jette tete la premiere sur ses adversaires.",
      "A straitjacketed Toon weasel that hurls itself headfirst at opponents.",
      "https://disney.fandom.com/wiki/Psycho",
      "Toon weasel in straitjacket with wild red hair and unstable grin; attacks with body lunges.",
    ),
  ]));
}

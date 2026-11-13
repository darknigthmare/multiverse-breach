// Cool Spot — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Cool Spot", "cool_spot", "https://strategywiki.org/wiki/Cool_Spot/Walkthrough", [
    item("7UP Bottle", "Bouteille 7UP", "Single vintage green glass soda bottle, red circular cap motif, no copied label or lettering."),
    item("Cool Point Token", "Jeton Cool Point", "Small glossy red circular collectible token with a simple white highlight, no brand mark."),
    item("Health Beaker", "Fiole de sante", "Tiny clear laboratory beaker filled with bright restorative red liquid."),
    item("Cage Key", "Cle de cage", "Small brass cage key with a rounded bow and one chunky arcade-style tooth."),
  ]));
}

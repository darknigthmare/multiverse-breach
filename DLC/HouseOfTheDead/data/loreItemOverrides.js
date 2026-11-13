// House of the Dead — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("House of the Dead", "house_of_the_dead", "https://www.sega.jp/history/arcade/product/9038/", [
    item("AMS EATER Custom", "AMS EATER Custom", "Single original-1997 AMS EATER Custom semiautomatic handgun: compact black and gunmetal slide, squared trigger guard, dark textured grip and six-round magazine, with no readable branding."),
    item("Medical Kit", "Trousse medicale", "Single compact arcade medical kit with a rigid off-white case, red corner panels, short carry handle and one simple medical-cross color block without letters."),
    item("Golden Frog", "Grenouille doree", "Single small collectible frog statuette from Curien Mansion, crouched in profile and cast in bright worn gold with chunky arcade-era facets."),
    item("Gold Coin", "Piece d or", "Single thick round gold bonus coin with a raised concentric rim, simple starburst relief and no number, lettering or copied emblem."),
  ]));
}

// Starship Troopers — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Starship Troopers", "starship_troopers", "https://entertainment.ha.com/itm/movie-tv-memorabilia/props/starship-troopers-tri-star-1997-mobile-infantry-hero-morita-mk-i-rifle/a/7356-90530.s", [
    item("Morita Mk I Rifle", "Fusil Morita Mk I", "Single bulky black futuristic rifle with integrated underslung barrel and olive furniture."),
    item("Mobile Infantry Helmet", "Casque de l Infanterie mobile", "One grey-black infantry helmet with cheek guards, clear goggles and no unit markings."),
    item("Tactical Mini-nuke", "Mini-bombe tactique", "One compact olive tactical warhead with folding fins and red safety cap, no printed text."),
    item("Citizenship Pamphlet", "Brochure de citoyennete", "Single folded propaganda pamphlet with abstract heroic silhouettes and no copied slogan or logo."),
  ]));
}

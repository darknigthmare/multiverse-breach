// Lil Nas X — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Lil Nas X", "lil_nas_x", "https://www.grammy.com/news/lil-nas-x-creative-vision-montero-collaborators-roundtable-64th-grammy-awards/", [
    item("Cowboy Hat", "Chapeau de cowboy", "Single black western hat with silver chain band and subtle pink underside."),
    item("Montero Pole Ornament", "Ornement de pole Montero", "One ornate golden serpent-shaped pole finial detached as a single collectible object."),
    item("Star Walkin Sword", "Epee Star Walkin", "Single sleek fantasy sword with blue-purple cosmic blade and gold guard."),
    item("Horseshoe Microphone", "Microphone fer a cheval", "One gold handheld microphone with horseshoe-shaped grille frame and no logo."),
  ]));
}

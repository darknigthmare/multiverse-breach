// H2G2 — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("H2G2", "h2g2", "https://www.thepropgallery.com/the-hitchhikers-guide-to-the-galaxy-babel-fish", [
    item("Towel", "Serviette", "Single folded blue-grey travel towel with thick woven edge and no embroidery."),
    item("Electronic Guide", "Guide electronique", "One small black electronic guide device with green-lit screen and chunky side controls."),
    item("Babel Fish Bowl", "Bocal a poisson Babel", "Single clear spherical bowl containing one tiny yellow fish silhouette and blue water."),
    item("Point-of-View Gun", "Arme Point-of-View", "One sleek white curved sci-fi handheld device with violet emitter and smooth ergonomic grip."),
  ]));
}

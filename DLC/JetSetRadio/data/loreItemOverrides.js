// Jet Set Radio — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Jet Set Radio", "jet_set_radio", "https://shop.sega.com/collections/jet-set-radio", [
    item("Spray Can", "Bombe de peinture", "Single bright aerosol paint can with removable cap and bold color blocks but no logo or text."),
    item("Magnetic Inline Skates", "Rollers magnetiques", "One complete pair of chunky magnetic inline skates with neon wheels and industrial straps."),
    item("Graffiti Soul", "Graffiti Soul", "Small floating stylized soul token with angular street-art silhouette and saturated cyan-yellow palette."),
    item("Portable Radio", "Radio portable", "Compact portable boombox with twin speakers, cassette deck and vivid street palette without branding."),
  ]));
}

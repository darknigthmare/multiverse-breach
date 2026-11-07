// Altered Beast — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Altered Beast", "altered_beast", "https://segaretro.org/images/a/a7/AlteredBeast_Steam_manual.pdf", [
    item("Spirit Ball", "Orbe spirituel", "Small luminous blue-white energy sphere with a dense arcade glow and no container."),
    item("Centurion Bracer", "Brassard de centurion", "Single bronze Roman forearm bracer with worn leather straps and engraved ridges."),
    item("Beast Transformation Stone", "Pierre de transformation bestiale", "Rough ancient stone bearing one carved beast silhouette, warm amber energy in its cracks."),
    item("Zeus Lightning Urn", "Urne de foudre de Zeus", "Single dark Greek urn with bronze trim and contained forked lightning, no readable lettering."),
  ]));
}

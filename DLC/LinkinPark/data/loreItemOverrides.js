// Linkin Park — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Linkin Park", "linkin_park", "https://www.linkinpark.com/music", [
    item("Hybrid Soldier Tag", "Plaque du soldat Hybrid", "Single worn metal dog tag with an original winged-soldier silhouette and no copied title."),
    item("Platinum Turntable Disc", "Disque de platine", "One silver DJ turntable platter with concentric grooves and black center spindle."),
    item("Chester-style Microphone", "Microphone style Chester", "Single black live microphone with silver grille and a narrow white tape band."),
    item("Meteora Spray Can", "Bombe de peinture Meteora", "One grey-red aerosol can with original stencil-like color blocks and no copied lettering."),
  ]));
}

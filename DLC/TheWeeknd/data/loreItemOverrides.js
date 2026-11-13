// The Weeknd — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("The Weeknd", "the_weeknd", "https://pitchfork.com/thepitch/the-weeknd-director-alex-lill-unpacks-the-singer-eccentric-string-of-after-hours-tv-performances/", [
    item("Red-suit Sunglasses", "Lunettes du costume rouge", "Single pair of oversized square black sunglasses with amber-red reflected lights."),
    item("Starboy Cross", "Croix Starboy", "One faceted silver cross pendant on a short chain, original gem layout and no logo."),
    item("Bandage Roll", "Rouleau de bandage", "Single partly unrolled white medical bandage with a small dark-red stage stain."),
    item("Chrome Microphone", "Microphone chrome", "One polished chrome handheld vocal microphone with black grille and no branding."),
  ]));
}

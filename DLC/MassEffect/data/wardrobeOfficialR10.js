// Mass Effect — definitions consumed by src/game/wardrobeOfficialR10.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createOfficialCostumesR10({ make, n7 }) {
  return (make('Mass Effect', 'shepard', 'me3-n7-defender', 'N7 Defender Armor', 'Mass Effect 3 (2012) — N7 Warfare Gear', 'me3-2012', 'outfit-only', n7.fr, n7.en));
}

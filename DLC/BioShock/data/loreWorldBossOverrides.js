// BioShock — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "BioShock",
    "bioshock-atlas-fontaine-splicer-king",
    "Frank Fontaine - ADAM Mutant",
    "large",
    "BioShock (2007) - Point Prometheus finale",
    "https://bioshock.fandom.com/wiki/Frank_Fontaine",
    "Fontaine's huge ADAM-mutated body bound to the extraction rig, with elemental plasmid states and no generic Splicer crown.",
    [
      phase("adam-infusion", "Electric lunge", "Fire burst", "Ice slam"),
      phase("extraction-cycle", "Splicer reinforcement", "Health-station drain", "Little Sister extraction"),
    ],
  ));
}

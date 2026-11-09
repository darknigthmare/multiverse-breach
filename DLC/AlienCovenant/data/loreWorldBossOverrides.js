// Alien: Covenant — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Alien: Covenant",
    "alien-covenant-protomorph-cathedral",
    "Praetomorph",
    "large",
    "Alien: Covenant (2017) - Covenant cargo-bay finale",
    "https://avp.fandom.com/wiki/Praetomorph",
    "Covenant Praetomorph with elongated ridged skull, pale-black anatomy, thin limbs and long tail; no cathedral or Big Chap dome.",
    [
      phase("cargo-bay-hunt", "Wall leap", "Inner-jaw bite", "Tail strike"),
      phase("loader-arm", "Crane dodge", "Hull grapple", "Airlock ejection"),
    ],
  ));
}

// The Batman Who Laughs — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "The Batman Who Laughs",
    "the-batman-who-laughs-darkest-knight-core",
    "The Darkest Knight",
    "cosmic",
    "Dark Nights: Death Metal issue 5",
    "https://www.dc.com/comics/dark-nights-death-metal-2020/dark-nights-death-metal-5",
    "The Darkest Knight as a black cosmic silhouette with spiked crown and blue energy, manifested at multiple scales among broken realities.",
    [
      phase("dark-multiverse", "Reality fracture", "Robin King summons", "Cosmic energy sweep"),
      phase("reality-reset", "Arena rewrite", "Scale shift", "Narrative weakening strike"),
    ],
  ));
}

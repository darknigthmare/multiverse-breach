// Tenacious D — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Tenacious D",
    "tenacious-d-rock-demon-showdown",
    "Beelzeboss",
    "large",
    "Tenacious D in The Pick of Destiny (2006) - rock-off",
    "https://tenaciousd.fandom.com/wiki/Beelzeboss",
    "Beelzeboss as the red horned demon from the film with guitar and stage presence, preserving the rock-off rather than a generic demon brawl.",
    [
      phase("rock-off", "Demonic guitar riff", "Flame accent", "Rhythm challenge"),
      phase("destiny-counter", "Power slide", "Stage shockwave", "Reflective guitar finish"),
    ],
    { renderHeight: 286 },
  ));
}

// Demon Slayer — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Demon Slayer",
    "demon-slayer-muzan-kibutsuji",
    "Muzan Kibutsuji",
    "large",
    "Demon Slayer manga - Sunrise Countdown arc",
    "https://kimetsu-no-yaiba.fandom.com/wiki/Muzan_Kibutsuji",
    "Manga-locked final combat Muzan with multiple whip-like limbs and mouths, followed by the giant infant survival form; no anime-only extrapolation.",
    [
      phase("sunrise-countdown", "Whip barrage", "Mouth strike", "Poison blood"),
      phase("regeneration-collapse", "Cell division", "Drug debuffs", "Demon Slayer hold"),
      phase("infant-form", "Giant crawl", "Burrowing attempt", "Sunrise exposure"),
    ],
    { renderHeight: 310, footprint: { width: 2, height: 2, placement: "grid" } },
  ));
}

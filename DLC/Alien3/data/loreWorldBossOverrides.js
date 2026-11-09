// Alien 3 — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Alien 3",
    "alien-3-runner-alien",
    "Runner / Dragon",
    "large",
    "Alien 3 (1992) - Fury 161",
    "https://avp.fandom.com/wiki/Runner",
    "The brown quadrupedal Runner with smooth dome and fast ceiling posture, never a Warrior or Big Chap body.",
    [
      phase("fury-tunnels", "Ceiling sprint", "Human-decoy pursuit", "Ambush"),
      phase("foundry", "Molten lead trap", "Thermal shock", "Piston finish"),
    ],
  ));
}

// Jet Set Radio — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Jet Set Radio", [
    candidate(
      RIFT_DRONE,
      "Rokkaku Police Officer",
      "Police baton",
      "baton strike",
      "Policier anti-emeute de Tokyo-to poursuivant les skateurs avec sa matraque.",
      "A Tokyo-to riot police officer who pursues skaters with a baton.",
      "https://jetsetradio.fandom.com/wiki/Rokkaku_Police",
      "Tokyo-to police riot uniform with helmet, body armor and baton/firearm matching the selected game sprite.",
    ),
    candidate(
      BREACH_STALKER,
      "Golden Rhino Assassin",
      "Firearm",
      "aimed gunfire",
      "Agent des Golden Rhinos qui traque les Rudies avec des tirs precis.",
      "A Golden Rhinos operative who hunts Rudies with precise gunfire.",
      "https://jetsetradio.fandom.com/wiki/Golden_Rhinos",
      "Golden Rhino operative in black formal combat clothing with gold facial mask/marking and firearm.",
    ),
    candidate(
      ANOMALY_PACK,
      "Noise Tank",
      "Armored skates and body",
      "skating body check",
      "Rival en armure electronique qui percute ses adversaires a pleine vitesse sur ses rollers.",
      "An electronically armored rival who body-checks opponents at full speed on inline skates.",
      "https://jetsetradio.fandom.com/wiki/Noise_Tanks",
      "Blue robotic-looking skater outfit, full helmet/visor, inline skates and bulky electronic armor.",
    ),
  ]));
}

// Puppet Master — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Puppet Master",
    "puppet-master-totem-puppet-rite",
    "Sutekh",
    "stationary",
    "Puppet Master 4-5 - Sutekh and the Totems",
    "https://puppet-master.fandom.com/wiki/Sutekh",
    "Sutekh as the demonic ruler manifested through a shrine and Totem puppets, with human-scale puppets kept as separate units.",
    [
      phase("totem-command", "Totem summon", "Energy bolt", "Puppet suppression"),
      phase("shrine-manifestation", "Portal pulse", "Totem overcharge", "Decapitron counter"),
    ],
  ));
}

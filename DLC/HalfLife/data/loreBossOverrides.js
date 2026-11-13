// Half-Life — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Nihilanth',
      weapon: 'energy_orbs_and_teleport',
      special: 'Cranial Core Exposure',
      phases: ['Floats, fires energy orbs and teleports reinforcements', 'Opens the cranial machinery and exposes the vulnerable brain core'],
      lore: {
        fr: 'Nihilanth est le dernier etre de Xen affronte dans Half-Life.',
        en: 'Nihilanth is the final Xen being fought in Half-Life.'
      },
      referenceUrl: 'https://combineoverwiki.net/wiki/Nihilanth',
      visualAnchor: 'Exact giant fetal alien body, atrophied legs, third arm, wrist bindings and cranial machinery from Half-Life.'
    },
    {
      name: 'Combine Hunter-Chopper',
      weapon: 'pulse_cannon_and_mines',
      special: 'Mine Carpet',
      phases: ['Strafes with the pulse cannon and rotor wash', 'Drops a mine carpet while damaged sections emit smoke'],
      lore: {
        fr: 'Le Hunter-Chopper remplace le relay Overwatch, qui est un systeme et non un boss.',
        en: 'The Hunter-Chopper replaces the Overwatch relay, which is a system rather than a boss.'
      },
      referenceUrl: 'https://combineoverwiki.net/wiki/Hunter-Chopper',
      visualAnchor: 'Exact Combine Hunter-Chopper aircraft silhouette, rotors, organic-metal fuselage, pulse cannon and mine dispenser; entire vehicle visible.'
    }
  ]);
}

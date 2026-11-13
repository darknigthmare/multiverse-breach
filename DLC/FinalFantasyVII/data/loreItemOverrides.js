// Final Fantasy VII — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Final Fantasy VII", "final_fantasy_vii", "https://na.finalfantasy.com/titles/finalfantasy7", [
    item("Buster Sword", "Epee Buster", "Single original-1997 Buster Sword: immense weathered rectangular steel blade with clipped angled tip, two circular materia slots near the base, riveted dark guard, long burgundy-wrapped handle and small metal pommel."),
    item("Ribbon", "Ruban", "Single canonical status-protection accessory: narrow deep-crimson silk ribbon tied into a compact bow with two long forked tails, subtle protective sheen and no wearer or jewel."),
    item("Restore Materia", "Materia Restaurer", "Single translucent emerald-green Magic Materia sphere with a bright mako core, cloudy spiral facets and tiny internal star glints, no socket, stand or duplicate orb."),
    item("Bombing Mission Detonator", "Detonateur de la mission de sabotage", "Single compact AVALANCHE field detonator used to arm the Mako Reactor 1 charge: worn olive-black rectangular casing, guarded red arming switch, blank amber countdown window and short bundled red-black leads."),
  ]));
}

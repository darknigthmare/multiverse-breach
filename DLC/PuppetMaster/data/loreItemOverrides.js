// Puppet Master — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Puppet Master", "puppet_master", "https://puppet-master.fandom.com/wiki/Blade/Puppet", [
    item("Blade's Hook Knife", "Lame-crochet de Blade", "Single compact puppet-scale weapon combining one knife edge and one curved hook on a black grip."),
    item("Toulon's Trunk", "Malle de Toulon", "One small aged wooden puppet trunk with brass corners, leather handle and multiple drawers."),
    item("Animation Fluid Vial", "Fiole de fluide d animation", "Single slender glass vial filled with bright green animation fluid and capped by brass."),
    item("Jester Hat", "Bonnet de Jester", "One miniature black-white jester cap with four soft points and tiny bells."),
  ]));
}

// Chappie — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Chappie", "chappie", "https://theproptank.com/original-guard-key-prop-case/", [
    item("Consciousness USB", "Cle USB de conscience", "Single rugged black USB drive with colored tape tabs and exposed metal connector."),
    item("Guard Key", "Cle de garde", "One heavy industrial security key in a fitted black case, angular metal bow and short teeth."),
    item("Children's Book", "Livre pour enfant", "Single small worn illustrated children's book with bright shapes but no copied cover or text."),
    item("MOOSE Control Helmet", "Casque de controle MOOSE", "One bulky neural-control helmet with dark visor, side electrodes and military grey shell."),
  ]));
}

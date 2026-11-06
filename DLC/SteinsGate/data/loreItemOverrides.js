// Steins;Gate — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Steins;Gate", "steins_gate", "https://steinsgate.jp/sgflash.html", [
    item("PhoneWave (name subject to change)", "PhoneWave (nom provisoire)", "Single harmless fictional Future Gadget Laboratory prop: one worn white domestic microwave oven modified with exposed colorful cables, decorative circuit modules and one closed black flip phone attached to its side, no room, portal or second appliance."),
    item("IBN 5100", "IBN 5100", "Single rare mid-1970s portable computer terminal with a bulky cream-beige case, integrated small dark CRT, dense square keyboard, cassette-drive slot and ventilation panels, no modern laptop, readable branding or second machine."),
    item("Divergence Meter", "Divergence Meter", "Single handmade world-line meter with exactly eight exposed clear Nixie vacuum tubes in one horizontal row, warm amber filaments, perforated metal electronics base, copper wiring and dark side plates, no ninth tube or enclosed clock cabinet."),
    item("Metal Upa", "Upa metallique", "Single rare palm-sized silver Metal Upa capsule-toy figure with a rounded chubby body, simple wide face, two pointed ear fins, tiny limbs and one hanging loop, no capsule shell, living creature or duplicate mascot."),
  ]));
}

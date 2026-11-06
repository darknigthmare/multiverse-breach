// House of the Dead 2 — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("House of the Dead 2", "house_of_the_dead_2", "https://www.digitpress.com/library/manuals/dreamcast/house_dead_2.pdf", [
    item("Cougar Inox Handgun", "Pistolet Cougar Inox", "Single compact stainless semiautomatic AMS handgun used during the Goldman incident, with a pale metal slide, dark grip panels and no manufacturer mark or lettering."),
    item("First Aid Kit", "Trousse de premiers soins", "Single compact House of the Dead 2 rescue kit with a white hard shell, deep-red medical panels, metal latch and no readable label."),
    item("Chamber Plus 2", "Chambre Plus 2", "Single Original Mode capacity upgrade module: a small gunmetal cylinder with two additional brass chamber indicators, red locking collar and no written plus sign or number."),
    item("Original Mode Shotgun", "Fusil a pompe du mode Original", "Single short Original Mode pump-action shotgun with a dark steel receiver, worn brown wooden pump and stock, compact barrel and no duplicate weapon or loose ammunition."),
  ]));
}

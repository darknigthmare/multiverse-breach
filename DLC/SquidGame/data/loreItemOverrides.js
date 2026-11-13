// Squid Game — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Squid Game", "squid_game", "https://cdn.svc.asmodee.net/production-mixlore/uploads/2024/05/SITE_MIXLORE_SQUID_GAME_RULES_EN_1.pdf", [
    item("Dalgona Tin", "Boite de dalgona", "Single round silver tin containing one intact honeycomb candy with simple stamped shape."),
    item("Invitation Card", "Carte d invitation", "One black business card with three colored geometric shapes and no copied text."),
    item("Marbles", "Billes", "One small cloth pouch opened to reveal a single cluster of colorful glass marbles."),
    item("Player Patch", "Ecusson de joueur", "Single green fabric number patch with blank geometric blocks instead of readable digits."),
  ]));
}

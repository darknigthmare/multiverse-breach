// Bring Me the Horizon — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Bring Me the Horizon", "bring_me_horizon", "https://www.bmthofficial.com/music/", [
    item("Sempiternal Pendant", "Pendentif Sempiternal", "Single circular metal pendant with original interlaced geometric pattern and no copied logo."),
    item("Post Human Mask", "Masque Post Human", "One dark tactical face mask with red cyber-organic seams and no printed words."),
    item("Stage Microphone", "Microphone de scene", "Single battered black live microphone with red tape ring and no branding."),
    item("Guitar Pick", "Mediator", "One black guitar pick with a simple original white geometric mark and no logo."),
  ]));
}

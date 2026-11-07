// Gremlins — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Gremlins", "gremlins", "https://www.lego.com/en-ca/categories/adults-welcome/article/back-80s-lego-gizmo-gremlins", [
    item("Gizmo Gift Box", "Boite cadeau de Gizmo", "Single square antique gift box with carved wooden panels, air holes and brass latch."),
    item("Glass of Water", "Verre d eau", "One clear drinking glass filled with water, bright reflections and no other object."),
    item("Alarm Clock", "Reveil", "Single red bedside alarm clock showing nearly midnight with simplified unreadable dial marks."),
    item("Gizmo's Bow Tie", "Noeud papillon de Gizmo", "One small red fabric bow tie with elastic band and soft folds."),
  ]));
}

// Guns N Roses — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Guns N Roses", "guns_n_roses", "https://www.lemonde.fr/culture/article/2024/05/17/slash-guitariste-de-guns-n-roses-ce-disque-de-reprises-de-blues-est-cathartique-pour-moi_6233903_3246.html", [
    item("Slash's Top Hat", "Haut-de-forme de Slash", "Single tall black top hat with silver concho band and no copied emblem."),
    item("Slash's Les Paul", "Les Paul de Slash", "One sunburst single-cut electric guitar with cream binding and no copied brand."),
    item("Axl's Bandana", "Bandana d Axl", "Single folded red bandana with original white pattern and tied trailing ends."),
    item("Standing Microphone", "Microphone sur pied", "One silver stage microphone on a short black stand segment with no branding."),
  ]));
}

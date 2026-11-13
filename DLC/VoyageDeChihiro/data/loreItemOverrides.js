// Voyage de Chihiro — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Voyage de Chihiro", "spirited_away", "https://ghibli.fandom.com/wiki/Bath_Tokens", [
    item("Bath Token", "Jeton de bain", "Single carved wooden bathhouse token with simple geometric herb symbol and no readable text."),
    item("Herbal Dumpling", "Boule d herbes", "One large green medicinal dumpling with fibrous texture and a small bite-free silhouette."),
    item("Purple Hair Tie", "Elastique violet", "Single purple woven hair tie loop with a tiny sparkling thread detail."),
    item("Train Ticket", "Ticket de train", "One small pale paper train ticket with punched edge and abstract marks but no readable text."),
  ]));
}

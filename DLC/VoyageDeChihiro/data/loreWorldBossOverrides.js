// Voyage de Chihiro — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ finalPolicy }) {
  return (finalPolicy(
    "Voyage de Chihiro",
    "voyage-de-chihiro-no-face-gold-hunger",
    "nonCombatFinal",
    "Spirited Away (2001) - bathhouse and pig test",
    "Apaiser Sans-Visage, retrouver le vrai nom de Chihiro et reussir l'epreuve des parents de Yubaba.",
    "Calm No-Face, recover Chihiro's true name and pass Yubaba's test involving her parents.",
    "Sans-Visage est apaise plutot que vaincu, et l'epreuve finale est un choix.",
    "No-Face is calmed rather than defeated, and the final trial is a choice.",
    ["https://studioghibli.jp/films/spirited-away/"],
    "Bathhouse, water train and pig pen layers, No-Face calm/swollen/calm states, Yubaba portraits, seal and bouquet props.",
  ));
}

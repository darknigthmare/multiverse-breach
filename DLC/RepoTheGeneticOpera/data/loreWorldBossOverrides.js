// Repo! The Genetic Opera — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ finalPolicy }) {
  return (finalPolicy(
    "Repo! The Genetic Opera",
    "repo-the-genetic-opera-geneco-repo-opera",
    "nonCombatFinal",
    "Repo! The Genetic Opera - Genetic Opera finale",
    "Traverser la representation, reveler l'heritage de Shilo et resoudre le conflit familial sans transformer GeneCo en monstre.",
    "Navigate the performance, reveal Shilo's inheritance and resolve the family conflict without turning GeneCo into a monster.",
    "Le climax est musical, familial et politique; la mort de Rotti est scenarisee.",
    "The climax is musical, familial and political; Rotti's death is scripted.",
    ["https://repo.fandom.com/wiki/Rotti_Largo"],
    "Genetic Opera stage with Rotti, Shilo, masked Repo Man and GeneCo guards as separate actors, plus backstage and audience layers.",
  ));
}

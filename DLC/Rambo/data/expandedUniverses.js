// Rambo — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'rambo',
    universe: 'Rambo',
    mediaType: 'movie',
    faction: 'sciFi',
    mode: 'Tactics',
    difficulty: 'Hard',
    stage: 'Hope Mountain Manhunt',
    boss: 'Colonel Zaysen Fortress',
    cast: [
      ['john_rambo', 'John Rambo', 'slayer'],
      ['sam_trautman', 'Colonel Trautman', 'tactical'],
      ['co_bao', 'Co Bao', 'hacker']
    ],
    enemies: ['Sheriff Posse', 'Soviet Spetsnaz', 'Jungle Patrol'],
    bosses: ['Sheriff Teasle', 'Colonel Zaysen'],
    gear: [
      ['survival_knife', 'Rambo Survival Knife', 'Couteau de survie de Rambo'],
      ['compound_bow', 'Explosive Compound Bow', 'Arc a poulies explosif'],
      ['poncho', 'Mountain Poncho', 'Poncho de montagne']
    ],
    event: ['nothing_over', 'Nothing Is Over', 'Rien n est termine', 'Rambo vanishes from enemy sight, lays traps, and dismantles the command lane alone.', 'Rambo disparait des lignes de vue, pose des pieges et demantele seul la ligne de commandement.'],
    origin: ['John Rambo is a traumatized Green Beret repeatedly pushed back into wars by authorities who mistake survival for obedience.', 'John Rambo est un Beret vert traumatise que les autorites renvoient sans cesse a la guerre en confondant survie et obeissance.'],
    breach: ['A.R.C.A. extraction orders resemble another command sending him back into violence, so Trautman must help the Nexus earn his trust instead of requisitioning it.', 'les ordres d extraction A.R.C.A. ressemblent a un commandement de plus qui le renvoie a la violence, et Trautman doit aider le Nexus a gagner sa confiance.'],
    motif: 'wasteland',
    colors: ['#25301d', '#050604', '#b58b43']
  }));
}

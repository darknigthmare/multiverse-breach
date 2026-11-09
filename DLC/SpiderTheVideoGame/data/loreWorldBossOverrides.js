// Spider: The Video Game — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ finalPolicy }) {
  return (finalPolicy(
    "Spider: The Video Game",
    "spider-the-video-game-brain-final-lab",
    "stageSetpiece",
    "Spider: The Video Game - Brain final laboratory",
    "Attirer les attaques laser et la pointe du Cerveau vers les tiges electriques, puis frapper pendant son etourdissement.",
    "Bait the Brain's laser and stabbing attacks into the electric rods, then strike while it is stunned.",
    "Le protagoniste est l'araignee cybernetique reliee a l'esprit du Dr Michael Kelly; aucun super-heros ni symbiote n'appartient a cet univers.",
    "The protagonist is the cybernetic spider linked to Dr. Michael Kelly's mind; no superhero or symbiote belongs in this universe.",
    ["https://gamefaqs.gamespot.com/ps/198744-spider-the-video-game/faqs/60921"],
    "Insect-scale Evil Labs chamber with the Brain, glass-covered electric rods, giant electronics and interchangeable cyber-leg weapons.",
  ));
}

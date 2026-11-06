// Les Visiteurs du Futur — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ finalPolicy }) {
  return (finalPolicy(
    "Les Visiteurs du Futur",
    "les-visiteurs-du-futur-time-paradox-reactor",
    "nonCombatFinal",
    "Le Visiteur du futur film - Axomako continuity",
    "Infiltrer Axomako, saboter la chaine menant a l'explosion et evacuer avant la modification de la ligne temporelle.",
    "Infiltrate Axomako, sabotage the chain leading to the explosion and evacuate before the timeline changes.",
    "Le reacteur de paradoxe est invente; la finale repose sur des choix et factions humaines.",
    "The paradox reactor is invented; the finale relies on choices and human factions.",
    ["https://fr.wikipedia.org/wiki/Le_Visiteur_du_futur_%28film%29"],
    "Axomako facility, time device, opposing agents, evacuation gates and timeline effect layers; no living reactor.",
  ));
}

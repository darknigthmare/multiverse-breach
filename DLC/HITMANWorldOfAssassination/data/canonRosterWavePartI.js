// HITMAN — World of Assassination — definitions consumed by src/game/canonRosterWavePartI.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPartI() {
  return ({
    key: 'hitman_woa', universe: 'HITMAN — World of Assassination', aliases: ['Hitman'],
    continuity: 'IO Interactive World of Assassination trilogy',
    adaptationRule: 'Use original game-character silhouettes without actor likeness. Civilians are never enemies; harming a civilian fails the mission. Diana’s content is analysis and coordination.',
    visualAnchor: 'Elegant modern infiltration spaces, red-gray ICA equipment, tailored disguises, clean sightlines and environmental puzzle staging.',
    referenceUrl: 'https://ioi.dk/hitman-codename-47', colors: ['#34383d', '#0a0b0d', '#d34747'], motif: 'barcode', faction: 'stealth', mode: 'Tactics', difficulty: 'Expert',
    heroes: [
      { id: 'agent_47', name: 'Agent 47', role: 'tactical', weapon: 'ICA19 pistol', weaponType: 'gun', visualAnchor: 'Bald fictional assassin in black suit, white shirt, red tie and black gloves; stylized original face, no actor likeness.' },
      { id: 'diana_burnwood', name: 'Diana Burnwood', nonCombat: true, objective: 'Analyze intel, identify the valid route and keep civilians out of danger.', visualAnchor: 'Professional handler in dark tailored jacket with tablet and earpiece; original non-actor face.' },
      { id: 'lucas_grey', name: 'Lucas Grey', role: 'tactical', weapon: 'Suppressed rifle', weaponType: 'gun', visualAnchor: 'Fictional former operative in practical gray coat with suppressed rifle and original face.' }
    ],
    enemies: ['Providence Commando', 'ICA Assassination Agent', 'Syndicate Enforcer'], bosses: ['Erich Soders', 'The Maelstrom', 'Don Yates'],
    worldBoss: { id: 'arthur_edwards', name: 'Arthur Edwards — The Constant', nonCombat: true, objective: 'Expose Providence, secure the train route and force the Constant’s capture without harming bystanders.', visualAnchor: 'Tailored mastermind silhouette inside a sealed luxury train carriage with evidence nodes and original face.' },
    gear: ['ICA19 Silverballer', 'Fiber Wire', 'Lockpick'], stages: ['Paris Fashion Infiltration', 'Hokkaido Surgical Protocol', 'Carpathian Train'],
    event: { id: 'mission_story', name: 'Mission Story Opportunity', frName: 'Opportunité de mission' }
  });
}

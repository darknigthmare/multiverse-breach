// The Texas Chain Saw Massacre — definitions consumed by src/game/canonRosterWavePartM.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRows({ r }) {
  return (r('texas_chain_saw', 'The Texas Chain Saw Massacre', 'https://www.thetexaschainsawmassacre.com/',
    ['Sally Hardesty', { id: 'franklin', name: 'Franklin Hardesty', nonCombat: true, objective: 'Signal the safe route and unlock the roadside exit.' }, 'Jerry'],
    ['Farmhouse Pursuit', 'Generator Trap Route', 'Bone-Room Alarm'], ['The Hitchhiker', 'The Cook', 'Leatherface'],
    { id: 'family_house', name: 'Family House Escape Network', nonCombat: true, objective: 'Open the exits and evacuate every survivor without attacking the family.', visualAnchor: 'Sun-baked farmhouse, generator cables and three locked exits; no gore or person as target.' },
    ['Flash Camera', 'Fuel Can', 'Exit Fuse'], ['Texas Back Road', 'Family Farmhouse Escape', 'Dawn Highway Run'],
    { aliases: ['Leatherface', 'Texas Chainsaw Massacre'], continuity: 'The Texas Chain Saw Massacre (1974) film continuity', rule: 'No actor likeness, gore, dismemberment or torture imagery. Survivors navigate escape Trials; Leatherface retains the fictional mask and apron silhouette without blood.', anchor: 'Sun-bleached rural Texas, weathered farmhouse, rusted generators and clean horror silhouettes.' }));
}

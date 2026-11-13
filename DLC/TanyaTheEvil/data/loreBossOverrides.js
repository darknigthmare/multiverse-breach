// Tanya the Evil — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Anson Sioux',
      weapon: 'rifle_bayonet_and_computation_jewel',
      special: 'Relic-Fed Aerial Charge',
      phases: ['Uses rifle fire, bayonet rushes and aerial mage movement', 'The relic drives an unstable magic barrage below 50 percent health'],
      lore: {
        fr: 'Anson Sioux poursuit Tanya avec son fusil, sa baionnette et une puissance magique amplifiee.',
        en: 'Anson Sioux pursues Tanya with his rifle, bayonet and amplified magic power.'
      },
      referenceUrl: 'https://yenpress.com/titles/9780316512459-the-saga-of-tanya-the-evil-vol-1-light-novel',
      visualAnchor: 'Bearded Entente Alliance officer in the exact anime uniform with rifle, bayonet and computation jewel.'
    },
    {
      name: 'Mary Sioux',
      weapon: 'rifle_and_computation_jewel',
      special: 'Unstable Divine Artillery',
      phases: ['Uses aerial rifle volleys and explosive mage shells', 'Overcharges the computation jewel and suffers severe recoil below 35 percent health'],
      lore: {
        fr: 'Mary transforme son desir de vengeance en puissance magique difficile a controler.',
        en: 'Mary turns her desire for revenge into magic power that is difficult to control.'
      },
      referenceUrl: 'https://yenpress.com/series/the-saga-of-tanya-the-evil-light-novel',
      visualAnchor: 'Young blond Unified States soldier in the exact anime uniform with the canonical rifle and computation jewel.'
    }
  ]);
}
